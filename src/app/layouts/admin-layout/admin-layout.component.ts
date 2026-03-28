import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <header class="admin-topbar">
        <a routerLink="/" class="back-link">← EduLearn</a>
        <span class="admin-title">📊 Admin Panel</span>
        <div class="admin-user">
          <div class="avatar">AD</div>
          <span>Admin</span>
        </div>
      </header>
      <div class="admin-body">
        <aside class="admin-sidebar">
          <nav class="admin-nav">
            <a routerLink="/admin/dashboard" routerLinkActive="active">📊 Tổng quan</a>
            <a routerLink="/admin/users" routerLinkActive="active">👥 Người dùng</a>
            <a>📂 Danh mục KH</a>
            <a routerLink="/admin/courses/approvals" routerLinkActive="active">✅ Duyệt KH</a>
            <a routerLink="/admin/promotions" routerLinkActive="active">🎁 Khuyến mãi</a>
            <a>📊 Báo cáo</a>
          </nav>
        </aside>
        <main class="admin-content">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout { min-height: 100vh; background: var(--gray-50); }
    .admin-topbar {
      display: flex; align-items: center;
      padding: 0 24px; height: 52px;
      background: var(--gray-800); color: var(--white);
    }
    .back-link { font-size: 14px; color: var(--primary-light); }
    .admin-title { margin-left: 24px; font-weight: 700; font-size: 15px; }
    .admin-user {
      margin-left: auto; display: flex; align-items: center; gap: 10px;
    }
    .avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: var(--primary); color: var(--white);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px;
    }
    .admin-body { display: flex; }
    .admin-sidebar {
      width: 200px; background: var(--gray-800);
      min-height: calc(100vh - 52px); flex-shrink: 0;
    }
    .admin-nav { padding: 16px 0; display: flex; flex-direction: column; }
    .admin-nav a {
      padding: 10px 20px; font-size: 14px;
      color: var(--gray-400); cursor: pointer;
      border-left: 3px solid transparent;
      transition: var(--transition);
    }
    .admin-nav a:hover, .admin-nav a.active {
      color: var(--white); background: rgba(255,255,255,0.05);
      border-left-color: var(--primary);
    }
    .admin-content { flex: 1; padding: 24px; }
  `]
})
export class AdminLayoutComponent {}
