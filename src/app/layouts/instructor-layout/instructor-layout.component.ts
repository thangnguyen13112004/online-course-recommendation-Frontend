import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-instructor-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="instructor-layout">
      <!-- Top Bar -->
      <header class="inst-topbar">
        <a routerLink="/" class="back-link">← EduLearn</a>
        <span class="inst-title">📊 Instructor Dashboard</span>
        <div class="inst-user">
          <div class="avatar" style="background:var(--primary)">GV</div>
          <div class="user-info">
            <span class="user-name">Giảng viên</span>
            <span class="user-sub">Nguyễn Tuấn</span>
          </div>
        </div>
      </header>

      <div class="inst-body">
        <!-- Sidebar -->
        <aside class="inst-sidebar">
          <div class="profile-section">
            <div class="avatar-lg">NT</div>
            <h3>Nguyễn Tuấn</h3>
            <p>⭐ 4.8 • 450 học viên</p>
            <p>📚 2 khóa học</p>
          </div>
          <nav class="inst-nav">
            <a routerLink="/instructor/dashboard" routerLinkActive="active">📊 Tổng quan</a>
            <a>📚 Khóa học</a>
            <a routerLink="/instructor/students" routerLinkActive="active">👥 Học viên</a>
            <a>💰 Doanh thu</a>
            <a routerLink="/instructor/courses/create" routerLinkActive="active">✏️ Tạo khóa học</a>
            <a>⚙️ Cài đặt</a>
          </nav>
        </aside>

        <!-- Content -->
        <main class="inst-content">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .instructor-layout { min-height: 100vh; background: var(--gray-50); }
    .inst-topbar {
      display: flex;
      align-items: center;
      padding: 0 24px;
      height: 52px;
      background: var(--white);
      border-bottom: 1px solid var(--gray-200);
    }
    .back-link {
      font-size: 14px;
      color: var(--primary);
      font-weight: 500;
    }
    .inst-title {
      margin-left: 24px;
      font-weight: 700;
      font-size: 15px;
    }
    .inst-user {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: 13px; font-weight: 600; }
    .user-sub { font-size: 11px; color: var(--gray-500); }
    .inst-body { display: flex; }
    .inst-sidebar {
      width: 210px;
      background: var(--white);
      min-height: calc(100vh - 52px);
      border-right: 1px solid var(--gray-200);
      flex-shrink: 0;
    }
    .profile-section {
      padding: 24px 16px;
      text-align: center;
      border-bottom: 1px solid var(--gray-200);
    }
    .avatar-lg {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--primary);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 20px;
      margin: 0 auto 10px;
    }
    .profile-section h3 { font-size: 14px; }
    .profile-section p { font-size: 12px; color: var(--gray-500); }
    .inst-nav {
      padding: 16px 0;
      display: flex;
      flex-direction: column;
    }
    .inst-nav a {
      padding: 10px 20px;
      font-size: 14px;
      color: var(--gray-500);
      transition: var(--transition);
      cursor: pointer;
      border-left: 3px solid transparent;
    }
    .inst-nav a:hover, .inst-nav a.active {
      color: var(--primary);
      background: var(--primary-bg);
      border-left-color: var(--primary);
    }
    .inst-content {
      flex: 1;
      padding: 24px;
    }
    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      color: var(--white);
    }
  `]
})
export class InstructorLayoutComponent {}
