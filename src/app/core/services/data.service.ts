import { Injectable, signal, inject } from '@angular/core';
import { Course, User, Promotion, EnrolledCourse, Certificate, CartItem, Category, CartResponse } from '../models/models';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  // Signals cho UI binding
  readonly courses = signal<Course[]>([]);
  readonly users = signal<User[]>([]);
  readonly promotions = signal<Promotion[]>([]);
  readonly enrolledCourses = signal<EnrolledCourse[]>([]);
  readonly certificates = signal<Certificate[]>([]);
  readonly cartItems = signal<CartItem[]>([]);
  readonly cartTotal = signal<number>(0);
  readonly categories = signal<string[]>(['Tất cả']);
  readonly categoriesRaw = signal<Category[]>([]);
  readonly adminStats = signal({
    totalUsers: 0,
    students: 0,
    instructors: 0,
    admins: 0,
    totalCourses: 0,
    totalCategories: 0
  });

  // Loading states
  readonly loadingCourses = signal(false);
  readonly loadingCart = signal(false);

  constructor() {
    this.loadCategories();
    this.loadCourses();
  }

  // ========================
  // COURSES
  // ========================
  loadCourses(params?: { search?: string; categoryId?: number; sortBy?: string; page?: number }) {
    this.loadingCourses.set(true);
    this.api.getCourses({
      page: params?.page ?? 1,
      pageSize: 12,
      search: params?.search,
      categoryId: params?.categoryId,
      sortBy: params?.sortBy
    }).subscribe({
      next: (res) => {
        const mapped = (res.data || []).map((k: any) => this.mapCourseFromApi(k));
        this.courses.set(mapped);
        this.loadingCourses.set(false);
      },
      error: () => this.loadingCourses.set(false)
    });
  }

  // ========================
  // CATEGORIES
  // ========================
  loadCategories() {
    this.api.getCategories().subscribe({
      next: (cats: Category[]) => {
        this.categoriesRaw.set(cats);
        const names = ['Tất cả', ...cats.map(c => c.ten)];
        this.categories.set(names);
      }
    });
  }

  // ========================
  // CART
  // ========================
  loadCart() {
    if (!this.auth.isLoggedIn()) return;
    this.loadingCart.set(true);
    this.api.getCart().subscribe({
      next: (res: CartResponse) => {
        const mappedItems = (res.items || []).map((i: any) => ({
          ...i,
          course: {
            id: i.khoaHoc?.maKhoaHoc,
            title: i.khoaHoc?.tieuDe,
            price: i.gia ?? i.khoaHoc?.giaGoc ?? 0,
            originalPrice: i.khoaHoc?.giaGoc,
            instructor: i.khoaHoc?.giangVien || 'Chưa có',
            image: i.khoaHoc?.anhUrl || '',
            level: 'Tất cả cấp độ',
            hours: 0
          }
        }));
        this.cartItems.set(mappedItems);
        this.cartTotal.set(res.tongTien || 0);
        this.loadingCart.set(false);
      },
      error: () => this.loadingCart.set(false)
    });
  }

  addToCart(courseId: number) {
    return this.api.addToCart(courseId);
  }

  removeFromCart(courseId: number) {
    return this.api.removeFromCart(courseId);
  }

  // ========================
  // LEARNING
  // ========================
  loadMyCourses() {
    if (!this.auth.isLoggedIn()) return;
    this.api.getMyCourses().subscribe({
      next: (data: any[]) => {
        const mapped = (data || []).map((t: any) => ({
          ...t,
          course: {
            id: t.khoaHoc?.maKhoaHoc,
            title: t.khoaHoc?.tieuDe,
            image: t.khoaHoc?.anhUrl || '',
            rating: t.khoaHoc?.tbdanhGia ?? 0,
            category: t.khoaHoc?.theLoai || 'Chưa phân loại',
            instructor: t.khoaHoc?.giangVien || 'Chưa có',
            modules: t.khoaHoc?.soLuongChuong ?? 0
          },
          progress: t.phanTramTienDo ?? 0
        }));
        this.enrolledCourses.set(mapped);
      }
    });
  }

  loadCertificates() {
    if (!this.auth.isLoggedIn()) return;
    this.api.getCertificates().subscribe({
      next: (data: any[]) => {
        const mapped = (data || []).map((c: any) => ({
          ...c,
          id: c.maChungChi,
          courseName: c.khoaHoc?.tieuDe,
          date: c.ngayPhat ? new Date(c.ngayPhat).toLocaleDateString('vi-VN') : '',
          source: 'EduLearn'
        }));
        this.certificates.set(mapped);
      }
    });
  }

  // ========================
  // USERS (Admin)
  // ========================
  loadUsers(page = 1, search?: string) {
    this.api.getUsers(page, 10, search).subscribe({
      next: (res) => {
        const mapped = (res.data || []).map((u: any) => this.mapUserFromApi(u));
        this.users.set(mapped);
        
        // Cập nhật thống kê sơ bộ (từ trang đầu tiên trả về totalCount)
        if (page === 1) {
          this.adminStats.update(s => ({ ...s, totalUsers: res.totalCount }));
        }
      }
    });
  }

  loadAdminStats() {
    // Gọi các endpoint nhẹ nhàng để lấy con số tổng quát
    this.api.getUsers(1, 1).subscribe(res => {
      this.adminStats.update(s => ({ ...s, totalUsers: res.totalCount }));
    });

    // Lấy danh sách để đếm vai trò (tạm thời lấy page 1, 100 users đầu tiên)
    this.api.getUsers(1, 100).subscribe(res => {
      const data = res.data || [];
      const students = data.filter((u: any) => u.vaiTro === 'HocVien').length;
      const instructors = data.filter((u: any) => u.vaiTro === 'GiaoVien').length;
      const admins = data.filter((u: any) => u.vaiTro === 'Admin').length;
      this.adminStats.update(s => ({ ...s, students, instructors, admins }));
    });

    this.api.getCourses({ page: 1, pageSize: 1 }).subscribe(res => {
      this.adminStats.update(s => ({ ...s, totalCourses: res.totalCount }));
    });

    this.api.getCategories().subscribe(res => {
      const d = Array.isArray(res) ? res : (res.data || []);
      this.adminStats.update(s => ({ ...s, totalCategories: d.length }));
    });
  }

  // ========================
  // HELPERS — Map API response to UI-friendly format
  // ========================
  private mapCourseFromApi(k: any): Course {
    const mainInstructor = (k.giangVien || []).find((g: any) => g.laGiangVienChinh)?.ten
      || (k.giangVien || [])[0]?.ten || 'Chưa có';

    return {
      ...k,
      id: k.maKhoaHoc,
      title: k.tieuDe,
      slug: this.toSlug(k.tieuDe),
      instructor: mainInstructor,
      rating: k.tbdanhGia ?? 0,
      reviewCount: this.formatCount(k.soLuongDanhGia ?? 0),
      price: k.khuyenMai?.phanTramGiam
        ? Math.round((k.giaGoc ?? 0) * (1 - k.khuyenMai.phanTramGiam / 100))
        : k.giaGoc ?? 0,
      originalPrice: k.giaGoc ?? 0,
      image: k.anhUrl || '',
      category: k.theLoai?.ten || 'Chưa phân loại',
      level: 'Tất cả cấp độ',
      modules: k.soLuongChuong ?? 0,
      students: k.soHocVien ?? 0,
      description: k.moTa
    };
  }

  private mapUserFromApi(u: any): User {
    return {
      ...u,
      id: u.maNguoiDung,
      name: u.ten,
      email: u.email,
      role: this.mapRole(u.vaiTro),
      initials: this.getInitials(u.ten || 'U'),
      color: this.getColorForUser(u.maNguoiDung),
      joinDate: u.ngayTao ? new Date(u.ngayTao).toLocaleDateString('vi-VN') : 'Mới',
      status: u.tinhTrang === 'Bị khóa' ? 'inactive' : 'active',
      coursesCount: u.vaiTro === 'GiaoVien' ? 5 : 0, // Mock số lượng khóa học cho giảng viên
      rating: 5
    };
  }

  private mapRole(vaiTro: string): string {
    const map: Record<string, string> = {
      'HocVien': 'student',
      'GiaoVien': 'instructor',
      'Admin': 'admin'
    };
    return map[vaiTro] || 'student';
  }

  private toSlug(str: string): string {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  }

  private getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  private getColorForUser(id: number): string {
    const colors = ['#5B63D3', '#FD7E14', '#28A745', '#17A2B8', '#6F42C1', '#DC3545'];
    return colors[id % colors.length];
  }
}
