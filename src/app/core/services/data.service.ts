import { Injectable, signal } from '@angular/core';
import { Course, User, Promotion, EnrolledCourse, Certificate, CartItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly courses = signal<Course[]>([
    { id: 1, title: 'Python từ cơ bản đến nâng cao', slug: 'python-co-ban', instructor: 'Nguyễn Văn An', rating: 4.8, reviewCount: '1.2k', price: 299000, originalPrice: 599000, image: '🐍', category: 'Lập trình', level: 'Tất cả cấp độ', aiMatch: 98, hours: 42, modules: 8, students: 12450, year: 2024, description: 'Khóa học toàn diện giúp bạn nắm vững Python từ cơ bản đến nâng cao với các dự án thực tế', source: 'Coursera' },
    { id: 2, title: 'React & TypeScript hiện đại', slug: 'react-typescript', instructor: 'Trần Thị Bích', rating: 4.8, reviewCount: '1.2k', price: 349000, originalPrice: 699000, image: '⚛️', category: 'Frontend', level: 'Trung cấp', aiMatch: 95, hours: 38, modules: 10, students: 8900, year: 2024, description: 'Xây dựng ứng dụng hiện đại với React và TypeScript', source: 'Udemy', aiReason: 'Người học tương tự bạn cũng đăng ký khóa này' },
    { id: 3, title: 'Machine Learning với TensorFlow', slug: 'ml-tensorflow', instructor: 'Lê Minh Tú', rating: 4.8, reviewCount: '1.2k', price: 499000, originalPrice: 999000, image: '🤖', category: 'AI/ML', level: 'Nâng cao', aiMatch: 91, hours: 56, modules: 12, students: 6700, year: 2024, description: 'Học Machine Learning từ A-Z với TensorFlow', source: 'edX', aiReason: 'Tiếp nối lộ trình học AI/ML của bạn' },
    { id: 4, title: 'UI/UX chuyên nghiệp với Figma', slug: 'uiux-figma', instructor: 'Phạm Thanh Hà', rating: 4.8, reviewCount: '1.2k', price: 259000, originalPrice: 519000, image: '🎨', category: 'Design', level: 'Cơ bản', aiMatch: 88, hours: 28, modules: 6, students: 5400, year: 2024, description: 'Thiết kế UI/UX chuyên nghiệp với Figma', source: 'LinkedIn' },
    { id: 5, title: 'Node.js & REST API', slug: 'nodejs-api', instructor: 'Hoàng Đức Minh', rating: 4.8, reviewCount: '1.2k', price: 329000, originalPrice: 659000, image: '🟢', category: 'Lập trình', level: 'Trung cấp', hours: 35, modules: 8, students: 7200, year: 2024, source: 'Coursera' },
    { id: 6, title: 'SQL & Database', slug: 'sql-database', instructor: 'Vũ Thị Lan', rating: 4.8, reviewCount: '1.2k', price: 199000, originalPrice: 399000, image: '🗄️', category: 'Database', level: 'Cơ bản', hours: 24, modules: 6, students: 9800, year: 2024, source: 'Udemy' },
    { id: 7, title: 'Flutter & Dart', slug: 'flutter-dart', instructor: 'Nguyễn Bảo Long', rating: 4.8, reviewCount: '1.2k', price: 399000, originalPrice: 799000, image: '🐦', category: 'Mobile', level: 'Trung cấp', hours: 40, modules: 10, students: 4300, year: 2024, source: 'Coursera' },
    { id: 8, title: 'Docker & K8s', slug: 'docker-k8s', instructor: 'Đặng Văn Khải', rating: 4.8, reviewCount: '1.2k', price: 449000, originalPrice: 899000, image: '🐋', category: 'DevOps', level: 'Nâng cao', hours: 45, modules: 12, students: 3200, year: 2024, source: 'edX' },
  ]);

  readonly users = signal<User[]>([
    { id: 1, name: 'Nguyễn Ngọc Thắng', email: 'thang@email.com', role: 'student', initials: 'NT', color: '#5B63D3', joinDate: '15/01/2025', status: 'active', coursesCount: 3, rating: 5 },
    { id: 2, name: 'Đoàn Duy Hiếu', email: 'hieu@email.com', role: 'instructor', initials: 'DH', color: '#FD7E14', joinDate: '20/02/2025', status: 'active', coursesCount: 2, rating: 5 },
    { id: 3, name: 'Huỳnh Mộng Tuyền', email: 'tuyen@email.com', role: 'student', initials: 'HT', color: '#28A745', joinDate: '01/03/2025', status: 'inactive', coursesCount: 0, rating: 5 },
    { id: 4, name: 'Trần Văn Bình', email: 'binh@email.com', role: 'student', initials: 'TV', color: '#17A2B8', joinDate: '10/03/2025', status: 'active', coursesCount: 5, rating: 5 },
    { id: 5, name: 'Lê Thị Anh', email: 'anh@email.com', role: 'student', initials: 'LA', color: '#6F42C1', joinDate: '12/03/2025', status: 'active', coursesCount: 1, rating: 5 },
    { id: 6, name: 'Phạm Minh', email: 'minh@email.com', role: 'instructor', initials: 'PM', color: '#DC3545', joinDate: '13/03/2025', status: 'active', coursesCount: 3, rating: 5 },
  ]);

  readonly promotions = signal<Promotion[]>([
    { id: 1, code: 'GIAM50', type: 'percent', value: 50, condition: 'Đơn ≥ 300k', usedCount: 124, expiryDate: '31/03/2026', status: 'active' },
    { id: 2, code: 'NEWUSER', type: 'percent', value: 20, condition: 'Lần đầu mua', usedCount: 892, expiryDate: '30/06/2026', status: 'active' },
    { id: 3, code: 'SUMMER25', type: 'percent', value: 25, condition: 'Tất cả đơn', usedCount: 56, expiryDate: '15/03/2026', status: 'expired' },
    { id: 4, code: 'FLASH100', type: 'fixed', value: 100000, condition: 'Đơn ≥ 500k', usedCount: 23, expiryDate: '20/03/2026', status: 'active' },
    { id: 5, code: 'VIP30', type: 'percent', value: 30, condition: 'Thành viên VIP', usedCount: 210, expiryDate: '01/12/2026', status: 'active' },
  ]);

  readonly enrolledCourses = signal<EnrolledCourse[]>([
    { course: this.courses()[0], progress: 65, modules: 8 },
    { course: this.courses()[2], progress: 30, modules: 12 },
  ]);

  readonly certificates = signal<Certificate[]>([
    { id: 1, courseName: 'Python for Beginners', source: 'Coursera', date: '15/01/2025' },
    { id: 2, courseName: 'React Development', source: 'Udemy', date: '20/02/2025' },
  ]);

  readonly cartItems = signal<CartItem[]>([
    { course: this.courses()[1], quantity: 1 },
    { course: this.courses()[3], quantity: 1 },
  ]);

  readonly categories = signal<string[]>(['Tất cả', 'Lập trình', 'Frontend', 'AI/ML', 'Design', 'Database', 'Mobile', 'DevOps']);
}
