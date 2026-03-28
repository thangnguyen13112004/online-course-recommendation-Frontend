import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../../layouts/admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <h1>📊 Tổng quan hệ thống</h1>
      <p class="subtitle">Cập nhật lần cuối: 18/03/2026 • Thời gian thực</p>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat card"><div class="sc"><span class="sv primary">1.240</span><span class="sl">Tổng học viên</span><span class="st">▲ +48 tuần này</span></div><span class="si">👥</span></div>
        <div class="stat card"><div class="sc"><span class="sv primary">86</span><span class="sl">Giảng viên</span><span class="st">▲ +3</span></div><span class="si">👨‍🏫</span></div>
        <div class="stat card"><div class="sc"><span class="sv orange">324</span><span class="sl">Khóa học</span><span class="st">+12</span></div><span class="si">📚</span></div>
        <div class="stat card"><div class="sc"><span class="sv success">đ184M</span><span class="sl">Doanh thu tháng</span><span class="st">▲ +22%</span></div><span class="si">💰</span></div>
      </div>

      <div class="two-col">
        <!-- Pending Approvals -->
        <div class="col-left">
          <div class="section-header"><h2>📋 Khóa học chờ duyệt</h2><a class="see-all">Xem tất cả →</a></div>
          <div *ngFor="let item of pendingCourses" class="pending-item card">
            <div class="pi-info">
              <strong>{{ item.name }}</strong>
              <span>{{ item.instructor }} • {{ item.category }} • {{ item.price }} • {{ item.date }}</span>
            </div>
            <div class="pi-actions">
              <button class="btn btn-success btn-sm">✓ Duyệt</button>
              <button class="btn btn-danger btn-sm">✕ Từ chối</button>
              <button class="btn btn-outline btn-sm">📋 Xem</button>
            </div>
          </div>
          <p class="pending-count">{{ pendingCourses.length }} khóa học đang chờ duyệt</p>
        </div>

        <!-- New Instructors -->
        <div class="col-right">
          <h2>👨‍🏫 Giảng viên mới đăng ký</h2>
          <div *ngFor="let inst of newInstructors" class="inst-item card">
            <div class="avatar" [style.background]="inst.color">{{ inst.initials }}</div>
            <div class="inst-info">
              <strong>{{ inst.name }}</strong>
              <span>{{ inst.email }} • {{ inst.date }}</span>
            </div>
            <button class="btn btn-success btn-sm">✓ Duyệt</button>
            <button class="icon-del">✕</button>
          </div>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="section">
        <h2>📊 Doanh thu theo tháng</h2>
        <div class="chart-container card">
          <div class="chart-bars">
            <div *ngFor="let bar of revenueData" class="bar-wrapper">
              <span class="bar-label">{{ bar.value }}</span>
              <div class="bar" [style.height.%]="bar.height"></div>
              <span class="bar-month">{{ bar.month }}</span>
            </div>
          </div>
        </div>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: var(--gray-500); margin-bottom: 20px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat { padding: 20px; display: flex; justify-content: space-between; }
    .sc { display: flex; flex-direction: column; }
    .sv { font-size: 28px; font-weight: 800; }
    .sv.primary { color: var(--primary); }
    .sv.success { color: var(--success); }
    .sv.orange { color: var(--orange); }
    .sl { font-size: 13px; color: var(--gray-500); }
    .st { font-size: 12px; color: var(--success); margin-top: 4px; }
    .si { font-size: 28px; opacity: 0.4; }
    .two-col { display: flex; gap: 20px; margin-bottom: 24px; }
    .col-left { flex: 1; }
    .col-right { width: 380px; flex-shrink: 0; }
    .col-right h2 { font-size: 16px; margin-bottom: 12px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .section-header h2 { font-size: 16px; }
    .see-all { font-size: 13px; color: var(--primary); }
    .pending-item { padding: 14px; margin-bottom: 8px; }
    .pi-info { margin-bottom: 10px; }
    .pi-info strong { display: block; font-size: 14px; }
    .pi-info span { font-size: 12px; color: var(--gray-500); }
    .pi-actions { display: flex; gap: 8px; }
    .pending-count { font-size: 12px; color: var(--gray-500); margin-top: 8px; }
    .inst-item { padding: 12px; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--white); font-weight: 700; font-size: 12px; }
    .inst-info { flex: 1; }
    .inst-info strong { display: block; font-size: 13px; }
    .inst-info span { font-size: 12px; color: var(--gray-500); }
    .icon-del { background: var(--danger-light); color: var(--danger); border-radius: 6px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 18px; margin-bottom: 12px; }
    .chart-container { padding: 20px; }
    .chart-bars { display: flex; align-items: flex-end; gap: 12px; height: 220px; }
    .bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
    .bar-label { font-size: 11px; color: var(--gray-500); margin-bottom: 4px; }
    .bar { width: 100%; max-width: 60px; background: linear-gradient(to top, var(--primary), var(--primary-light)); border-radius: 4px 4px 0 0; }
    .bar-month { font-size: 12px; color: var(--gray-500); margin-top: 6px; }
  `]
})
export class AdminDashboardComponent {
  pendingCourses = [
    { name: 'Advanced React Patterns', instructor: 'Trần Văn B', category: 'Frontend', price: '399.000đ', date: '14/03' },
    { name: 'Docker cho DevOps', instructor: 'Lê Minh C', category: 'DevOps', price: '499.000đ', date: '13/03' },
    { name: 'Python ML Advanced', instructor: 'Nguyễn Đức D', category: 'AI/ML', price: '549.000đ', date: '12/03' },
  ];

  newInstructors = [
    { name: 'Phạm Văn E', email: 'e@email.com', date: '15/03/2026', initials: 'PE', color: '#28A745' },
    { name: 'Hoàng Thị F', email: 'f@email.com', date: '14/03/2026', initials: 'HF', color: '#5B63D3' },
    { name: 'Nguyễn G', email: 'g@email.com', date: '13/03/2026', initials: 'NG', color: '#FD7E14' },
  ];

  revenueData = [
    { month: 'T7', value: 'đ120M', height: 55 },
    { month: 'T8', value: 'đ145M', height: 65 },
    { month: 'T9', value: 'đ132M', height: 60 },
    { month: 'T10', value: 'đ168M', height: 78 },
    { month: 'T11', value: 'đ155M', height: 72 },
    { month: 'T12', value: 'đ195M', height: 92 },
    { month: 'T1', value: 'đ142M', height: 66 },
    { month: 'T2', value: 'đ175M', height: 82 },
    { month: 'T3', value: 'đ184M', height: 86 },
  ];
}
