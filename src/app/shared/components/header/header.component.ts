import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header" [class.authenticated]="authService.isLoggedIn()">
      <div class="header-inner">
        <a routerLink="/" class="logo">
          <span class="logo-icon">E</span>
          <span class="logo-text">EduLearn</span>
        </a>
        <nav class="nav">
          <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Trang chủ</a>
          <a routerLink="/course" routerLinkActive="active">Khóa học</a>
          <a routerLink="/ai-recommendations" routerLinkActive="active">AI Gợi ý</a>
          <a *ngIf="authService.isLoggedIn()" routerLink="/dashboard" routerLinkActive="active">Học tập của tôi</a>
        </nav>
        <div class="header-right">
          <!-- Cart Button -->
          <button class="icon-action-btn cart-btn" routerLink="/cart" title="Giỏ hàng" aria-label="Giỏ hàng">
            <i class="fa-solid fa-cart-shopping"></i>
            <span class="cart-badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
          </button>

          <!-- Notifications Button -->
          <div class="notification-wrapper" *ngIf="authService.isLoggedIn()" (clickOutside)="showNotifs = false">
            <button class="icon-action-btn notif-btn" (click)="toggleNotifications()" title="Thông báo">
              <i class="fa-regular fa-bell"></i>
              <span class="notif-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
            </button>
            
            <div class="notif-dropdown" *ngIf="showNotifs">
              <div class="notif-header">
                <h4>Thông báo</h4>
                <span class="mark-read" (click)="markAllAsRead()">Đánh dấu đã đọc</span>
              </div>
              <div class="notif-body">
                <div class="notif-item" *ngFor="let n of notifications" [class.unread]="!n.daDoc" (click)="readNotification(n.maThongBao)">
                  <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>
                  <div class="notif-content">
                    <h5>{{ n.tieuDe }}</h5>
                    <p>{{ n.noiDung }}</p>
                    <span class="notif-time">{{ n.ngayTao | date:'dd/MM/yyyy HH:mm' }}</span>
                  </div>
                </div>
                <div class="notif-empty" *ngIf="notifications.length === 0">
                  <i class="fa-regular fa-bell-slash"></i>
                  <p>Không có thông báo nào</p>
                </div>
              </div>
            </div>
          </div>

          <ng-container *ngIf="!authService.isLoggedIn()">
            <a routerLink="/login" class="btn btn-outline btn-sm">Tham gia</a>
          </ng-container>
          <ng-container *ngIf="authService.isLoggedIn()">
            <div class="user-menu-pill" [routerLink]="getProfileLink()">
              <div class="avatar-wrapper">
                <img *ngIf="authService.currentUser()?.avatar" [src]="authService.currentUser()?.avatar" class="user-avatar" alt="Avatar">
                <div *ngIf="!authService.currentUser()?.avatar" class="avatar-gradient">{{ getInitials() }}</div>
              </div>
              <div class="user-info">
                <span class="user-name">{{ authService.userName() || 'Học viên' }}</span>
                <span class="user-link">{{ getProfileText() }} <i class="fa-solid fa-chevron-right" style="font-size: 10px; margin-left: 4px;"></i></span>
              </div>
            </div>
            <button class="icon-action-btn logout-btn" (click)="logout()" title="Đăng xuất" aria-label="Đăng xuất">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
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
    
    /* Modern Header Right Styles */
    .header-right {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-right .btn-outline {
      color: var(--white);
      border-color: var(--white);
    }
    .header-right .btn-outline:hover {
      background: var(--white);
      color: var(--primary);
    }
    
    .icon-action-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
    }
    .icon-action-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .icon-action-btn.logout-btn:hover {
      background: rgba(220, 53, 69, 0.9);
      border-color: rgba(220, 53, 69, 0.5);
      color: #fff;
    }

    .cart-btn {
      position: relative;
    }
    .cart-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #ff4757;
      color: white;
      font-size: 10px;
      font-weight: 700;
      height: 18px;
      min-width: 18px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      border: 2px solid var(--primary, #4361ee);
    }

    .notification-wrapper { position: relative; }
    .notif-badge {
      position: absolute; top: -4px; right: -4px; background: #FF9800; color: white;
      font-size: 10px; font-weight: 700; height: 18px; min-width: 18px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; padding: 0 4px;
      border: 2px solid var(--primary);
    }
    .notif-dropdown {
      position: absolute; top: 50px; right: 0; width: 320px; background: white;
      border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); z-index: 1000;
      border: 1px solid var(--gray-200); overflow: hidden;
    }
    .notif-header {
      display: flex; justify-content: space-between; align-items: center; padding: 16px;
      border-bottom: 1px solid var(--gray-100);
    }
    .notif-header h4 { font-size: 16px; margin: 0; color: var(--gray-800); }
    .mark-read { font-size: 12px; color: var(--primary); cursor: pointer; font-weight: 500; }
    .notif-body { max-height: 350px; overflow-y: auto; }
    .notif-item {
      display: flex; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--gray-100);
      cursor: pointer; transition: background 0.2s;
    }
    .notif-item:hover { background: var(--gray-50); }
    .notif-item.unread { background: #f0f7ff; }
    .notif-item.unread:hover { background: #e5f0fa; }
    .notif-icon {
      width: 36px; height: 36px; background: var(--primary-bg); color: var(--primary);
      border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .notif-content h5 { font-size: 13px; margin: 0 0 4px; color: var(--gray-800); }
    .notif-content p { font-size: 12px; margin: 0 0 6px; color: var(--gray-600); line-height: 1.4; }
    .notif-time { font-size: 11px; color: var(--gray-400); }
    .notif-empty { text-align: center; padding: 30px 20px; color: var(--gray-400); }
    .notif-empty i { font-size: 30px; margin-bottom: 10px; }

    .user-menu-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 16px 4px 4px;
      border-radius: 50px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      outline: none;
    }
    .user-menu-pill:hover {
      background: rgba(255, 255, 255, 0.18);
      border-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    
    .avatar-wrapper {
      width: 34px;
      height: 34px;
      position: relative;
    }
    .user-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid rgba(255, 255, 255, 0.8);
    }
    .avatar-gradient {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 13px;
      box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4);
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 1px;
    }
    .user-name {
      color: var(--white);
      font-weight: 600;
      font-size: 13px;
      line-height: 1.2;
    }
    .user-link {
      color: rgba(255, 255, 255, 0.7);
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .user-menu-pill:hover .user-link {
      color: rgba(255, 255, 255, 0.95);
    }
    .user-link i {
      transition: transform 0.2s ease;
    }
    .user-menu-pill:hover .user-link i {
      transform: translateX(3px);
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  dataService = inject(DataService);

  showNotifs = false;

  constructor() {
    if (this.authService.isLoggedIn()) {
      this.dataService.loadNotifications();
    }
  }

  get notifications() {
    return this.dataService.notifications();
  }

  get unreadCount() {
    return this.dataService.unreadNotifications();
  }

  toggleNotifications() {
    this.showNotifs = !this.showNotifs;
  }

  readNotification(id: number) {
    this.dataService.markNotificationRead(id);
  }

  markAllAsRead() {
    const unread = this.notifications.filter(n => !n.daDoc);
    unread.forEach(n => this.readNotification(n.maThongBao));
  }

  get cartCount() {
    return this.dataService.cartItems().length;
  }

  getInitials() {
    const name = this.authService.userName() || 'HV';
    return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  }

  getProfileLink() {
    const role = this.authService.userRole();
    if (role === 'Admin') return '/admin/dashboard';
    if (role === 'GiaoVien') return '/instructor/dashboard';
    return '/student/settings';
  }

  getProfileText() {
    const role = this.authService.userRole();
    if (role === 'Admin') return 'Trang quản trị';
    if (role === 'GiaoVien') return 'Trang giảng viên';
    return 'Cài đặt cá nhân';
  }

  logout() {
    this.authService.logout();
  }
}

