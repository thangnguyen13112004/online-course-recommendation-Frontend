import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, CourseCardComponent],
  template: `
    <app-header />

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <span class="hero-badge">🤖 AI Khuyến nghị thông minh</span>
        <h1 class="hero-title">
          Học tập không giới hạn,<br>
          <span class="highlight">được cá nhân hóa</span><br>
          cho bạn
        </h1>
        <p class="hero-desc">
          Nền tảng học trực tuyến tích hợp AI — gợi ý khóa học phù hợp
          nhất dựa trên hành vi học tập và sở thích của bạn.
        </p>
        <div class="hero-actions">
          <a routerLink="/course" class="btn btn-outline hero-btn-outline">📚 Khám phá khóa học</a>
          <a routerLink="/ai-recommendations" class="btn btn-primary hero-btn-ai">🤖 Nhận gợi ý AI →</a>
        </div>
        <div class="stats-row">
          <div class="stat-item"><span class="stat-num">10.000+</span><span class="stat-label">Khóa học</span></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><span class="stat-num">500K+</span><span class="stat-label">Học viên</span></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><span class="stat-num">95%</span><span class="stat-label">Hài lòng</span></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><span class="stat-num">AI</span><span class="stat-label">Khuyến nghị</span></div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="search-section">
      <div class="container">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Tìm kiếm khóa học, kỹ năng, giảng viên..." class="search-input">
          <div class="search-cat">
            <span>Tất cả danh mục</span>
            <span>▾</span>
          </div>
          <button class="btn btn-primary search-btn">🔍 Tìm kiếm</button>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories-section">
      <div class="container">
        <div class="category-tags">
          <button *ngFor="let cat of dataService.categories(); let i = index"
                  class="cat-tag" [class.active]="i === 0">
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <!-- AI Recommendations -->
    <section class="recommendations">
      <div class="container">
        <div class="section-header">
          <h2>🤖 AI Khuyến nghị cho bạn</h2>
          <a routerLink="/ai-recommendations" class="see-all">Xem tất cả →</a>
        </div>
        <div class="course-grid">
          <app-course-card *ngFor="let course of dataService.courses().slice(0, 4)" [course]="course" />
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, var(--primary) 0%, #4A51B5 50%, #3D4399 100%);
      color: var(--white);
      padding: 60px 0 40px;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      padding: 6px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 24px;
    }
    .hero-title {
      font-size: 42px;
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 16px;
    }
    .highlight {
      color: #A5AAFF;
    }
    .hero-desc {
      font-size: 16px;
      opacity: 0.85;
      margin-bottom: 28px;
      max-width: 500px;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      gap: 16px;
      margin-bottom: 40px;
    }
    .hero-btn-outline {
      border-color: var(--white) !important;
      color: var(--white) !important;
      background: transparent !important;
      padding: 12px 28px;
    }
    .hero-btn-outline:hover {
      background: var(--white) !important;
      color: var(--primary) !important;
    }
    .hero-btn-ai {
      padding: 12px 28px;
      background: rgba(255,255,255,0.2) !important;
      border: 2px solid rgba(255,255,255,0.3);
    }
    .hero-btn-ai:hover {
      background: rgba(255,255,255,0.3) !important;
    }
    .stats-row {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
    }
    .stat-num {
      font-size: 24px;
      font-weight: 800;
      color: #A5AAFF;
    }
    .stat-label {
      font-size: 13px;
      opacity: 0.7;
    }
    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255,255,255,0.2);
    }

    .search-section {
      margin-top: -2px;
      padding: 24px 0 16px;
      background: var(--white);
      box-shadow: var(--shadow-sm);
    }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 0;
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--white);
    }
    .search-icon {
      padding: 0 16px;
      font-size: 18px;
    }
    .search-input {
      flex: 1;
      border: none;
      padding: 14px 0;
      font-size: 14px;
      background: transparent;
    }
    .search-input:focus {
      outline: none;
    }
    .search-cat {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-left: 1px solid var(--gray-200);
      color: var(--gray-500);
      font-size: 14px;
      white-space: nowrap;
      cursor: pointer;
    }
    .search-btn {
      border-radius: 0;
      padding: 14px 24px;
    }

    .categories-section {
      padding: 20px 0;
    }
    .category-tags {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .cat-tag {
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid var(--gray-300);
      background: var(--white);
      color: var(--gray-600);
      transition: var(--transition);
      cursor: pointer;
    }
    .cat-tag:hover, .cat-tag.active {
      background: var(--primary);
      color: var(--white);
      border-color: var(--primary);
    }

    .recommendations {
      padding: 20px 0 60px;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .section-header h2 {
      font-size: 20px;
      font-weight: 700;
    }
    .see-all {
      color: var(--primary);
      font-weight: 600;
      font-size: 14px;
    }
    .course-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  `]
})
export class HomeComponent {
  constructor(public dataService: DataService) {}
}
