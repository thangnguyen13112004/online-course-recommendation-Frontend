import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  template: `
    <app-header />
    <div class="auth-overlay" (click)="closeModal($event)">
      <div class="auth-modal" (click)="$event.stopPropagation()">
        <button class="close-btn" routerLink="/home">×</button>
        <!-- Tabs -->
        <div class="auth-tabs">
          <button class="auth-tab" [class.active]="activeTab() === 'login'" (click)="activeTab.set('login')">Đăng nhập</button>
          <button class="auth-tab" [class.active]="activeTab() === 'register'" (click)="activeTab.set('register')">Đăng ký</button>
        </div>

        <!-- Login Form -->
        <div *ngIf="activeTab() === 'login'" class="auth-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-input" placeholder="name&#64;email.com">
          </div>
          <div class="form-group">
            <label>Mật khẩu</label>
            <input type="password" class="form-input" placeholder="••••••••">
          </div>
          <div class="forgot-link">
            <a href="#">Quên mật khẩu?</a>
          </div>
          <button class="btn btn-primary btn-lg" style="width:100%">Đăng nhập</button>
          <div class="divider"><span>hoặc</span></div>
          <button class="btn social-btn google-btn">G  Tiếp tục với Google</button>
          <button class="btn social-btn facebook-btn">f  Tiếp tục với Facebook</button>
        </div>

        <!-- Register Form -->
        <div *ngIf="activeTab() === 'register'" class="auth-form">
          <div class="role-select">
            <strong>Tôi muốn đăng ký với tư cách</strong>
            <div class="role-options">
              <div class="role-option" [class.active]="selectedRole() === 'student'" (click)="selectedRole.set('student')">
                <span class="role-icon">👨‍🎓</span>
                <span>Học viên</span>
              </div>
              <div class="role-option" [class.active]="selectedRole() === 'instructor'" (click)="selectedRole.set('instructor')">
                <span class="role-icon">👨‍🏫</span>
                <span>Giảng viên</span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Họ và tên</label>
            <input type="text" class="form-input" placeholder="Họ và tên">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-input" placeholder="Email">
          </div>
          <div class="form-group">
            <label>Mật khẩu</label>
            <input type="password" class="form-input" placeholder="Mật khẩu">
          </div>
          <div class="form-group">
            <label>Xác nhận mật khẩu</label>
            <input type="password" class="form-input" placeholder="Xác nhận mật khẩu">
          </div>
          <button class="btn btn-primary btn-lg" style="width:100%">Tạo tài khoản</button>
          <div class="divider"><span>hoặc</span></div>
          <button class="btn social-btn google-btn">G  Đăng ký với Google</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(3px);
    }
    .auth-modal {
      background: var(--white);
      border-radius: var(--radius-lg);
      width: 420px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 28px;
      position: relative;
      box-shadow: var(--shadow-lg);
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .close-btn {
      position: absolute;
      top: 12px;
      right: 16px;
      background: none;
      font-size: 24px;
      color: var(--gray-400);
      cursor: pointer;
    }
    .auth-tabs {
      display: flex;
      border-bottom: 2px solid var(--gray-200);
      margin-bottom: 20px;
    }
    .auth-tab {
      flex: 1;
      padding: 12px;
      background: none;
      font-size: 15px;
      font-weight: 600;
      color: var(--gray-400);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: var(--transition);
    }
    .auth-tab.active {
      color: var(--gray-800);
      border-bottom-color: var(--primary);
    }
    .form-group { margin-bottom: 14px; }
    .form-group label {
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-600);
      margin-bottom: 4px;
      display: block;
    }
    .forgot-link {
      text-align: right;
      margin-bottom: 16px;
    }
    .forgot-link a {
      font-size: 13px;
      color: var(--primary);
    }
    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 16px 0;
      color: var(--gray-400);
      font-size: 13px;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--gray-200);
    }
    .social-btn {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--gray-300);
      background: var(--white);
      font-weight: 600;
      color: var(--gray-700);
      border-radius: var(--radius-sm);
      margin-bottom: 8px;
      transition: var(--transition);
    }
    .social-btn:hover {
      background: var(--gray-50);
    }
    .facebook-btn {
      background: #1877F2 !important;
      color: var(--white) !important;
      border-color: #1877F2 !important;
    }
    .role-select {
      margin-bottom: 16px;
    }
    .role-select strong {
      font-size: 14px;
      display: block;
      margin-bottom: 10px;
    }
    .role-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .role-option {
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-md);
      padding: 16px;
      text-align: center;
      cursor: pointer;
      transition: var(--transition);
    }
    .role-option.active {
      border-color: var(--primary);
      background: var(--primary-bg);
    }
    .role-icon {
      font-size: 28px;
      display: block;
      margin-bottom: 4px;
    }
  `]
})
export class AuthComponent {
  activeTab = signal<'login' | 'register'>('login');
  selectedRole = signal<'student' | 'instructor'>('student');

  closeModal(event: MouseEvent) {
    // Only close if clicking overlay
  }
}
