import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header />
    <div class="detail-page">
      <div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">Trang chủ › Lập trình › Python</div>

        <!-- Hero -->
        <section class="detail-hero">
          <div class="hero-left">
            <div class="tag-row">
              <span class="badge badge-primary">Lập trình</span>
              <span class="badge" style="background:var(--gray-200);color:var(--gray-600)">Tất cả cấp độ</span>
              <span class="badge badge-primary">🤖 98% phù hợp</span>
            </div>
            <h1>Lập trình Python từ cơ bản đến nâng cao</h1>
            <p class="desc">Khóa học toàn diện giúp bạn nắm vững Python từ cơ bản đến nâng cao với các dự án thực tế</p>
            <div class="meta-row">
              <span>⭐ 4.8 (1.240 đánh giá)</span>
              <span>👥 12.450 học viên</span>
              <span>⏱ 42 giờ</span>
              <span>📦 8 mô-đun</span>
              <span>📅 2024</span>
            </div>
            <div class="instructor-row">
              Giảng viên: <strong>Nguyễn Văn An</strong>
            </div>
          </div>
        </section>

        <!-- Content -->
        <div class="detail-body">
          <div class="detail-main">
            <!-- Tabs -->
            <div class="tabs">
              <button class="tab active">Tổng quan</button>
              <button class="tab">Nội dung</button>
              <button class="tab">Đánh giá</button>
              <button class="tab">Giảng viên</button>
            </div>

            <!-- What you'll learn -->
            <div class="learn-section">
              <h3>Bạn sẽ học được gì</h3>
              <div class="learn-grid">
                <div class="learn-item">✔ Nắm vững Python từ A-Z</div>
                <div class="learn-item">✔ Xây dựng web app với Flask</div>
                <div class="learn-item">✔ Data Science với Pandas</div>
                <div class="learn-item">✔ Machine Learning cơ bản</div>
                <div class="learn-item">✔ Tự động hóa với scripts</div>
                <div class="learn-item">✔ REST API & Web Scraping</div>
              </div>
            </div>

            <!-- Reviews -->
            <div class="review-section">
              <h3>Đánh giá nổi bật</h3>
              <div class="review-card card">
                <div class="review-header">
                  <div class="avatar" style="background:var(--primary-bg);color:var(--primary)">MT</div>
                  <div>
                    <strong>Minh Tuấn</strong>
                    <div class="stars">★★★★★</div>
                  </div>
                </div>
                <p>Khóa học rất chi tiết và dễ hiểu. Giảng viên giải thích rõ ràng từng bước. Tôi đã học xong và áp dụng được ngay!</p>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="detail-sidebar">
            <div class="price-card card">
              <div class="price-image">📦</div>
              <div class="price-info">
                <span class="price-main">299.000đ</span>
                <span class="price-original">599.000đ</span>
                <button class="btn btn-primary btn-lg" style="width:100%">🛒 Thêm vào giỏ hàng</button>
                <button class="btn btn-outline" style="width:100%;margin-top:8px">► Học thử miễn phí</button>
                <p class="refund">🔒 Hoàn tiền 30 ngày</p>
                <ul class="features">
                  <li>✔ 42 giờ video HD</li>
                  <li>✔ Truy cập trọn đời</li>
                  <li>✔ Chứng chỉ hoàn thành</li>
                  <li>✔ Tài tài liệu về</li>
                </ul>
              </div>
            </div>

            <div class="related-section">
              <h4>Khóa học liên quan</h4>
              <div *ngFor="let c of relatedCourses" class="related-item card">
                <span class="related-icon">📦</span>
                <div class="related-info">
                  <strong>{{ c.name }}</strong>
                  <span class="price-sm">{{ c.price }}</span>
                </div>
                <button class="btn btn-outline btn-sm">+ Giỏ</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-page { background: var(--gray-50); }
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
    }
    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
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
      gap: 10px;
    }
    .learn-item {
      font-size: 14px;
      color: var(--gray-600);
    }
    .review-card {
      padding: 16px;
    }
    .review-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
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
      height: 120px;
      background: var(--primary-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
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
    }
    .related-icon {
      font-size: 28px;
      width: 48px;
      height: 48px;
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
      color: var(--primary);
      font-weight: 700;
      font-size: 14px;
    }
  `]
})
export class CourseDetailComponent {
  relatedCourses = [
    { name: 'Machine Learning A-Z', price: '499.000đ' },
    { name: 'Node.js & API', price: '329.000đ' },
  ];
}
