import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../../layouts/admin-layout/admin-layout.component';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <h1>📋 Quản lý người dùng</h1>

      <!-- Filters -->
      <div class="filter-row">
        <input type="text" class="form-input" placeholder="📝 Tìm kiếm người dùng..." style="flex:1">
        <div class="filter-select">Tất cả vai trò 📋</div>
        <div class="filter-select">Trạng thái ▾</div>
        <button class="btn btn-primary">📝 Thêm người dùng</button>
      </div>

      <!-- User Stats -->
      <div class="user-stats">
        <div class="us-item"><span class="us-val primary">1.240</span><span>Học viên</span></div>
        <div class="us-item"><span class="us-val success">86</span><span>Giảng viên</span></div>
        <div class="us-item"><span class="us-val orange">4</span><span>Admin</span></div>
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
              <th>Khóa học</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of dataService.users()">
              <td>
                <div class="user-cell">
                  <div class="avatar" [style.background]="user.color">{{ user.initials }}</div>
                  <div>
                    <strong>{{ user.name }}</strong>
                    <span class="user-email-sm">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td>{{ user.email }}...</td>
              <td>
                <span class="role-badge" [class.instructor]="user.role === 'instructor'">
                  📋 {{ user.role === 'student' ? 'Học viên' : 'Giảng viên' }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class.active]="user.status === 'active'">
                  <span class="status-dot" [class.active]="user.status === 'active'" [class.inactive]="user.status === 'inactive'"></span>
                  {{ user.status === 'active' ? 'Hoạt động' : 'Vô hiệu' }}
                </span>
              </td>
              <td>{{ user.joinDate }}</td>
              <td><span class="course-count primary">{{ user.coursesCount }}</span></td>
              <td>
                <button class="btn btn-outline btn-sm">📝 Sửa</button>
                <button class="icon-del" [class.restore]="user.status === 'inactive'">
                  {{ user.status === 'active' ? '✕' : '✓' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 16px; }
    .filter-row { display: flex; gap: 12px; margin-bottom: 16px; }
    .filter-select {
      padding: 10px 14px; border: 1px solid var(--gray-300);
      border-radius: var(--radius-sm); font-size: 13px; background: var(--white);
      cursor: pointer; white-space: nowrap;
    }
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
      color: var(--white); font-weight: 700; font-size: 12px;
    }
    .user-email-sm { font-size: 11px; color: var(--gray-400); display: block; }
    .role-badge {
      padding: 4px 10px; border-radius: 4px; font-size: 12px;
      background: var(--primary-bg); color: var(--primary); font-weight: 500;
    }
    .role-badge.instructor { background: #E8F5E9; color: var(--success); }
    .status-badge { font-size: 13px; display: flex; align-items: center; }
    .course-count { font-weight: 700; color: var(--primary); }
    .icon-del {
      background: var(--danger-light); color: var(--danger);
      border-radius: 6px; width: 32px; height: 32px;
      display: inline-flex; align-items: center; justify-content: center;
      font-weight: 700; cursor: pointer; margin-left: 6px;
    }
    .icon-del.restore {
      background: var(--success-light); color: var(--success);
    }
  `]
})
export class AdminUsersComponent {
  constructor(public dataService: DataService) {}
}
