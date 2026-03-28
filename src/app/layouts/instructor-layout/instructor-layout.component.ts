import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-instructor-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="instructor-layout">
      <!-- Sidebar -->
      <aside class="instructor-sidebar">
        <div class="sidebar-brand">
          <a routerLink="/" class="brand-link">
            <span class="brand-icon">E</span>
            <span class="brand-text">EduLearn</span>
          </a>
          <span class="brand-badge">Giảng viên</span>
        </div>

        <div class="sidebar-section-label">ĐIỀU KHIỂN</div>
        <nav class="instructor-nav">
          <a routerLink="/instructor/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon"><i class="fa-solid fa-chart-pie"></i></span>
            <span class="nav-text">Tổng quan</span>
          </a>
          <a routerLink="/instructor/courses" routerLinkActive="active" class="nav-item">
            <span class="nav-icon"><i class="fa-solid fa-book"></i></span>
            <span class="nav-text">Khóa học của tôi</span>
          </a>
          <a routerLink="/instructor/courses/create" routerLinkActive="active" class="nav-item">
            <span class="nav-icon"><i class="fa-solid fa-plus-circle"></i></span>
            <span class="nav-text">Tạo khóa học mới</span>
          </a>
          <a routerLink="/instructor/students" routerLinkActive="active" class="nav-item">
            <span class="nav-icon"><i class="fa-solid fa-users"></i></span>
            <span class="nav-text">Học viên</span>
          </a>
          <a routerLink="/instructor/revenue" routerLinkActive="active" class="nav-item">
            <span class="nav-icon"><i class="fa-solid fa-coins"></i></span>
            <span class="nav-text">Doanh thu</span>
          </a>
          <a routerLink="/instructor/reports" routerLinkActive="active" class="nav-item">
            <span class="nav-icon"><i class="fa-solid fa-chart-column"></i></span>
            <span class="nav-text">Báo cáo</span>
          </a>
        </nav>

        <div class="sidebar-section-label">TÙY CHỌN</div>
        <nav class="instructor-nav">
          <a routerLink="/instructor/settings" routerLinkActive="active" class="nav-item">
            <span class="nav-icon"><i class="fa-solid fa-gear"></i></span>
            <span class="nav-text">Cài đặt</span>
          </a>
        </nav>

        <div class="sidebar-bottom">
          <div class="sidebar-user-card">
            <div class="sidebar-user-avatar" 
                 [style.background-image]="authService.currentUser()?.avatar ? 'url(' + authService.currentUser()?.avatar + ')' : ''" 
                 [class.no-avt]="!authService.currentUser()?.avatar">
              {{ !authService.currentUser()?.avatar ? (authService.currentUser()?.userName?.charAt(0)?.toUpperCase() || 'GV') : '' }}
            </div>
            <div class="sidebar-user-info">
              <span class="sidebar-user-name">{{ authService.currentUser()?.userName || 'Giảng viên' }}</span>
              <span class="sidebar-user-role">Giảng viên</span>
            </div>
            <button class="sidebar-logout" title="Đăng xuất" (click)="logout()">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Area -->
      <div class="instructor-main">
        <!-- Top Bar -->
        <header class="instructor-topbar">
          <div class="topbar-left">
            <div class="topbar-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Tìm kiếm nội dung...">
            </div>
          </div>
          <div class="topbar-right">
          </div>
        </header>

        <!-- Content -->
        <main class="instructor-content">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* ===== Layout ===== */
    .instructor-layout {
      display: flex;
      min-height: 100vh;
      background: #F0F2F5; /* Matches Admin Layout background */
    }

    /* ===== Sidebar ===== */
    .instructor-sidebar {
      width: 260px;
      background: linear-gradient(180deg, #1A1D3A 0%, #12142B 100%);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 50;
      overflow-y: auto;
    }

    .sidebar-brand {
      padding: 20px 20px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--white);
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #FF7B54 0%, #FFB26B 100%); /* Orange gradient for Instructor */
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      font-size: 18px;
      font-weight: 900;
      color: white;
      box-shadow: 0 4px 12px rgba(255, 123, 84, 0.4);
    }

    .brand-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      color: rgba(255, 178, 107, 0.9);
      background: rgba(255, 123, 84, 0.12);
      padding: 3px 10px;
      border-radius: 20px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .sidebar-section-label {
      font-size: 10px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.25);
      letter-spacing: 1.5px;
      padding: 20px 24px 8px;
      text-transform: uppercase;
    }

    /* ===== Nav Items ===== */
    .instructor-nav {
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.55);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
    }

    .nav-item:hover {
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.06);
    }

    .nav-item.active {
      color: #FFFFFF;
      background: linear-gradient(135deg, rgba(255, 123, 84, 0.35) 0%, rgba(255, 178, 107, 0.15) 100%);
      box-shadow: 0 2px 12px rgba(255, 123, 84, 0.15);
    }

    .nav-item.active .nav-icon {
      color: #FFB26B;
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: linear-gradient(180deg, #FFB26B, #FF7B54);
      border-radius: 0 4px 4px 0;
    }

    .nav-icon {
      width: 20px;
      text-align: center;
      font-size: 15px;
      transition: color 0.25s ease;
    }

    .nav-text {
      flex: 1;
    }

    /* ===== Sidebar Bottom User Card ===== */
    .sidebar-bottom {
      margin-top: auto;
      padding: 16px 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .sidebar-user-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .sidebar-user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background-size: cover;
      background-position: center;
      flex-shrink: 0;
    }
    .sidebar-user-avatar.no-avt {
      background: linear-gradient(135deg, #FF7B54 0%, #FFB26B 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 14px;
    }

    .sidebar-user-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .sidebar-user-name {
      color: var(--white);
      font-weight: 600;
      font-size: 13px;
    }

    .sidebar-user-role {
      color: rgba(255, 255, 255, 0.35);
      font-size: 11px;
    }

    .sidebar-logout {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 13px;
      border: none;
    }

    .sidebar-logout:hover {
      background: rgba(220, 53, 69, 0.2);
      color: #FF6B7A;
    }

    /* ===== Main Area ===== */
    .instructor-main {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
    }

    /* ===== Top Bar ===== */
    .instructor-topbar {
      height: 64px;
      background: var(--white);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      position: sticky;
      top: 0;
      z-index: 40;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .topbar-left {
      display: flex;
      align-items: center;
    }

    .topbar-search {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: 10px;
      padding: 9px 16px;
      width: 300px;
      transition: all 0.25s ease;
    }

    .topbar-search:focus-within {
      border-color: #FF7B54;
      background: var(--white);
      box-shadow: 0 0 0 3px rgba(255, 123, 84, 0.1);
    }

    .topbar-search i {
      color: var(--gray-400);
      font-size: 14px;
    }

    .topbar-search input {
      border: none;
      background: transparent;
      font-size: 14px;
      color: var(--gray-700);
      width: 100%;
      outline: none;
    }

    .topbar-search input::placeholder {
      color: var(--gray-400);
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .topbar-icon-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: transparent;
      border: none;
      color: var(--gray-500);
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .topbar-icon-btn:hover {
      background: var(--gray-100);
      color: #FF7B54;
    }

    .notif-dot {
      position: absolute;
      top: 9px;
      right: 10px;
      width: 8px;
      height: 8px;
      background: var(--danger);
      border-radius: 50%;
      border: 2px solid var(--white);
    }

    .topbar-divider {
      width: 1px;
      height: 28px;
      background: var(--gray-200);
      margin: 0 10px;
    }

    .topbar-user {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px 6px 6px;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .topbar-user:hover {
      background: var(--gray-100);
    }

    .topbar-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background-size: cover;
      background-position: center;
    }
    .topbar-avatar.no-avt {
      background: linear-gradient(135deg, #FF7B54 0%, #FFB26B 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 14px;
    }

    .topbar-username {
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-700);
    }

    /* ===== Content ===== */
    .instructor-content {
      flex: 1;
      padding: 28px;
    }
  `]
})
export class InstructorLayoutComponent {
  public authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
