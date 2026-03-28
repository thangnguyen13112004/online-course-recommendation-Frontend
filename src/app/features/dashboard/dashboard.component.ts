import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, CourseCardComponent],
  template: `
    <app-header [isAuthenticated]="true" />

    <!-- Dashboard Hero -->
    <section class="dash-hero">
      <div class="container">
        <span class="dash-badge">🤖 AI đã cập nhật gợi ý mới cho bạn!</span>
        <h1>Chào mừng trở lại! 👋</h1>
        <p>Tiếp tục hành trình học tập của bạn</p>

        <div class="dash-stats">
          <div class="dash-stat"><span class="num">2</span><span class="lbl">Đang học</span></div>
          <div class="dash-divider"></div>
          <div class="dash-stat"><span class="num">65h</span><span class="lbl">Đã học</span></div>
          <div class="dash-divider"></div>
          <div class="dash-stat"><span class="num">1</span><span class="lbl">Chứng chỉ</span></div>
          <div class="dash-divider"></div>
          <div class="dash-stat"><span class="num">142</span><span class="lbl">Giờ tổng</span></div>
        </div>
      </div>
    </section>

    <!-- Search -->
    <section class="dash-search">
      <div class="container">
        <div class="search-bar">
          <span>🔍</span>
          <input type="text" placeholder="Tìm kiếm khóa học mới..." class="form-input" style="border:none">
          <div class="search-cat">Tất cả danh mục ▾</div>
          <button class="btn btn-primary btn-sm">🔍 Tìm kiếm</button>
        </div>
      </div>
    </section>

    <div class="container dash-content">
      <!-- Continue Learning -->
      <section class="section">
        <div class="section-header">
          <h2>► Tiếp tục học tập</h2>
          <a routerLink="/my-courses" class="see-all">Xem tất cả →</a>
        </div>
        <div class="continue-grid">
          <div *ngFor="let ec of dataService.enrolledCourses()" class="continue-card card">
            <div class="cc-icon">📦</div>
            <div class="cc-info">
              <h3>{{ ec.course.title }}</h3>
              <p>{{ ec.course.instructor }}</p>
              <span class="progress-text">Tiến độ: {{ ec.progress }}%</span>
              <div class="progress-bar"><div class="fill" [style.width.%]="ec.progress"></div></div>
            </div>
            <a routerLink="/learn/python/lesson/5" class="btn btn-primary btn-sm">► Tiếp tục</a>
          </div>
        </div>
      </section>

      <!-- AI Recommendations -->
      <section class="section">
        <div class="section-header">
          <h2>🤖 AI khuyến nghị tiếp theo</h2>
          <a routerLink="/ai-recommendations" class="see-all">Xem tất cả →</a>
        </div>
        <div class="course-grid">
          <app-course-card *ngFor="let c of dataService.courses().slice(1, 5)" [course]="c" [showCartBtn]="true" />
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dash-hero {
      background: linear-gradient(135deg, var(--primary), #4A51B5);
      color: var(--white);
      padding: 40px 0 32px;
    }
    .dash-badge {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      padding: 6px 16px;
      border-radius: 16px;
      font-size: 13px;
      margin-bottom: 16px;
    }
    .dash-hero h1 {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .dash-hero p {
      opacity: 0.8;
      margin-bottom: 24px;
    }
    .dash-stats {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .dash-stat { display: flex; flex-direction: column; }
    .num { font-size: 24px; font-weight: 800; }
    .lbl { font-size: 13px; opacity: 0.7; }
    .dash-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.2); }

    .dash-search {
      background: var(--white);
      padding: 16px 0;
      box-shadow: var(--shadow-sm);
    }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      padding: 0 16px;
      background: var(--white);
    }
    .search-cat {
      padding: 10px 16px;
      border-left: 1px solid var(--gray-200);
      white-space: nowrap;
      font-size: 13px;
      color: var(--gray-500);
    }

    .dash-content { padding: 24px 0 60px; }
    .section { margin-bottom: 32px; }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .section-header h2 { font-size: 18px; font-weight: 700; }
    .see-all { color: var(--primary); font-weight: 600; font-size: 14px; }

    .continue-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .continue-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }
    .cc-icon {
      width: 60px;
      height: 60px;
      background: var(--primary-bg);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      flex-shrink: 0;
    }
    .cc-info { flex: 1; }
    .cc-info h3 { font-size: 14px; font-weight: 700; }
    .cc-info p { font-size: 12px; color: var(--gray-500); margin-bottom: 4px; }
    .progress-text { font-size: 12px; color: var(--gray-500); }
    .progress-bar { margin-top: 4px; }

    .course-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
  `]
})
export class DashboardComponent {
  constructor(public dataService: DataService) { }
}
