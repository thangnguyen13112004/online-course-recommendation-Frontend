import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DataService } from '../../core/services/data.service';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { CourseDetail, Review } from '../../core/models/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  template: `
    <app-header />
    <div class="detail-page" *ngIf="course">
      <div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          Trang chủ › {{ course.theLoai?.ten || 'Danh mục' }} › {{ course.tieuDe }}
        </div>

        <!-- Hero -->
        <section class="detail-hero">
          <div class="hero-left">
            <div class="tag-row">
              <span class="badge badge-primary">{{ course.theLoai?.ten || 'Lập trình' }}</span>
              <span class="badge" style="background:var(--gray-200);color:var(--gray-600)">Tất cả cấp độ</span>
            </div>
            <h1>{{ course.tieuDe }}</h1>
            <p class="desc">{{ course.tieuDePhu || course.moTa || 'Khóa học tuyệt vời này giúp bạn nâng cao kỹ năng.' }}</p>
            <div class="meta-row">
              <span><i class="fa-solid fa-star" style="color: #fccc29;"></i> {{ course.tbdanhGia | number:'1.1-1' }} ({{ course.soLuongDanhGia }} đánh giá)</span>
              <span><i class="fa-solid fa-users"></i> {{ course.soHocVien | number }} học viên</span>
              <span><i class="fa-solid fa-box"></i> {{ course.soLuongBaiHoc }} bài học</span>
              <span>📅 {{ course.ngayCapNhat ? (course.ngayCapNhat | date:'yyyy') : '2024' }}</span>
            </div>
            <div class="instructor-row" *ngIf="course.giangVien?.length">
              Giảng viên: <strong>{{ course.giangVien![0].ten }}</strong>
            </div>
          </div>
        </section>

        <!-- Content -->
        <div class="detail-body">
          <div class="detail-main">
            <!-- Tabs -->
            <div class="tabs">
              <button class="tab" [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'">Tổng quan</button>
              <button class="tab" [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">Nội dung</button>
              <button class="tab" [class.active]="activeTab === 'reviews'" (click)="activeTab = 'reviews'">Đánh giá</button>
              <button class="tab" [class.active]="activeTab === 'instructor'" (click)="activeTab = 'instructor'">Giảng viên</button>
            </div>

            <!-- Content: Overview -->
            <div *ngIf="activeTab === 'overview'" class="tab-content">
               <div class="learn-section">
                <h3>Về khóa học này</h3>
                <p style="color: var(--gray-600); line-height: 1.6; margin-bottom: 24px;">
                  {{ course.moTa || 'Chưa có thông tin mô tả chi tiết.' }}
                </p>

                <h3 *ngIf="course.kiNang">Kỹ năng bạn sẽ đạt được</h3>
                <div class="learn-grid" *ngIf="course.kiNang">
                  <div class="learn-item" *ngFor="let skill of course.kiNang.split(',')">
                    ✔ {{ skill.trim() }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Content: Curriculum -->
            <div *ngIf="activeTab === 'content'" class="tab-content">
              <h3>Nội dung khóa học</h3>
              <p style="margin-bottom: 16px; color: var(--gray-600)">{{ course.soLuongChuong }} chương • {{ course.soLuongBaiHoc }} bài học</p>
              
              <div class="chapter-list">
                <div class="chapter-item card" *ngFor="let chapter of course.chuongs; let i = index">
                  <div class="chapter-header">
                    <h4>Chương {{ i + 1 }}: {{ chapter.tieuDe }}</h4>
                    <span class="chapter-meta">{{ chapter.baiHocs?.length || 0 }} bài học</span>
                  </div>
                  <div class="chapter-lessons">
                    <div class="lesson-item" *ngFor="let lesson of chapter.baiHocs">
                      <span class="lesson-icon" *ngIf="lesson.linkVideo"><i class="fa-solid fa-play"></i></span>
                      <span class="lesson-icon" *ngIf="!lesson.linkVideo">📄</span>
                      <span class="lesson-title">{{ lesson.lyThuyet ? lesson.lyThuyet.substring(0, 50) + '...' : 'Bài học' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content: Reviews -->
            <div *ngIf="activeTab === 'reviews'" class="tab-content review-section">
              <h3>Đánh giá từ học viên</h3>
              
              <div class="add-review card" *ngIf="isLoggedIn" style="margin-bottom: 20px; padding: 20px; background: var(--gray-50)">
                <h4 style="margin-top:0">Viết đánh giá của bạn</h4>
                <div style="margin-bottom: 12px">
                  <label style="display:block; margin-bottom: 4px; font-weight:600">Điểm đánh giá</label>
                  <select [(ngModel)]="reviewRating" class="form-control" style="width: 100px; padding: 8px; border: 1px solid var(--gray-300);">
                    <option [value]="5">5 Sao</option>
                    <option [value]="4">4 Sao</option>
                    <option [value]="3">3 Sao</option>
                    <option [value]="2">2 Sao</option>
                    <option [value]="1">1 Sao</option>
                  </select>
                </div>
                <div style="margin-bottom: 12px">
                  <label style="display:block; margin-bottom: 4px; font-weight:600">Bình luận</label>
                  <textarea [(ngModel)]="reviewText" rows="3" class="form-control" placeholder="Chia sẻ cảm nhận của bạn về khóa học này..." style="width: 100%; padding: 8px; border: 1px solid var(--gray-300); border-radius: 4px;"></textarea>
                </div>
                <button class="btn btn-primary" (click)="submitReview()">Gửi đánh giá</button>
              </div>
              <div *ngIf="!isLoggedIn" style="margin-bottom: 20px; padding: 15px; background: rgba(91,99,211,0.1); color: var(--primary); text-align: center; border-radius: 6px;">
                Đăng nhập để để lại đánh giá cho khóa học này.
              </div>

              <div *ngIf="!reviews.length" style="color:var(--gray-500); padding: 20px 0;">
                Chưa có đánh giá nào cho khóa học này.
              </div>
              <div class="review-card card" *ngFor="let review of reviews">
                <div class="review-header">
                  <div class="avatar" style="background:var(--primary-bg);color:var(--primary)">
                    {{ getInitials(review.nguoiDanhGia?.ten) }}
                  </div>
                  <div>
                    <strong>{{ review.nguoiDanhGia?.ten || 'Học viên ẩn danh' }}</strong>
                    <div class="stars">
                      {{ getStars(review.rating) }}
                      <span style="font-size: 11px; margin-left: 4px; color: var(--gray-400)">{{ review.ngayDanhGia | date:'dd/MM/yyyy' }}</span>
                    </div>
                  </div>
                </div>
                <p>{{ review.binhLuan || 'Người dùng không để lại bình luận.' }}</p>
              </div>
            </div>

            <!-- Content: Instructor -->
            <div *ngIf="activeTab === 'instructor'" class="tab-content">
               <h3>Giảng viên</h3>
               <div class="instructor-card card" *ngFor="let ins of course.giangVien">
                 <div class="ins-header">
                   <div class="ins-avatar">
                     <img *ngIf="ins.linkAnhDaiDien" [src]="ins.linkAnhDaiDien" alt="">
                     <span *ngIf="!ins.linkAnhDaiDien" style="font-size: 24px; color: var(--gray-600)">{{ getInitials(ins.ten) }}</span>
                   </div>
                   <div class="ins-info">
                     <h4 style="margin: 0; font-size: 18px">{{ ins.ten }}</h4>
                     <p style="color: var(--gray-500); font-size: 14px; margin: 4px 0 0 0">{{ ins.laGiangVienChinh ? 'Giảng viên chính' : 'Trợ giảng' }}</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="detail-sidebar">
            <div class="price-card card">
              <div class="price-image">
                <img *ngIf="course.anhUrl && course.anhUrl.startsWith('http')" [src]="course.anhUrl" alt="Course" style="width: 100%; height: 100%; object-fit: cover;" (error)="course.anhUrl = ''">
                <div *ngIf="!course.anhUrl || !course.anhUrl.startsWith('http')" style="font-size: 64px; display:flex; justify-content:center; align-items:center; height:100%"><i class="fa-solid fa-book"></i></div>
              </div>
              <div class="price-info">
                <span class="price-main">{{ getDiscountedPrice(course) | number }}đ</span>
                <span class="price-original" *ngIf="course.khuyenMai">{{ course.giaGoc | number }}đ</span>
                
                <button class="btn btn-primary btn-lg" style="width:100%" (click)="addToCart()" [disabled]="cartLoading">
                  <ng-container *ngIf="!cartLoading"><i class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ hàng</ng-container>
                  <ng-container *ngIf="cartLoading">⏳ Đang xử lý...</ng-container>
                </button>
                <button class="btn btn-outline" style="width:100%;margin-top:8px" (click)="toggleLike()" [ngClass]="{'liked': isLiked}">
                  <span *ngIf="!isLiked">♡ Thêm vào yêu thích</span>
                  <span *ngIf="isLiked" style="color: red;">❤️ Đã yêu thích</span>
                </button>
                <p class="refund">🔒 Hoàn tiền 30 ngày</p>
                <ul class="features">
                  <li>✔ Truy cập mọi lúc mọi nơi</li>
                  <li>✔ Học trên nhiều thiết bị</li>
                  <li>✔ Chứng chỉ hoàn thành</li>
                  <li>✔ Tài liệu tải về</li>
                </ul>
              </div>
            </div>

            <div class="related-section" *ngIf="similarCourses.length">
              <h4>Gợi ý cho bạn</h4>
              <div class="related-item card" *ngFor="let c of similarCourses" style="cursor: pointer" (click)="goToCourse(c.courseId)">
                <div class="related-icon" style="font-size: 18px"><i class="fa-solid fa-bullseye"></i></div>
                <div class="related-info">
                  <strong>{{ c.title }}</strong>
                  <span class="price-sm">{{ c.score | number:'1.2-2' }} điểm phù hợp</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
    <div *ngIf="!course && !loading" style="padding: 100px; text-align: center; color: var(--gray-500);">
      <h2>Không tìm thấy khóa học</h2>
      <a routerLink="/course" style="color: var(--primary); margin-top: 16px; display: inline-block;">Quay lại danh sách</a>
    </div>
    <div *ngIf="loading" style="padding: 100px; text-align: center;">
      <h2>Đang tải thông tin...</h2>
    </div>
  `,
  styles: [`
    .detail-page { background: var(--gray-50); min-height: calc(100vh - 72px); }
    .breadcrumb {
      padding: 16px 0;
      font-size: 13px;
      color: var(--gray-500);
    }
    .detail-hero {
      background: linear-gradient(135deg, var(--primary), #3D4399);
      color: var(--white);
      padding: 32px;
      border-radius: var(--radius-lg);
      margin-bottom: 24px;
    }
    .tag-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    .detail-hero h1 {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .desc {
      opacity: 0.85;
      font-size: 15px;
      margin-bottom: 16px;
    }
    .meta-row {
      display: flex;
      gap: 20px;
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 12px;
    }
    .instructor-row {
      font-size: 14px;
    }
    .detail-body {
      display: flex;
      gap: 24px;
      padding-bottom: 60px;
    }
    .detail-main { flex: 1; }
    .tabs {
      display: flex;
      border-bottom: 2px solid var(--gray-200);
      margin-bottom: 24px;
    }
    .tab {
      padding: 12px 20px;
      background: none;
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-500);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: var(--transition);
      cursor: pointer;
    }
    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }
    .tab-content {
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .learn-section, .review-section {
      margin-bottom: 28px;
    }
    .learn-section h3, .review-section h3 {
      font-size: 18px;
      margin-bottom: 16px;
    }
    .learn-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .learn-item {
      font-size: 14px;
      color: var(--gray-600);
      background: var(--white);
      padding: 12px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--gray-200);
    }
    .chapter-item {
      margin-bottom: 16px;
      border-radius: var(--radius-sm);
      overflow: hidden;
    }
    .chapter-header {
      padding: 16px;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chapter-header h4 { font-size: 15px; margin: 0; }
    .chapter-meta { font-size: 13px; color: var(--gray-500); }
    .chapter-lessons {
      padding: 12px 16px;
    }
    .lesson-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      font-size: 14px;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-100);
    }
    .lesson-item:last-child {
      border-bottom: none;
    }
    .lesson-icon { color: var(--gray-400); font-size: 12px; }
    .review-card {
      padding: 16px;
      margin-bottom: 16px;
    }
    .review-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    .avatar {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: bold;
    }
    .instructor-card {
      padding: 24px;
    }
    .ins-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .ins-avatar {
      width: 64px; height: 64px; border-radius: 50%;
      background: var(--gray-200);
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    .ins-avatar img {
      width: 100%; height: 100%; object-fit: cover;
    }
    .detail-sidebar {
      width: 340px;
      flex-shrink: 0;
    }
    .price-card {
      position: sticky;
      top: 72px;
      overflow: hidden;
    }
    .price-image {
      height: 160px;
      background: var(--primary-bg);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .price-info {
      padding: 20px;
    }
    .price-main {
      font-size: 28px;
      font-weight: 800;
      color: var(--primary);
      display: block;
    }
    .price-original {
      text-decoration: line-through;
      color: var(--gray-400);
      font-size: 14px;
      display: block;
      margin-bottom: 16px;
    }
    .refund {
      text-align: center;
      font-size: 12px;
      color: var(--gray-500);
      margin: 12px 0;
    }
    .features {
      list-style: none;
    }
    .features li {
      font-size: 13px;
      padding: 4px 0;
      color: var(--gray-600);
    }
    .related-section {
      margin-top: 24px;
    }
    .related-section h4 {
      font-size: 16px;
      margin-bottom: 12px;
    }
    .related-item {
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      transition: transform 0.2s;
    }
    .related-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
    .related-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-bg);
      border-radius: var(--radius-sm);
    }
    .related-info {
      flex: 1;
    }
    .related-info strong {
      display: block;
      font-size: 13px;
    }
    .price-sm {
      color: var(--success);
      font-size: 12px;
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private dataService = inject(DataService);
  private authService = inject(AuthService);

  courseId!: number;
  course: CourseDetail | null = null;
  loading = true;
  activeTab: 'overview' | 'content' | 'reviews' | 'instructor' = 'overview';

  reviews: Review[] = [];
  similarCourses: any[] = [];
  cartLoading = false;
  isLiked = false;
  reviewText = '';
  reviewRating = 5;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId = +id;
        this.loadCourseData();
        this.loadReviews();
        this.loadSimilarCourses();
        this.checkLikeStatus();
      }
    });
  }

  checkLikeStatus() {
    if (this.authService.isLoggedIn()) {
      this.apiService.getLikedCourses().subscribe({
        next: (likes: any[]) => {
          this.isLiked = likes.some((l: any) => l.maKhoaHoc === this.courseId || l.MaKhoaHoc === this.courseId);
        }
      });
    }
  }

  loadCourseData() {
    this.loading = true;
    console.log('[CourseDetail] Loading course data for id:', this.courseId);
    this.apiService.getCourseById(this.courseId).subscribe({
      next: (data) => {
        console.log('[CourseDetail] API response received:', data);
        this.course = data as CourseDetail;
        this.loading = false;
        console.log('[CourseDetail] course set, loading =', this.loading);
      },
      error: (err) => {
        console.error('[CourseDetail] API error:', err);
        this.course = null;
        this.loading = false;
      }
    });
  }

  loadReviews() {
    this.apiService.getCourseReviews(this.courseId).subscribe({
      next: (res) => {
        this.reviews = res.data || [];
      },
      error: () => {
        this.reviews = [];
      }
    });
  }

  loadSimilarCourses() {
    this.apiService.getSimilarCourses(this.courseId).subscribe({
      next: (res) => {
        this.similarCourses = res || [];
      },
      error: () => {
        this.similarCourses = [];
      }
    });
  }

  goToCourse(id: number) {
    this.router.navigate(['/course', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Yêu cầu đăng nhập',
        text: 'Vui lòng đăng nhập để thêm vào giỏ hàng.',
        confirmButtonColor: '#5a67d8',
        confirmButtonText: 'Đến trang đăng nhập'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    this.cartLoading = true;
    this.dataService.addToCart(this.courseId).subscribe({
      next: () => {
        this.cartLoading = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Đã thêm vào giỏ hàng!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        this.dataService.loadCart();
      },
      error: (err) => {
        this.cartLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: err.error?.message || 'Có lỗi xảy ra.',
          confirmButtonColor: '#5a67d8'
        });
      }
    });
  }

  toggleLike() {
    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Yêu cầu đăng nhập',
        text: 'Vui lòng đăng nhập để lưu khóa học yêu thích.',
        confirmButtonColor: '#5a67d8',
      }).then((result) => {
        if (result.isConfirmed) this.router.navigate(['/login']);
      });
      return;
    }
    this.apiService.toggleLike(this.courseId).subscribe({
      next: (res) => {
        this.isLiked = res.liked;
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 2000 });
      },
      error: () => Swal.fire('Lỗi', 'Không thể thao tác yêu thích', 'error')
    });
  }

  submitReview() {
    if (!this.reviewText.trim()) {
      Swal.fire('Lỗi', 'Vui lòng nhập nội dung đánh giá', 'warning');
      return;
    }
    this.apiService.rateCourse(this.courseId, this.reviewRating, this.reviewText).subscribe({
      next: (res) => {
        Swal.fire('Thành công', res.message, 'success');
        this.reviewText = '';
        this.reviewRating = 5;
        this.loadReviews();
      },
      error: (err) => Swal.fire('Lỗi', err.error?.message || 'Không thể gửi đánh giá', 'error')
    });
  }

  getDiscountedPrice(course: CourseDetail): number {
    if (!course.khuyenMai || !course.khuyenMai.phanTramGiam) return course.giaGoc || 0;
    return Math.round((course.giaGoc || 0) * (1 - course.khuyenMai.phanTramGiam / 100));
  }

  getInitials(name?: string): string {
    if (!name) return 'HV';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  getStars(rating?: number): string {
    if (!rating) return '★★★★★';
    const num = Math.round(rating);
    return '★'.repeat(num) + '☆'.repeat(5 - num);
  }
}
