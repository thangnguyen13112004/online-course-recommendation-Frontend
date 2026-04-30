import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, CourseCardComponent],
  template: `
    <app-header />

    <!-- Dashboard Hero -->
    <section class="dash-hero">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
          <div>
            <span class="dash-badge"><i class="fa-solid fa-robot" style="margin-right: 8px;"></i> AI đã cập nhật gợi ý mới cho bạn!</span>
            <h1>Chào mừng trở lại! <i class="fa-solid fa-hand" style="font-size: 24px; color: #FBBF24;"></i></h1>
            <p>Tiếp tục hành trình học tập của bạn</p>
          </div>
          <a routerLink="/purchase-history" class="btn btn-outline btn-sm" style="color: white; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-receipt"></i> Lịch sử mua hàng
          </a>
        </div>
      </div>
    </section>

    <div class="container dash-content">
      <!-- Stats Cards -->
      <div class="my-stats">
        <div class="my-stat-modern card">
          <div class="stat-content">
            <span class="st-val primary">{{ dataService.enrolledCourses().length }}</span>
            <span class="st-lbl">Đang học</span>
          </div>
          <div class="stat-icon-modern bg-blue">
            <i class="fa-solid fa-book-open-reader"></i>
          </div>
        </div>
        <div class="my-stat-modern card">
          <div class="stat-content">
            <span class="st-val success">{{ completedCoursesCount }}</span>
            <span class="st-lbl">Hoàn thành</span>
          </div>
          <div class="stat-icon-modern bg-green">
            <i class="fa-solid fa-circle-check"></i>
          </div>
        </div>
        <div class="my-stat-modern card">
          <div class="stat-content">
            <span class="st-val orange">{{ dataService.enrolledCourses().length * 15 }}h</span>
            <span class="st-lbl">Tổng giờ học</span>
          </div>
          <div class="stat-icon-modern bg-orange">
            <i class="fa-solid fa-stopwatch"></i>
          </div>
        </div>
        <div class="my-stat-modern card">
          <div class="stat-content">
            <span class="st-val purple">{{ dataService.certificates().length }}</span>
            <span class="st-lbl">Chứng chỉ</span>
          </div>
          <div class="stat-icon-modern bg-purple">
            <i class="fa-solid fa-award"></i>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="dataService.enrolledCourses().length === 0" class="empty-state card">
         <div class="empty-icon"><i class="fa-solid fa-graduation-cap"></i></div>
         <h3>Bạn chưa đăng ký khóa học nào</h3>
         <p>Hãy khám phá các khóa học thú vị và bắt đầu hành trình học tập của bạn.</p>
         <a routerLink="/course" class="btn btn-primary">Khám phá khóa học</a>
      </div>

      <!-- Search -->
      <section class="dash-search">
        <div class="search-bar">
          <span><i class="fa-solid fa-magnifying-glass"></i></span>
          <input type="text" placeholder="Tìm kiếm khóa học mới..." class="form-input" style="border:none">
          <div class="search-cat">Tất cả danh mục ▾</div>
          <button class="btn btn-primary btn-sm"><i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm</button>
        </div>
      </section>

      <!-- Current Courses -->
      <section class="section" *ngIf="ongoingCourses.length > 0">
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: center;">
          <h2><i class="fa-solid fa-play-circle"></i> Tiếp tục học tập</h2>
          <button *ngIf="ongoingCourses.length > 2" class="btn btn-outline btn-sm" style="border:none; color: var(--primary); font-weight: 600;" (click)="showAllOngoing = !showAllOngoing">
            {{ showAllOngoing ? 'Ẩn bớt ▴' : 'Xem tất cả (' + ongoingCourses.length + ') ▾' }}
          </button>
        </div>
        <div class="enrolled-grid">
          <div *ngFor="let ec of (showAllOngoing ? ongoingCourses : ongoingCourses.slice(0, 2))" class="enrolled-card card">
            <div class="ec-icon">
              <img *ngIf="ec.course?.image && ec.course!.image!.length > 5" [src]="ec.course?.image" (error)="ec.course!.image = ''" alt="course" style="width: 100%; height: 100%; object-fit: cover;">
              <div *ngIf="!ec.course?.image || ec.course!.image!.length <= 5" style="font-size: 32px; display:flex; justify-content:center; align-items:center; width:100%; height:100%"><i class="fa-solid fa-box"></i></div>
            </div>
            <div class="ec-info">
              <h3>{{ ec.course?.title }}</h3>
              <p>{{ ec.course?.instructor }} • {{ ec.course?.modules }} chương</p>
              <span class="progress-text">Tiến độ: {{ ec.progress }}%</span>
              <div class="progress-bar"><div class="fill" [style.width.%]="ec.progress"></div></div>
            </div>
            <a [routerLink]="['/learn', ec.course?.id || 'course', 'lesson', 1]" class="btn btn-primary btn-sm">► Tiếp tục</a>
          </div>
        </div>
      </section>

      <!-- Completed Courses -->
      <section class="section" *ngIf="completedCourses.length > 0">
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: center;">
          <h2><i class="fa-solid fa-circle-check" style="color: #10B981;"></i> Đã hoàn thành</h2>
          <button *ngIf="completedCourses.length > 2" class="btn btn-outline btn-sm" style="border:none; color: #10B981; font-weight: 600;" (click)="showAllCompleted = !showAllCompleted">
            {{ showAllCompleted ? 'Ẩn bớt ▴' : 'Xem tất cả (' + completedCourses.length + ') ▾' }}
          </button>
        </div>
        <div class="enrolled-grid">
          <div *ngFor="let ec of (showAllCompleted ? completedCourses : completedCourses.slice(0, 2))" class="enrolled-card card">
            <div class="ec-icon">
              <img *ngIf="ec.course?.image && ec.course!.image!.length > 5" [src]="ec.course?.image" (error)="ec.course!.image = ''" alt="course" style="width: 100%; height: 100%; object-fit: cover;">
              <div *ngIf="!ec.course?.image || ec.course!.image!.length <= 5" style="font-size: 32px; display:flex; justify-content:center; align-items:center; width:100%; height:100%"><i class="fa-solid fa-box"></i></div>
            </div>
            <div class="ec-info">
              <h3>{{ ec.course?.title }}</h3>
              <p>{{ ec.course?.instructor }} • {{ ec.course?.modules }} chương</p>
              <span class="progress-text" style="color: #10B981; font-weight: 600;"><i class="fa-solid fa-check"></i> Hoàn thành 100%</span>
              <div class="progress-bar"><div class="fill" style="width: 100%; background: linear-gradient(90deg, #10B981, #059669);"></div></div>
            </div>
            <a [routerLink]="['/course', ec.course?.id]" class="btn btn-outline btn-sm">Xem lại</a>
          </div>
        </div>
      </section>

      <!-- Certificates -->
      <section class="section" *ngIf="dataService.certificates().length > 0">
        <h2><i class="fa-solid fa-trophy"></i> Chứng chỉ của tôi</h2>
        <div class="cert-grid">
          <div *ngFor="let cert of dataService.certificates()" class="cert-card card">
            <div class="cert-icon-modern"><i class="fa-solid fa-certificate"></i></div>
            <div class="cert-info">
              <strong>{{ cert.courseName }}</strong>
              <span>{{ cert.source }} • {{ cert.date }}</span>
            </div>
            <button class="btn btn-primary btn-sm">📥 Tải về</button>
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
          <app-course-card *ngFor="let c of dataService.courses().slice(0, 4)" [course]="c" [showCartBtn]="true" />
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
    }

    .dash-content { padding: 24px 0 60px; }

    /* Stats Cards */
    .my-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }
    .my-stat-modern {
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: none;
      background: var(--white);
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      border-radius: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .my-stat-modern:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    }
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    .st-val { font-size: 32px; font-weight: 800; line-height: 1.2; margin-bottom: 4px; }
    .st-val.primary { color: #3B82F6; }
    .st-val.success { color: #10B981; }
    .st-val.orange { color: #F59E0B; }
    .st-val.purple { color: #8B5CF6; }
    .st-lbl { font-size: 14px; color: var(--gray-500); font-weight: 500; }
    
    .stat-icon-modern {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .bg-blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
    .bg-green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
    .bg-orange { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
    .bg-purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }

    /* Empty State */
    .empty-state {
      padding: 40px;
      text-align: center;
      background: var(--white);
      border-radius: var(--radius-lg);
      margin-bottom: 28px;
    }
    .empty-icon { font-size: 48px; margin-bottom: 16px; color: var(--gray-400); }
    .empty-state h3 { margin-bottom: 8px; }
    .empty-state p { color: var(--gray-500); margin-bottom: 24px; }

    /* Search */
    .dash-search {
      margin-bottom: 28px;
    }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      padding: 0 16px;
      background: var(--white);
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .search-cat {
      padding: 10px 16px;
      border-left: 1px solid var(--gray-200);
      white-space: nowrap;
      font-size: 13px;
      color: var(--gray-500);
    }

    /* Sections */
    .section { margin-bottom: 32px; }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .section-header h2, .section h2 { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
    .section-header h2 { margin-bottom: 0; }
    .see-all { color: var(--primary); font-weight: 600; font-size: 14px; }

    /* Enrolled Courses Grid */
    .enrolled-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .enrolled-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }
    .ec-icon {
      width: 60px; height: 60px;
      background: var(--primary-bg);
      border-radius: var(--radius-sm);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }
    .ec-info { flex: 1; }
    .ec-info h3 { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
    .ec-info p { font-size: 12px; color: var(--gray-500); margin-bottom: 6px; }
    .progress-text { font-size: 12px; color: var(--gray-500); }
    .progress-bar { 
      height: 6px;
      background: var(--gray-200);
      border-radius: 3px;
      margin-top: 6px;
      overflow: hidden;
    }
    .progress-bar .fill {
      height: 100%;
      background: var(--primary);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    /* Certificates */
    .cert-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .cert-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: var(--primary-bg);
      border-color: transparent;
    }
    .cert-icon-modern { 
      width: 48px;
      height: 48px;
      background: rgba(139, 92, 246, 0.1);
      color: var(--primary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }
    .cert-info { flex: 1; }
    .cert-info strong { display: block; font-size: 14px; }
    .cert-info span { font-size: 12px; color: var(--gray-500); }

    /* Course Grid */
    .course-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  public dataService = inject(DataService);
  private authService = inject(AuthService);

  showAllOngoing = false;
  showAllCompleted = false;

  get completedCourses() {
    return this.dataService.enrolledCourses().filter(c => c.progress === 100);
  }

  get completedCoursesCount() {
    return this.completedCourses.length;
  }

  get ongoingCourses() {
    return this.dataService.enrolledCourses().filter(c => (c.progress || 0) < 100);
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.dataService.loadMyCourses();
      this.dataService.loadCertificates();
    }
  }
}
