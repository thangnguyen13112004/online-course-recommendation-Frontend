import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pwd-section">
      <div class="pwd-header">
        <div class="pwd-icon-wrap">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div>
          <h3>Đổi mật khẩu</h3>
          <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
        </div>
      </div>

      <!-- Success Banner -->
      <div class="success-banner" *ngIf="changeSuccess">
        <i class="fa-solid fa-circle-check"></i>
        <span>Mật khẩu đã được cập nhật thành công!</span>
        <button class="close-banner" (click)="changeSuccess = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Error Banner -->
      <div class="error-banner" *ngIf="errorMsg">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>{{ errorMsg }}</span>
        <button class="close-banner" (click)="errorMsg = ''">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="pwd-form">
        <!-- Current Password -->
        <div class="form-group">
          <label for="currentPassword">
            <i class="fa-solid fa-lock"></i> Mật khẩu hiện tại
          </label>
          <div class="input-wrap">
            <input
              id="currentPassword"
              [type]="showCurrentPwd ? 'text' : 'password'"
              class="form-control"
              [(ngModel)]="currentPassword"
              placeholder="Nhập mật khẩu hiện tại"
              [class.invalid]="submitted && !currentPassword"
            >
            <button class="toggle-pwd" (click)="showCurrentPwd = !showCurrentPwd" type="button" tabindex="-1">
              <i class="fa-solid" [ngClass]="showCurrentPwd ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>
          <span class="field-error" *ngIf="submitted && !currentPassword">Vui lòng nhập mật khẩu hiện tại</span>
        </div>

        <!-- New Password -->
        <div class="form-group">
          <label for="newPassword">
            <i class="fa-solid fa-key"></i> Mật khẩu mới
          </label>
          <div class="input-wrap">
            <input
              id="newPassword"
              [type]="showNewPwd ? 'text' : 'password'"
              class="form-control"
              [(ngModel)]="newPassword"
              (ngModelChange)="onPasswordChange()"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              [class.invalid]="submitted && (!newPassword || newPassword.length < 6)"
            >
            <button class="toggle-pwd" (click)="showNewPwd = !showNewPwd" type="button" tabindex="-1">
              <i class="fa-solid" [ngClass]="showNewPwd ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>
          <span class="field-error" *ngIf="submitted && !newPassword">Vui lòng nhập mật khẩu mới</span>
          <span class="field-error" *ngIf="submitted && newPassword && newPassword.length < 6">Mật khẩu phải có ít nhất 6 ký tự</span>

          <!-- Strength indicator -->
          <div class="strength-bar-wrap" *ngIf="newPassword">
            <div class="strength-bar">
              <div class="strength-fill" [style.width]="strengthPercent + '%'" [style.background]="strengthColor"></div>
            </div>
            <span class="strength-text" [style.color]="strengthColor">{{ strengthLabel }}</span>
          </div>

          <!-- Rules -->
          <div class="pwd-rules" *ngIf="newPassword">
            <div class="rule" [class.valid]="newPassword.length >= 6">
              <i class="fa-solid" [ngClass]="newPassword.length >= 6 ? 'fa-circle-check' : 'fa-circle'"></i>
              Tối thiểu 6 ký tự
            </div>
            <div class="rule" [class.valid]="hasUpperCase">
              <i class="fa-solid" [ngClass]="hasUpperCase ? 'fa-circle-check' : 'fa-circle'"></i>
              Chứa chữ hoa (A-Z)
            </div>
            <div class="rule" [class.valid]="hasNumber">
              <i class="fa-solid" [ngClass]="hasNumber ? 'fa-circle-check' : 'fa-circle'"></i>
              Chứa số (0-9)
            </div>
            <div class="rule" [class.valid]="hasSpecial">
              <i class="fa-solid" [ngClass]="hasSpecial ? 'fa-circle-check' : 'fa-circle'"></i>
              Chứa ký tự đặc biệt (!&#64;#$...)
            </div>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">
            <i class="fa-solid fa-check-double"></i> Xác nhận mật khẩu mới
          </label>
          <div class="input-wrap">
            <input
              id="confirmPassword"
              [type]="showConfirmPwd ? 'text' : 'password'"
              class="form-control"
              [(ngModel)]="confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              [class.invalid]="submitted && confirmPassword && confirmPassword !== newPassword"
              [class.matched]="confirmPassword && confirmPassword === newPassword"
            >
            <button class="toggle-pwd" (click)="showConfirmPwd = !showConfirmPwd" type="button" tabindex="-1">
              <i class="fa-solid" [ngClass]="showConfirmPwd ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
            <i class="fa-solid fa-circle-check match-icon" *ngIf="confirmPassword && confirmPassword === newPassword"></i>
          </div>
          <span class="field-error" *ngIf="submitted && !confirmPassword">Vui lòng xác nhận mật khẩu</span>
          <span class="field-error" *ngIf="submitted && confirmPassword && confirmPassword !== newPassword">Mật khẩu xác nhận không khớp</span>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button class="btn btn-primary" [disabled]="isChanging" (click)="onSubmit()">
            <i class="fa-solid fa-circle-notch fa-spin" *ngIf="isChanging"></i>
            <i class="fa-solid fa-shield-check" *ngIf="!isChanging"></i>
            {{ isChanging ? 'Đang xử lý...' : 'Cập nhật mật khẩu' }}
          </button>
          <button class="btn btn-ghost" (click)="resetForm()" *ngIf="currentPassword || newPassword || confirmPassword">
            <i class="fa-solid fa-rotate-left"></i> Đặt lại
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pwd-section {
      animation: fadeIn 0.4s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .pwd-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--gray-100, #f3f4f6);
    }
    .pwd-icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #5B63D3 0%, #8B5CF6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 22px;
      flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(91,99,211,0.25);
    }
    .pwd-header h3 {
      font-size: 18px;
      font-weight: 700;
      color: var(--gray-800, #1f2937);
      margin: 0 0 4px 0;
    }
    .pwd-header p {
      font-size: 13px;
      color: var(--gray-500, #6b7280);
      margin: 0;
    }

    /* ===== Banners ===== */
    .success-banner, .error-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 12px;
      margin-bottom: 24px;
      font-size: 14px;
      font-weight: 500;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .success-banner {
      background: linear-gradient(135deg, rgba(40,167,69,0.08) 0%, rgba(40,167,69,0.04) 100%);
      border: 1px solid rgba(40,167,69,0.2);
      color: #28A745;
    }
    .success-banner i:first-child { font-size: 18px; }
    .error-banner {
      background: linear-gradient(135deg, rgba(220,53,69,0.08) 0%, rgba(220,53,69,0.04) 100%);
      border: 1px solid rgba(220,53,69,0.2);
      color: #DC3545;
    }
    .error-banner i:first-child { font-size: 18px; }
    .close-banner {
      margin-left: auto;
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      transition: opacity 0.2s;
      font-size: 14px;
    }
    .close-banner:hover { opacity: 1; }

    /* ===== Form ===== */
    .pwd-form {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .form-group label {
      font-size: 13px;
      font-weight: 600;
      color: var(--gray-700, #374151);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .form-group label i {
      font-size: 12px;
      color: var(--gray-400, #9ca3af);
    }
    .input-wrap {
      position: relative;
    }
    .form-control {
      width: 100%;
      padding: 12px 48px 12px 16px;
      border: 1.5px solid var(--gray-200, #e5e7eb);
      border-radius: 10px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: all 0.25s ease;
      background: var(--gray-50, #f9fafb);
      color: var(--gray-800, #1f2937);
      box-sizing: border-box;
    }
    .form-control::placeholder {
      color: var(--gray-400, #9ca3af);
    }
    .form-control:focus {
      border-color: var(--primary, #5B63D3);
      background: var(--white, #fff);
      box-shadow: 0 0 0 3px rgba(91,99,211,0.12);
    }
    .form-control.invalid {
      border-color: #DC3545;
      background: rgba(220,53,69,0.02);
    }
    .form-control.invalid:focus {
      box-shadow: 0 0 0 3px rgba(220,53,69,0.1);
    }
    .form-control.matched {
      border-color: #28A745;
    }
    .form-control.matched:focus {
      box-shadow: 0 0 0 3px rgba(40,167,69,0.1);
    }

    .toggle-pwd {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--gray-400, #9ca3af);
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s;
      font-size: 14px;
    }
    .toggle-pwd:hover {
      color: var(--gray-600, #4b5563);
    }

    .match-icon {
      position: absolute;
      right: 42px;
      top: 50%;
      transform: translateY(-50%);
      color: #28A745;
      font-size: 14px;
      animation: popIn 0.3s ease;
    }
    @keyframes popIn {
      from { opacity: 0; transform: translateY(-50%) scale(0.5); }
      to { opacity: 1; transform: translateY(-50%) scale(1); }
    }

    .field-error {
      font-size: 12px;
      color: #DC3545;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* ===== Strength Bar ===== */
    .strength-bar-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .strength-bar {
      flex: 1;
      height: 5px;
      background: var(--gray-100, #f3f4f6);
      border-radius: 10px;
      overflow: hidden;
    }
    .strength-fill {
      height: 100%;
      border-radius: 10px;
      transition: all 0.4s ease;
    }
    .strength-text {
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }

    /* ===== Password Rules ===== */
    .pwd-rules {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .rule {
      font-size: 12px;
      color: var(--gray-400, #9ca3af);
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .rule i { font-size: 10px; }
    .rule.valid {
      color: #28A745;
    }

    /* ===== Actions ===== */
    .form-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 8px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      border: none;
      font-family: inherit;
    }
    .btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }
    .btn-primary {
      background: linear-gradient(135deg, #5B63D3 0%, #7B82E0 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(91,99,211,0.2);
    }
    .btn-primary:not(:disabled):hover {
      box-shadow: 0 4px 20px rgba(91,99,211,0.35);
      transform: translateY(-1px);
    }
    .btn-ghost {
      background: transparent;
      color: var(--gray-500, #6b7280);
      border: 1px solid var(--gray-200, #e5e7eb);
    }
    .btn-ghost:hover {
      background: var(--gray-50, #f9fafb);
      color: var(--gray-700, #374151);
    }
  `]
})
export class ChangePasswordComponent {
  private auth = inject(AuthService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrentPwd = false;
  showNewPwd = false;
  showConfirmPwd = false;

  isChanging = false;
  changeSuccess = false;
  errorMsg = '';
  submitted = false;

  // Strength
  hasUpperCase = false;
  hasNumber = false;
  hasSpecial = false;
  strengthPercent = 0;
  strengthColor = '#DC3545';
  strengthLabel = 'Yếu';

  onPasswordChange() {
    const pwd = this.newPassword;
    this.hasUpperCase = /[A-Z]/.test(pwd);
    this.hasNumber = /[0-9]/.test(pwd);
    this.hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (this.hasUpperCase) score++;
    if (this.hasNumber) score++;
    if (this.hasSpecial) score++;

    if (score <= 1) {
      this.strengthPercent = 20;
      this.strengthColor = '#DC3545';
      this.strengthLabel = 'Yếu';
    } else if (score <= 2) {
      this.strengthPercent = 40;
      this.strengthColor = '#FD7E14';
      this.strengthLabel = 'Trung bình';
    } else if (score <= 3) {
      this.strengthPercent = 60;
      this.strengthColor = '#FFC107';
      this.strengthLabel = 'Khá';
    } else if (score <= 4) {
      this.strengthPercent = 80;
      this.strengthColor = '#20C997';
      this.strengthLabel = 'Mạnh';
    } else {
      this.strengthPercent = 100;
      this.strengthColor = '#28A745';
      this.strengthLabel = 'Rất mạnh';
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    this.changeSuccess = false;

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      return;
    }
    if (this.newPassword.length < 6) {
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'Mật khẩu xác nhận không khớp!';
      return;
    }
    if (this.currentPassword === this.newPassword) {
      this.errorMsg = 'Mật khẩu mới không được trùng với mật khẩu hiện tại!';
      return;
    }

    this.isChanging = true;
    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.isChanging = false;
        this.changeSuccess = true;
        this.resetForm();
        setTimeout(() => this.changeSuccess = false, 5000);
      },
      error: (err) => {
        this.isChanging = false;
        if (err.status === 400) {
          this.errorMsg = err.error?.message || 'Mật khẩu hiện tại không chính xác!';
        } else if (err.status === 401) {
          this.errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else {
          this.errorMsg = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
        }
      }
    });
  }

  resetForm() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showCurrentPwd = false;
    this.showNewPwd = false;
    this.showConfirmPwd = false;
    this.submitted = false;
    this.strengthPercent = 0;
    this.hasUpperCase = false;
    this.hasNumber = false;
    this.hasSpecial = false;
  }
}
