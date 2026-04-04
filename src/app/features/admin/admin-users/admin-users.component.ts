import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../../layouts/admin-layout/admin-layout.component';
import { DataService } from '../../../core/services/data.service';
import { ApiService } from '../../../core/services/api.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent, PaginationComponent],
  template: `
    <app-admin-layout>
      <h1><i class="fa-solid fa-clipboard-list"></i> Quản lý người dùng</h1>

      <!-- Filters -->
      <div class="filter-row">
        <input type="text" class="form-input" placeholder="Tìm kiếm người dùng..." style="flex:1" [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()">
        <div class="filter-select" (click)="filterByRole('')" [class.active]="filterRole === ''">Tất cả vai trò</div>
        <div class="filter-select" (click)="filterByRole('HocVien')" [class.active]="filterRole === 'HocVien'">Học viên</div>
        <div class="filter-select" (click)="filterByRole('GiaoVien')" [class.active]="filterRole === 'GiaoVien'">Giảng viên</div>
        <div class="filter-select" (click)="filterByRole('Admin')" [class.active]="filterRole === 'Admin'">Admin</div>
      </div>



      <!-- User Stats -->
      <div class="user-stats">
        <div class="us-item"><span class="us-val primary">{{ dataService.adminStats().students }}</span><span>Học viên</span></div>
        <div class="us-item"><span class="us-val success">{{ dataService.adminStats().instructors }}</span><span>Giảng viên</span></div>
        <div class="us-item"><span class="us-val orange">{{ dataService.adminStats().admins }}</span><span>Admin</span></div>
      </div>

      <!-- Table -->
      <div class="table-wrapper card">
        <table>
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            @for (user of dataService.users(); track user.id) {
            <tr>
              <td>
                <div class="user-cell">
                  <div class="avatar" [style.background]="user.color">
                    <img *ngIf="user.linkAnhDaiDien" [src]="user.linkAnhDaiDien" 
                         class="avatar-img" (error)="user.linkAnhDaiDien = ''" alt="Avatar">
                    <span *ngIf="!user.linkAnhDaiDien">{{ user.initials }}</span>
                  </div>
                  <div>
                    <strong>{{ user.name }}</strong>
                    <span class="user-email-sm">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <select class="role-select" 
                        [ngModel]="user.role === 'admin' ? 'Admin' : (user.role === 'instructor' ? 'GiaoVien' : 'HocVien')"
                        (ngModelChange)="changeRole(user, $event)">
                  <option value="HocVien">Học viên</option>
                  <option value="GiaoVien">Giảng viên</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
              <td>
                <span class="status-badge" [class.active]="user.status === 'active'">
                  <span class="status-dot" [class.active]="user.status === 'active'" [class.inactive]="user.status === 'inactive'"></span>
                  {{ user.status === 'active' ? 'Hoạt động' : 'Bị khóa' }}
                </span>
              </td>
              <td>{{ user.joinDate }}</td>
              <td>
                <button class="action-btn" 
                        [class.lock]="user.status === 'active'"
                        [class.unlock]="user.status === 'inactive'"
                        (click)="toggleStatus(user)"
                        [disabled]="user._saving"
                        [title]="user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'">
                  <i [class]="user._saving ? 'fa-solid fa-circle-notch fa-spin' : (user.status === 'active' ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open')"></i>
                  {{ user.status === 'active' ? 'Khóa' : 'Mở khóa' }}
                </button>
              </td>
            </tr>
            } @empty {
            <tr>
              <td colspan="6" style="text-align: center; padding: 40px; color: var(--gray-400);">
                <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                Ngưới dùng đang trống hoặc đang tải...
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <app-pagination 
        [currentPage]="dataService.currentUsersPage()"
        [totalItems]="dataService.usersTotal()"
        [pageSize]="10"
        (pageChange)="onPageChange($event)">
      </app-pagination>

      <!-- Toast -->
      <div class="toast" *ngIf="toastMessage" [class.error]="toastType === 'error'" (click)="toastMessage = ''">
        <i [class]="toastType === 'error' ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-check'"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 16px; }
    .filter-row { display: flex; gap: 12px; margin-bottom: 16px; }
    .filter-select {
      padding: 10px 14px; border: 1px solid var(--gray-300);
      border-radius: var(--radius-sm); font-size: 13px; background: var(--white);
      cursor: pointer; white-space: nowrap; transition: all 0.2s ease;
    }
    .filter-select:hover { border-color: var(--primary); }
    .filter-select.active { background: var(--primary); color: white; border-color: var(--primary); }
    .user-stats { display: flex; gap: 16px; margin-bottom: 20px; }
    .us-item {
      padding: 14px 24px; border: 1px solid var(--gray-200);
      border-radius: var(--radius-sm); background: var(--white);
      display: flex; align-items: center; gap: 8px;
    }
    .us-val { font-size: 22px; font-weight: 800; }
    .us-val.primary { color: var(--primary); }
    .us-val.success { color: var(--success); }
    .us-val.orange { color: var(--orange); }
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: var(--white); font-weight: 700; font-size: 11px;
      overflow: hidden; flex-shrink: 0;
    }
    .avatar-img {
      width: 100%; height: 100%; object-fit: cover;
    }
    .user-email-sm { font-size: 11px; color: var(--gray-400); display: block; }
    .role-select {
      padding: 6px 10px; border-radius: 6px; border: 1px solid var(--gray-200);
      font-size: 12px; font-weight: 600; cursor: pointer;
      background: var(--gray-50); outline: none; transition: all 0.2s ease;
    }
    .role-select:focus { border-color: var(--primary); }
    .status-badge { font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .status-dot { width: 7px; height: 7px; border-radius: 50%; }
    .status-dot.active { background: #28A745; }
    .status-dot.inactive { background: #DC3545; }
    .action-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all 0.2s ease; border: none;
    }
    .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .action-btn.lock { background: rgba(220,53,69,0.08); color: #DC3545; }
    .action-btn.lock:hover:not(:disabled) { background: #DC3545; color: white; }
    .action-btn.unlock { background: rgba(40,167,69,0.08); color: #28A745; }
    .action-btn.unlock:hover:not(:disabled) { background: #28A745; color: white; }

    /* Toast */
    .toast {
      position: fixed; bottom: 32px; right: 32px; background: var(--gray-800); color: white;
      padding: 14px 24px; border-radius: 14px; display: flex; align-items: center; gap: 10px;
      font-size: 14px; font-weight: 600; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      animation: toastSlide 0.4s ease; cursor: pointer; z-index: 1000;
    }
    .toast i { color: #28A745; font-size: 18px; }
    .toast.error { background: #DC3545; }
    .toast.error i { color: white; }
    @keyframes toastSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminUsersComponent implements OnInit {
  dataService = inject(DataService);
  private api = inject(ApiService);

  filterRole = '';
  searchTerm = '';
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  ngOnInit() {
    this.dataService.loadUsers();
    this.dataService.loadAdminStats();
  }

  onSearchChange() {
    this.dataService.loadUsers(1, this.searchTerm, this.filterRole);
  }

  onPageChange(page: number) {
    this.dataService.loadUsers(page, this.searchTerm, this.filterRole);
  }

  filterByRole(role: string) {
    this.filterRole = role;
    this.dataService.loadUsers(1, this.searchTerm, this.filterRole);
  }

  changeRole(user: any, newRole: string) {
    if (newRole === user.vaiTro) return;

    this.api.updateUserRole(user.maNguoiDung || user.id, newRole).subscribe({
      next: (res) => {
        this.showToast(res.message || `Đã đổi vai trò thành ${newRole}`);
        user.vaiTro = newRole;
        user.role = this.mapRoleName(newRole);
        this.dataService.loadAdminStats();
      },
      error: (err) => {
        const errorDetail = err.error?.message || `Lỗi ${err.status}: ${err.message}`;
        this.showToast(errorDetail, 'error');
        // user.vaiTro was never updated, so [ngModel] will eventually sync or we can trigger change detection
      }
    });
  }

  toggleStatus(user: any) {
    const newStatus = user.status === 'active' ? 'Bị khóa' : 'Hoạt động';
    user._saving = true;

    this.api.updateUserStatus(user.maNguoiDung || user.id, newStatus).subscribe({
      next: (res) => {
        this.showToast(res.message || `Đã cập nhật trạng thái`);
        user.status = newStatus === 'Bị khóa' ? 'inactive' : 'active';
        user.tinhTrang = newStatus;
        user._saving = false;
      },
      error: (err) => {
        const errorDetail = err.error?.message || `Lỗi ${err.status}: ${err.message}`;
        this.showToast(errorDetail, 'error');
        user._saving = false;
      }
    });
  }

  private mapRoleName(vaiTro: string): string {
    const map: Record<string, string> = { 'HocVien': 'student', 'GiaoVien': 'instructor', 'Admin': 'admin' };
    return map[vaiTro] || 'student';
  }

  private showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 4000);
  }
}
