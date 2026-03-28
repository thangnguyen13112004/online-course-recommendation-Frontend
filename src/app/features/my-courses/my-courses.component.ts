import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, CourseCardComponent],
  template: `
    <app-header [isAuthenticated]="true" />
    <div class="container my-page">
      <h1>📚 Học tập của tôi</h1>

      <!-- Stats -->
      <div class="my-stats">
        <div class="my-stat card">
          <span class="st-val primary">2</span>
          <span class="st-lbl">Đang học</span>
          <span class="st-icon">📘</span>
          <span class="st-trend">▲ +1</span>
        </div>
        <div class="my-stat card">
          <span class="st-val">1</span>
          <span class="st-lbl">Hoàn thành</span>
          <span class="st-icon">✅</span>
        </div>
        <div class="my-stat card">
          <span class="st-val orange">65h</span>
          <span class="st-lbl">Tổng giờ học</span>
          <span class="st-icon">⏱️</span>
          <span class="st-trend">▲ +12h tuần này</span>
        </div>
        <div class="my-stat card">
          <span class="st-val">1</span>
          <span class="st-lbl">Chứng chỉ</span>
          <span class="st-icon">🏆</span>
        </div>
      </div>

      <!-- Current Courses -->
      <section class="section">
        <h2>Khóa học đang học</h2>
        <div class="enrolled-grid">
          <div *ngFor="let ec of dataService.enrolledCourses()" class="enrolled-card card">
            <div class="ec-icon">📦</div>
            <div class="ec-info">
              <h3>{{ ec.course.title }}</h3>
              <p>{{ ec.course.instructor }} • {{ ec.modules }} mô-đun</p>
              <span class="progress-text">Tiến độ: {{ ec.progress }}%</span>
              <div class="progress-bar"><div class="fill" [style.width.%]="ec.progress"></div></div>
            </div>
            <a routerLink="/learn/python/lesson/5" class="btn btn-primary btn-sm">► Tiếp tục</a>
          </div>
        </div>
      </section>

      <!-- Certificates -->
      <section class="section">
        <h2>🏆 Chứng chỉ của tôi</h2>
        <div class="cert-grid">
          <div *ngFor="let cert of dataService.certificates()" class="cert-card card">
            <span class="cert-icon">📜</span>
            <div class="cert-info">
              <strong>{{ cert.courseName }}</strong>
              <span>{{ cert.source }} • {{ cert.date }}</span>
            </div>
            <button class="btn btn-primary btn-sm">📥 Tải về</button>
          </div>
        </div>
      </section>

      <!-- AI Suggestions -->
      <section class="section">
        <h2>🤖 AI gợi ý học tiếp</h2>
        <div class="course-grid">
          <app-course-card *ngFor="let c of dataService.courses().slice(1, 5)" [course]="c" [showCartBtn]="true" />
        </div>
      </section>
    </div>
  `,
  styles: [`
    .my-page { padding: 24px 0 60px; }
    .my-page h1 { font-size: 22px; margin-bottom: 20px; }
    .my-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .my-stat {
      padding: 20px;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .st-val { font-size: 28px; font-weight: 800; color: var(--primary); }
    .st-val.orange { color: var(--orange); }
    .st-val.primary { color: var(--primary); }
    .st-lbl { font-size: 13px; color: var(--gray-500); }
    .st-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 24px;
      opacity: 0.5;
    }
    .st-trend {
      font-size: 12px;
      color: var(--success);
      margin-top: 4px;
    }
    .section { margin-bottom: 32px; }
    .section h2 { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
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
      font-size: 28px; flex-shrink: 0;
    }
    .ec-info { flex: 1; }
    .ec-info h3 { font-size: 14px; font-weight: 700; }
    .ec-info p { font-size: 12px; color: var(--gray-500); margin-bottom: 4px; }
    .progress-text { font-size: 12px; color: var(--gray-500); }
    .progress-bar { margin-top: 4px; }

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
    .cert-icon { font-size: 36px; }
    .cert-info { flex: 1; }
    .cert-info strong { display: block; font-size: 14px; }
    .cert-info span { font-size: 12px; color: var(--gray-500); }

    .course-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
  `]
})
export class MyCoursesComponent {
  constructor(public dataService: DataService) { }
}
