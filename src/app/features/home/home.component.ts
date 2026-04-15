import { Component, inject, ViewChild, ElementRef } from '@angular/core';
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

    <!-- Modern Hero Section -->
    <section class="hero-modern">
      <!-- Animated Background blobs -->
      <div class="hero-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      
      <div class="container hero-container">
        <div class="hero-content">
          <div class="hero-badge">🌟 Mở khóa tiềm năng của bạn</div>
          <h1 class="hero-title">
            Hành trình <span class="gradient-text">Tri thức</span> <br> Bắt đầu từ đây
          </h1>
          <p class="hero-subtitle">
            Hàng ngàn khóa học chất lượng cao với lộ trình tối ưu được cá nhân hóa bằng <strong>Trợ lý AI</strong>. Đột phá sự nghiệp ngay hôm nay!
          </p>
          
          <div class="hero-search-glass">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="searchCourses()" placeholder="Bạn muốn học gì hôm nay? (VD: React, Python...)">
            <button (click)="searchCourses()" class="btn-search-glow">Khám phá</button>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">10k+</span>
              <span class="stat-label">Khóa học</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">500k+</span>
              <span class="stat-label">Học viên</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">4.8/5</span>
              <span class="stat-label">Đánh giá</span>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <!-- Glass Card 1 -->
          <div class="glass-card floating-card-1">
            <div class="ai-icon"><i class="fa-solid fa-robot"></i></div>
            <div class="gc-text">AI Đề xuất <br><b>Chính xác 98%</b></div>
          </div>
          
          <!-- Glass Card 2 -->
          <div class="glass-card floating-card-2">
            <div class="avatar-group">
              <img src="https://i.pravatar.cc/150?img=1" alt="student">
              <img src="https://i.pravatar.cc/150?img=2" alt="student">
              <img src="https://i.pravatar.cc/150?img=3" alt="student">
              <div class="avatar-more">+2k</div>
            </div>
            <div class="gc-text">Học viên mới hôm nay</div>
          </div>

          <div class="hero-main-image">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" alt="Student learning">
          </div>
          <div class="hero-glow-back"></div>
        </div>
      </div>
    </section>

    <!-- Modern Tabs for Courses -->
    <section class="section-modern">
      <div class="container">
        <div class="section-header">
           <h2 class="section-title">Lựa chọn khóa học đa dạng</h2>
           <p class="section-subtitle">Chinh phục các kỹ năng mới với lộ trình được thiết kế chuẩn quốc tế.</p>
        </div>
        
        <div class="modern-tabs">
          <button *ngFor="let cat of getTopCategories()" 
                  class="pill-tab" 
                  [class.active]="selectedTab === cat.ten"
                  (click)="selectTab(cat.ten)">
            {{ cat.ten }}
          </button>
        </div>

        <div class="tab-content-glass">
          <div class="tab-header-flex">
             <div>
               <h3>Nâng cao kỹ năng: <span class="text-primary">{{ selectedTab }}</span></h3>
               <p class="tab-desc">Khám phá hàng loạt các khóa học {{ selectedTab }} chuyên sâu để đáp ứng nhu cầu tuyển dụng.</p>
             </div>
             <a (click)="goToCategory(selectedTab)" class="btn-outline-primary">Xem tất cả <i class="fa-solid fa-arrow-right"></i></a>
          </div>

          <div class="modern-carousel-container">
            <button class="carousel-nav left" (click)="scrollCarousel(tabCarousel, -600)"><i class="fa-solid fa-chevron-left"></i></button>
            <div class="modern-carousel" #tabCarousel>
              <div class="carousel-track">
                <div class="course-wrapper" *ngFor="let course of tabCourses">
                  <app-course-card [course]="course" />
                </div>
                <div class="empty-state" *ngIf="!loadingTab && tabCourses.length === 0">
                  <div class="empty-icon">📁</div>
                  <p>Chưa có khóa học nào trong danh mục này.</p>
                </div>
                <div class="loading-state" *ngIf="loadingTab">
                  <div class="spinner"></div>
                  <p>Đang tải khóa học...</p>
                </div>
              </div>
            </div>
            <button class="carousel-nav right" (click)="scrollCarousel(tabCarousel, 600)"><i class="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Courses -->
    <section class="section-modern bg-dot-pattern">
      <div class="container">
        <div class="section-header">
           <h2 class="section-title">Học viên đang quan tâm</h2>
           <p class="section-subtitle">Những khóa học thịnh hành nhất và được đánh giá cao nhất.</p>
        </div>
        <div class="modern-carousel-container">
          <button class="carousel-nav left" (click)="scrollCarousel(popularCarousel, -600)"><i class="fa-solid fa-chevron-left"></i></button>
          <div class="modern-carousel" #popularCarousel>
            <div class="carousel-track">
              <div class="course-wrapper" *ngFor="let course of dataService.courses().slice(0, 10)">
                <app-course-card [course]="course" />
              </div>
            </div>
          </div>
          <button class="carousel-nav right" (click)="scrollCarousel(popularCarousel, 600)"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>
    </section>

    <!-- Top Categories -->
    <section class="section-modern section-bottom">
      <div class="container">
        <div class="section-header center">
           <h2 class="section-title">Danh mục nổi bật</h2>
           <p class="section-subtitle">Lựa chọn lĩnh vực bạn yêu thích và bắt đầu hành trình.</p>
        </div>
        <div class="categories-grid-modern">
          <div class="cat-card-modern" *ngFor="let cat of getHighlightCategories()" (click)="goToCategory(cat.ten)">
            <div class="cat-image-wrap">
              <img [src]="cat.image" alt="cat">
              <div class="cat-overlay"></div>
            </div>
            <div class="cat-info">
              <h3 class="cat-title">{{ cat.ten }}</h3>
              <span class="cat-explore">Khám phá <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Core Utilities */
    :root {
      --primary-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      --accent-gradient: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
      --glass-bg: rgba(255, 255, 255, 0.7);
      --glass-border: rgba(255, 255, 255, 0.4);
      --glass-shadow: 0 8px 32px rgba(31, 38, 135, 0.07);
    }
    
    .text-primary { color: #4f46e5; }
    
    /* ===== Modern Hero Section ===== */
    .hero-modern {
      position: relative;
      background-color: #f8fafc;
      min-height: 85vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      font-family: 'Inter', 'Outfit', sans-serif;
    }
    
    .hero-bg-shapes {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      overflow: hidden;
      z-index: 0;
    }
    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      opacity: 0.6;
      animation: float 10s ease-in-out infinite alternate;
    }
    .shape-1 { width: 400px; height: 400px; background: rgba(79, 70, 229, 0.2); top: -100px; right: -50px; }
    .shape-2 { width: 300px; height: 300px; background: rgba(236, 72, 153, 0.15); bottom: -50px; left: -50px; animation-delay: -3s; }
    .shape-3 { width: 250px; height: 250px; background: rgba(16, 185, 129, 0.15); top: 30%; left: 40%; animation-delay: -6s; }
    
    @keyframes float {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(-30px) scale(1.05); }
    }

    .hero-container {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 40px;
      padding: 60px 20px;
    }

    .hero-content {
      flex: 1;
      max-width: 600px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      background: rgba(79, 70, 229, 0.1);
      color: #4f46e5;
      border-radius: 100px;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 24px;
      box-shadow: inset 0 0 0 1px rgba(79, 70, 229, 0.2);
    }

    .hero-title {
      font-size: 54px;
      font-weight: 800;
      line-height: 1.15;
      color: #0f172a;
      margin-bottom: 24px;
      letter-spacing: -1px;
    }

    .gradient-text {
      background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 18px;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 40px;
    }

    /* Glass Search Bar */
    .hero-search-glass {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.6);
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
      border-radius: 100px;
      padding: 8px 8px 8px 24px;
      margin-bottom: 48px;
    }
    
    .search-icon {
      color: #64748b;
      font-size: 18px;
    }

    .hero-search-glass input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 12px 16px;
      font-size: 16px;
      outline: none;
      color: #334155;
    }

    .btn-search-glow {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      border: none;
      padding: 14px 28px;
      border-radius: 100px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
    }

    .btn-search-glow:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 25px rgba(79, 70, 229, 0.4);
    }

    /* Hero Stats */
    .hero-stats {
      display: flex;
      align-items: center;
      gap: 32px;
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
    }
    
    .stat-number {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
    }
    
    .stat-label {
      font-size: 14px;
      color: #64748b;
    }
    
    .stat-divider {
      width: 2px;
      height: 30px;
      background: #e2e8f0;
    }

    /* Hero Visual area */
    .hero-visual {
      position: relative;
      flex: 1;
      max-width: 500px;
      display: flex;
      justify-content: center;
    }

    .hero-glow-back {
      position: absolute;
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%);
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.2;
      z-index: 0;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }

    .hero-main-image {
      position: relative;
      z-index: 1;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 8px solid white;
    }
    
    .hero-main-image img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.5s;
    }
    .hero-main-image:hover img {
      transform: scale(1.05);
    }

    /* Glass Cards Animations */
    .glass-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      padding: 16px 20px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 3;
      animation: bounce 4s infinite ease-in-out alternate;
    }
    
    @keyframes bounce {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-15px); }
    }

    .floating-card-1 {
      top: 40px;
      left: -40px;
      animation-delay: 0s;
    }
    
    .floating-card-2 {
      bottom: 40px;
      right: -30px;
      animation-delay: -2s;
    }

    .ai-icon {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
    }

    .gc-text {
      font-size: 13px;
      color: #334155;
      line-height: 1.4;
    }
    .gc-text b { color: #0f172a; }

    .avatar-group { display: flex; align-items: center; margin-right: 5px; }
    .avatar-group img { width: 36px; height: 36px; border-radius: 50%; border: 2px solid white; margin-left: -12px; }
    .avatar-group img:first-child { margin-left: 0; }
    .avatar-more { width: 36px; height: 36px; border-radius: 50%; border: 2px solid white; margin-left: -12px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #475569; z-index: 1;}

    /* ===== Modern Sections ===== */
    .section-modern {
      padding: 80px 0;
      background: #ffffff;
    }
    .bg-dot-pattern {
      background-color: #f8fafc;
      background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
      background-size: 32px 32px;
    }
    .section-bottom { padding-bottom: 120px; }
    
    .section-header { margin-bottom: 48px; }
    .section-header.center { text-align: center; }
    
    .section-title {
      font-size: 32px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .section-subtitle {
      font-size: 18px;
      color: #64748b;
    }

    /* Tabs Pill Style */
    .modern-tabs {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      scrollbar-width: none;
      padding-bottom: 16px;
      margin-bottom: 8px;
    }
    .modern-tabs::-webkit-scrollbar { display: none; }
    
    .pill-tab {
      padding: 12px 24px;
      background: #f1f5f9;
      color: #475569;
      border: none;
      border-radius: 100px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.3s ease;
    }
    
    .pill-tab:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    
    .pill-tab.active {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
    }

    /* Glass Content Below Tabs */
    .tab-content-glass {
      background: rgba(255,255,255,0.6);
      border: 1px solid #f1f5f9;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 10px 40px -10px rgba(0,0,0,0.03);
    }

    .tab-header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    .tab-header-flex h3 { font-size: 24px; font-weight: 800; margin-bottom: 8px;}
    .tab-header-flex .tab-desc { color: #64748b; font-size: 16px; }

    .btn-outline-primary {
      padding: 10px 20px;
      border: 2px solid #4f46e5;
      color: #4f46e5;
      border-radius: 100px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-outline-primary:hover {
      background: #4f46e5;
      color: white;
      box-shadow: 0 4px 15px rgba(79,70,229,0.2);
    }

    /* Carousel */
    .modern-carousel-container { position: relative; }
    .modern-carousel {
      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      padding-bottom: 24px;
      margin: 0 -12px;
    }
    .modern-carousel::-webkit-scrollbar { display: none; }
    
    .carousel-track { display: flex; }
    .course-wrapper {
      flex: 0 0 calc(25% - 24px);
      min-width: 260px;
      margin: 0 12px;
    }

    .carousel-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: white;
      color: #0f172a;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      box-shadow: 0 10px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
    }
    .carousel-nav:hover {
      background: #0f172a;
      color: white;
      border-color: #0f172a;
    }
    .carousel-nav.left { left: -25px; }
    .carousel-nav.right { right: -25px; }

    .empty-state, .loading-state {
      width: 100%;
      padding: 60px 20px;
      text-align: center;
      color: #64748b;
    }
    .empty-icon { font-size: 48px; margin-bottom: 16px; }
    .spinner {
      width: 40px; height: 40px;
      border: 4px solid #e2e8f0;
      border-top-color: #4f46e5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* Categories Grid */
    .categories-grid-modern {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
    }
    
    .cat-card-modern {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.04);
      cursor: pointer;
      position: relative;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid #f1f5f9;
    }
    
    .cat-card-modern:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    .cat-image-wrap {
      position: relative;
      width: 100%;
      height: 180px;
      overflow: hidden;
    }
    
    .cat-image-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }
    
    .cat-card-modern:hover .cat-image-wrap img {
      transform: scale(1.1);
    }
    
    .cat-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
    }
    
    .cat-info {
      position: absolute;
      bottom: 0; left: 0; width: 100%;
      padding: 24px;
      color: white;
      z-index: 2;
    }
    
    .cat-title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .cat-explore {
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0.8;
      transition: opacity 0.3s, gap 0.3s;
    }
    
    .cat-card-modern:hover .cat-explore {
      opacity: 1;
      gap: 12px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-container { flex-direction: column; text-align: center; }
      .hero-title { font-size: 40px; }
      .hero-visual { margin-top: 40px; }
      .floating-card-1 { left: 0; }
      .floating-card-2 { right: 0; }
      .course-wrapper { flex: 0 0 calc(33.333% - 24px); }
      .categories-grid-modern { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .hero-stats { justify-content: center; }
      .tab-header-flex { flex-direction: column; align-items: flex-start; gap: 16px; }
      .course-wrapper { flex: 0 0 calc(50% - 24px); min-width: 220px;}
    }
    @media (max-width: 480px) {
      .hero-title { font-size: 32px; }
      .course-wrapper { flex: 0 0 calc(85% - 24px); }
      .categories-grid-modern { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent {
  selectedTab = '';
  tabCourses: any[] = [];
  loadingTab = false;
  searchQuery = '';

  private router = inject(Router);

  constructor(public dataService: DataService) {
    // When categories load, select the first one as default tab
    setTimeout(() => {
      const topCats = this.getTopCategories();
      if (topCats.length > 0) {
        this.selectTab(topCats[0].ten);
      }
    }, 500);
  }

  getTopCategories() {
    return this.dataService.categoriesRaw().slice(0, 6);
  }

  getHighlightCategories() {
    const cats = this.dataService.categoriesRaw().slice(0, 8);
    // Assign generic placeholder images for categories
    const images = [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=200&auto=format&fit=crop', // IT
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=200&auto=format&fit=crop', // Business
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=200&auto=format&fit=crop', // Design
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=200&auto=format&fit=crop', // Marketing
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=200&auto=format&fit=crop',
    ];
    return cats.map((c, i) => ({ ...c, image: images[i % images.length] }));
  }

  selectTab(catName: string) {
    this.selectedTab = catName;
    this.loadingTab = true;
    
    let categoryId: number | undefined = undefined;
    const rawCat = this.dataService.categoriesRaw().find(c => {
       const name = c.ten || (c as any).Ten || (c as any).name || (c as any).TenTheLoai;
       return name === catName;
    });
    categoryId = rawCat?.maTheLoai || (rawCat as any)?.MaTheLoai;

    // Simulate API call for the specific tab
    setTimeout(() => {
      // For demo, just filter existing loaded courses or scramble them
      const all = this.dataService.courses();
      this.tabCourses = all.filter(c => c.category === catName);
      if (this.tabCourses.length === 0) {
        // Fallback if local courses don't match, just show a few mixed
        this.tabCourses = [...all].sort(() => 0.5 - Math.random()).slice(0, 6);
      }
      this.loadingTab = false;
    }, 400);
  }

  scrollCarousel(element: HTMLElement, amount: number) {
    if (element) {
      element.scrollBy({ left: amount, behavior: 'smooth' });
    }
  }

  searchCourses() {
    this.router.navigate(['/course'], { 
      queryParams: { 
        q: this.searchQuery.trim() || null 
      } 
    });
  }

  goToCategory(catName: string) {
    let categoryId: number | undefined = undefined;
    const rawCat = this.dataService.categoriesRaw().find(c => {
       const name = c.ten || (c as any).Ten || (c as any).name || (c as any).TenTheLoai;
       return name === catName;
    });
    categoryId = rawCat?.maTheLoai || (rawCat as any)?.MaTheLoai;
    
    this.router.navigate(['/course'], { 
      queryParams: { cat: categoryId || null } 
    });
  }
}
