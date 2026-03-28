import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header" [class.authenticated]="isAuthenticated">
      <div class="header-inner">
        <a routerLink="/" class="logo">
          <span class="logo-icon">E</span>
          <span class="logo-text">EduLearn</span>
        </a>
        <nav class="nav">
          <a routerLink="/home" routerLinkActive="active">Trang chủ</a>
          <a routerLink="/course" routerLinkActive="active">Khóa học</a>
          <a routerLink="/ai-recommendations" routerLinkActive="active">AI Gợi ý</a>
          <a *ngIf="isAuthenticated" routerLink="/dashboard" routerLinkActive="active">Học tập</a>
        </nav>
        <div class="header-right">
          <ng-container *ngIf="!isAuthenticated">
            <a routerLink="/login" class="btn btn-outline btn-sm">Tham gia</a>
          </ng-container>
          <ng-container *ngIf="isAuthenticated">
            <button class="icon-btn" routerLink="/cart">
              🔔
              <span class="badge-count">2</span>
            </button>
            <button class="icon-btn">🛒</button>
            <div class="user-menu" routerLink="/my-courses">
              <div class="avatar-sm">HV</div>
              <div class="user-info">
                <span class="user-name">Học viên</span>
                <span class="user-link">Học tập của tôi →</span>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: var(--primary);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .header-inner {
      max-width: 1320px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      height: 56px;
      gap: 40px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--white);
      font-size: 20px;
      font-weight: 800;
      white-space: nowrap;
    }
    .logo-icon {
      width: 32px;
      height: 32px;
      background: var(--white);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 900;
    }
    .nav {
      display: flex;
      gap: 32px;
    }
    .nav a {
      color: rgba(255,255,255,0.8);
      font-weight: 500;
      font-size: 15px;
      padding: 16px 0;
      border-bottom: 3px solid transparent;
      transition: var(--transition);
    }
    .nav a:hover, .nav a.active {
      color: var(--white);
      border-bottom-color: var(--white);
    }
    .header-right {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .header-right .btn-outline {
      color: var(--white);
      border-color: var(--white);
    }
    .header-right .btn-outline:hover {
      background: var(--white);
      color: var(--primary);
    }
    .icon-btn {
      position: relative;
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
    }
    .badge-count {
      position: absolute;
      top: -4px;
      right: -6px;
      background: var(--danger);
      color: var(--white);
      font-size: 10px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      transition: var(--transition);
    }
    .user-menu:hover {
      background: rgba(255,255,255,0.1);
    }
    .avatar-sm {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--white);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
    }
    .user-info {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      color: var(--white);
      font-weight: 600;
      font-size: 13px;
    }
    .user-link {
      color: rgba(255,255,255,0.7);
      font-size: 11px;
    }
  `]
})
export class HeaderComponent {
  @Input() isAuthenticated = false;
}
