import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ChangePasswordComponent } from '../../../shared/components/change-password/change-password.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, ChangePasswordComponent],
  template: `
    <app-header />
    
    <div class="settings-container">
      <div class="header-action">
        <div>
          <h1><i class="fa-solid fa-user-gear"></i> Tài khoản của tôi</h1>
          <p class="subtitle">Cập nhật hồ sơ để mọi người biết thêm về bạn.</p>
        </div>
      </div>

      <div class="settings-grid">
        <!-- Profile Column (Matches Instructor Screenshot) -->
        <div class="section card">
          <h3 class="section-title"><i class="fa-solid fa-user-graduate"></i> Hồ sơ Học viên</h3>
          
          <!-- Avatar Preview -->
          <div class="avatar-edit">
            <div class="avatar-preview" [style.background-image]="avatarUrl ? 'url(' + avatarUrl + ')' : ''" [class.no-avt]="!avatarUrl">
              <i class="fa-solid fa-camera" *ngIf="!avatarUrl"></i>
            </div>
            <div class="avatar-actions">
              <label class="btn btn-outline btn-sm">
                <i class="fa-solid fa-upload"></i> Tải ảnh mới
                <input type="file" hidden accept="image/*" (change)="onFileSelected($event)">
              </label>
              <button class="btn btn-icon btn-sm" style="color:var(--danger); border-color:transparent;" (click)="avatarUrl=''" title="Xóa ảnh"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
          
          <div class="form-group mt-20">
            <label>Tên hiển thị (Tên thật)</label>
            <input type="text" class="form-control" [(ngModel)]="fullName" placeholder="Nhập tên thật">
          </div>
          
          <div class="form-group">
            <label>Danh hiệu / Nghề nghiệp</label>
            <input type="text" class="form-control" [(ngModel)]="jobTitle" placeholder="Vd: Sinh viên HUIT, Lập trình viên...">
          </div>

          <div class="form-group">
            <label>Tiểu sử / Tóm tắt chuyên môn</label>
            <textarea class="form-control" rows="4" [(ngModel)]="bio" placeholder="Chia sẻ đôi điều về bạn..."></textarea>
          </div>
          
          <div class="form-actions">
            <button class="btn btn-primary" [disabled]="isSaving" (click)="saveProfile()">
              <i class="fa-solid fa-circle-notch fa-spin" *ngIf="isSaving"></i> 
              <i class="fa-solid fa-save" *ngIf="!isSaving"></i> {{ isSaving ? 'Đang lưu...' : 'Lưu hồ sơ' }}
            </button>
            <span class="save-success" *ngIf="saveSuccess"><i class="fa-solid fa-check"></i> Đã lưu thành công!</span>
          </div>
        </div>

        <!-- Sidebar / Password Column -->
        <div class="settings-sidebar">
          <div class="section card">
            <h3 class="section-title"><i class="fa-solid fa-shield-halved"></i> Bảo mật tài khoản</h3>
            <p class="text-sm">Quản lý mật khẩu và quyền riêng tư của bạn.</p>
            <app-change-password></app-change-password>
          </div>

          <div class="section card mt-20" style="border-top: 3px solid var(--danger);">
            <h3 class="section-title" style="color:var(--danger)"><i class="fa-solid fa-circle-exclamation"></i> Vùng nguy hiểm</h3>
            <p class="text-sm">Vô hiệu hóa tài khoản sẽ xóa hồ sơ của bạn khỏi hệ thống công cộng.</p>
            <button class="btn btn-outline-danger w-100" (click)="deactivateAccount()">Vô hiệu hóa tài khoản</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 24px;
      animation: fadeIn 0.4s ease-out;
    }
    h1 { font-size: 24px; margin-bottom: 4px; font-weight: 800; color: var(--gray-800); }
    .subtitle { font-size: 14px; color: var(--gray-500); }
    .header-action { margin-bottom: 24px; }
    
    .settings-grid {
      display: grid;
      grid-template-columns: 2fr 1.2fr;
      gap: 24px;
    }
    
    .section { padding: 32px; background: white; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .section-title { font-size: 16px; font-weight: 700; color: var(--gray-800); margin-bottom: 24px; display: flex; align-items: center; gap: 8px;}
    .section-title i { color: var(--primary);}
    
    .avatar-edit { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; padding: 16px; background: var(--gray-50); border-radius: 16px; }
    .avatar-preview {
      width: 80px; height: 80px; border-radius: 50%;
      background-size: cover; background-position: center; border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .avatar-preview.no-avt {
      background: var(--gray-100); display: flex; align-items: center; justify-content: center;
      font-size: 28px; color: var(--gray-300);
    }
    .avatar-actions { display: flex; gap: 10px; }
    
    .form-group { margin-bottom: 20px; position: relative; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; color: var(--gray-700); margin-bottom: 8px; }
    .form-control {
      width: 100%; padding: 12px 16px; border: 1.5px solid var(--gray-200); border-radius: 12px;
      font-size: 14px; outline: none; transition: all 0.25s ease;
      font-family: inherit;
    }
    .form-control:focus {
      border-color: var(--primary); box-shadow: 0 0 0 4px rgba(91, 99, 211, 0.08);
    }
    
    .mt-20 { margin-top: 20px; }
    .w-100 { width: 100%; }
    
    .text-sm { font-size: 13px; color: var(--gray-500); margin-bottom: 20px; line-height: 1.5; }
    
    .btn-outline-danger {
      border: 1.5px solid var(--danger); color: var(--danger); background: transparent;
      padding: 10px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-outline-danger:hover { background: rgba(220,53,69,0.05); }

    .form-actions { display: flex; align-items: center; gap: 16px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--gray-100); }
    .save-success { color: var(--success); font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; }

    .btn-primary {
      background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 12px;
      font-weight: 700; cursor: pointer; transition: all 0.3s;
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(91,99,211,0.3); }

    .btn-outline {
      background: white; border: 1.5px solid var(--gray-200); border-radius: 10px; padding: 8px 16px;
      font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s;
    }
    .btn-outline:hover { border-color: var(--primary); color: var(--primary); }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class StudentSettingsComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  currentTab: 'profile' | 'security' = 'profile';

  fullName = '';
  jobTitle = '';
  email = '';
  bio = '';
  avatarUrl = '';

  isSaving = false;
  saveSuccess = false;

  getInitials() {
    return (this.fullName || this.auth.userName() || 'U').substring(0, 2).toUpperCase();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit() {
    this.api.getUserProfile().subscribe({
      next: (res) => {
        if (res) {
          this.fullName = res.ten || '';
          this.email = res.email || '';
          this.bio = res.tieuSu || '';
          this.avatarUrl = res.linkAnhDaiDien || '';
        }
      },
      error: () => {
        this.fullName = this.auth.userName() || '';
      }
    });
  }

  saveProfile() {
    this.isSaving = true;
    this.saveSuccess = false;

    this.api.updateUserProfile({
      ten: this.fullName,
      tieuSu: this.bio,
      linkAnhDaiDien: this.avatarUrl
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveSuccess = true;

        // Sync global auth state immediately
        const user = this.auth.currentUser();
        if (user) {
          this.auth.updateLocalUser({
            ...user,
            userName: this.fullName,
            avatar: this.avatarUrl
          });
        }
        // Force header update by retriggering signal (if needed)

        setTimeout(() => this.saveSuccess = false, 3000);
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  deactivateAccount() {
    Swal.fire({
      title: 'Xóa tài khoản?',
      text: 'Bạn có chắc chắn muốn xóa (vô hiệu hóa) tài khoản không? Thao tác này sẽ đăng xuất bạn ra khỏi hệ thống.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6e7881',
      confirmButtonText: 'Đồng ý xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deactivateAccount().subscribe({
          next: () => {
            Swal.fire({
              title: 'Đã xóa!',
              text: 'Tài khoản của bạn đã được vô hiệu hóa.',
              icon: 'success',
              confirmButtonColor: '#5B63D3'
            }).then(() => {
              this.auth.logout();
              this.router.navigate(['/login']);
            });
          },
          error: (err) => {
            Swal.fire('Lỗi', 'Có lỗi xảy ra: ' + (err.error?.message || 'Vui lòng thử lại sau.'), 'error');
          }
        });
      }
    });
  }
}
