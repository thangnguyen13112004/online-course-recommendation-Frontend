import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent, CourseCardComponent],
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
          <a routerLink="/course" class="btn btn-outline hero-btn-outline"><i class="fa-solid fa-book"></i> Khám phá khóa học</a>
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
        <div class="search-bar-modern">
          <div class="search-input-group">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" 
                   [(ngModel)]="searchQuery" 
                   (keyup.enter)="searchCourses()"
                   placeholder="Tìm kiếm khóa học, kỹ năng, giảng viên..." 
                   class="search-input">
          </div>
          
          <div class="search-divider"></div>
          
          <div class="search-select-group">
            <select class="search-select" [(ngModel)]="selectedCategory" (ngModelChange)="selectCategory($event)">
              <option *ngFor="let cat of dataService.categories()" [value]="cat">{{ cat }}</option>
            </select>
            <i class="fa-solid fa-chevron-down select-chevron"></i>
          </div>
          
          <button class="btn btn-primary search-btn-modern" (click)="searchCourses()">
            <i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm
          </button>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories-section">
      <div class="container">
        <div class="category-tags">
          <button *ngFor="let cat of dataService.categories()"
                  class="cat-tag" 
                  [class.active]="cat === selectedCategory"
                  (click)="selectCategory(cat)">
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
      margin-top: -36px;
      position: relative;
      z-index: 10;
      background: transparent;
      box-shadow: none;
      padding: 0;
    }
    .search-bar-modern {
      display: flex;
      align-items: center;
      background: var(--white);
      border-radius: 100px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
      padding: 8px 8px 8px 24px;
      border: 1px solid rgba(0,0,0,0.05);
      transition: all 0.3s ease;
    }
    .search-bar-modern:focus-within {
      box-shadow: 0 15px 45px rgba(91, 99, 211, 0.15);
      border-color: rgba(91, 99, 211, 0.3);
    }
    .search-input-group {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .search-icon {
      color: var(--gray-400);
      font-size: 18px;
    }
    .search-input {
      width: 100%;
      border: none;
      padding: 12px 0;
      font-size: 15px;
      background: transparent;
      color: var(--gray-800);
      outline: none;
    }
    .search-input::placeholder {
      color: var(--gray-400);
    }
    .search-divider {
      width: 1px;
      height: 28px;
      background: var(--gray-200);
      margin: 0 12px;
    }
    .search-select-group {
      position: relative;
      display: flex;
      align-items: center;
      margin-right: 12px;
    }
    .search-select {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: none;
      padding: 12px 32px 12px 12px;
      font-size: 14px;
      color: var(--gray-600);
      font-weight: 500;
      cursor: pointer;
      outline: none;
      min-width: 160px;
    }
    .search-select:hover {
      color: var(--primary);
    }
    .select-chevron {
      position: absolute;
      right: 8px;
      pointer-events: none;
      font-size: 12px;
      color: var(--gray-400);
      transition: transform 0.2s;
    }
    .search-select:hover + .select-chevron {
      color: var(--primary);
    }
    .search-btn-modern {
      border-radius: 50px;
      padding: 14px 32px;
      font-weight: 600;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(91, 99, 211, 0.3);
      transition: all 0.3s ease;
    }
    .search-btn-modern:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(91, 99, 211, 0.4);
    }

    .categories-section {
      padding: 40px 0 20px;
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
  selectedCategory = 'Tất cả';
  searchQuery = '';

  private router = inject(Router);

  constructor(public dataService: DataService) {}

  searchCourses() {
    let categoryId: number | undefined = undefined;
    if (this.selectedCategory !== 'Tất cả') {
      const rawCat = this.dataService.categoriesRaw().find(c => c.ten === this.selectedCategory);
      categoryId = rawCat?.maTheLoai;
    }
    
    // Navigate to courses list page with search params
    this.router.navigate(['/course'], { 
      queryParams: { 
        q: this.searchQuery.trim() || null, 
        cat: categoryId || null 
      } 
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    // In-place refresh for homepage category tags
    this.fetchCourses();
  }

  private fetchCourses() {
    let categoryId: number | undefined = undefined;

    if (this.selectedCategory !== 'Tất cả') {
      const rawCat = this.dataService.categoriesRaw().find(c => c.ten === this.selectedCategory);
      categoryId = rawCat?.maTheLoai;
    }

    this.dataService.loadCourses({ 
      categoryId: categoryId,
      search: this.searchQuery.trim() || undefined
    });
  }
}
