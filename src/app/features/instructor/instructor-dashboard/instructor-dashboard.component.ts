import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InstructorLayoutComponent } from '../../../layouts/instructor-layout/instructor-layout.component';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, InstructorLayoutComponent],
  template: `
    <app-instructor-layout>
      <h1>📊 Tổng quan</h1>
      <p class="subtitle">Chào mừng trở lại, Nguyễn Tuấn! Đây là thống kê tháng này.</p>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card card">
          <div class="sc-body"><span class="sc-val primary">450</span><span class="sc-lbl">Tổng học viên</span><span class="sc-trend">▲ +32 tuần này</span></div>
          <span class="sc-icon">👥</span>
        </div>
        <div class="stat-card card">
          <div class="sc-body"><span class="sc-val success">đ13.45M</span><span class="sc-lbl">Doanh thu</span><span class="sc-trend">▲ +15%</span></div>
          <span class="sc-icon">💰</span>
        </div>
        <div class="stat-card card">
          <div class="sc-body"><span class="sc-val orange">4.8</span><span class="sc-lbl">Đánh giá TB</span><span class="sc-trend">▲ +0.1</span></div>
          <span class="sc-icon">⭐</span>
        </div>
        <div class="stat-card card">
          <div class="sc-body"><span class="sc-val primary">2</span><span class="sc-lbl">Khóa học</span><span class="sc-note">1 đang draft</span></div>
          <span class="sc-icon">📚</span>
        </div>
      </div>

      <!-- Courses Table -->
      <div class="section">
        <div class="section-header">
          <h2>📚 Khóa học của tôi</h2>
          <a routerLink="/instructor/courses/create" class="btn btn-primary btn-sm">📝 Tạo khóa mới</a>
        </div>
        <div class="table-wrapper card">
          <table>
            <thead>
              <tr>
                <th>Khóa học</th>
                <th>Trạng thái</th>
                <th>Học viên</th>
                <th>Doanh thu</th>
                <th>Đánh giá</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lập trình Python từ cơ bản đến nâng cao</td>
                <td><span class="badge badge-success">✓ Đã xuất bản</span></td>
                <td>450</td>
                <td>đ13.450.000</td>
                <td>⭐ 4.8</td>
                <td>
                  <button class="btn btn-outline btn-sm">📝 Sửa</button>
                  <button class="icon-action">📊</button>
                </td>
              </tr>
              <tr>
                <td>Python nâng cao & AI</td>
                <td><span class="badge badge-danger">📝 Bản nháp</span></td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>
                  <button class="btn btn-outline btn-sm">📝 Sửa</button>
                  <button class="icon-action">📊</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="section">
        <h2>📊 Doanh thu tháng này</h2>
        <div class="chart-area">
          <div class="chart-bars">
            <div *ngFor="let bar of revenueData" class="bar-wrapper">
              <span class="bar-label">{{ bar.value }}</span>
              <div class="bar" [style.height.%]="bar.height"></div>
              <span class="bar-month">{{ bar.month }}</span>
            </div>
          </div>
          <div class="revenue-split card">
            <h4>📊 Tỷ lệ doanh thu</h4>
            <div class="split-item">
              <span>Giảng viên nhận:</span>
              <span class="split-val success">70%</span>
            </div>
            <div class="split-item">
              <span>Nền tảng:</span>
              <span class="split-val">30%</span>
            </div>
            <p class="split-note">Thanh toán vào ngày 1 hàng tháng</p>
          </div>
        </div>
      </div>
    </app-instructor-layout>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { font-size: 14px; color: var(--gray-500); margin-bottom: 20px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .sc-body { display: flex; flex-direction: column; }
    .sc-val { font-size: 28px; font-weight: 800; }
    .sc-val.primary { color: var(--primary); }
    .sc-val.success { color: var(--success); }
    .sc-val.orange { color: var(--orange); }
    .sc-lbl { font-size: 13px; color: var(--gray-500); }
    .sc-trend { font-size: 12px; color: var(--success); margin-top: 4px; }
    .sc-note { font-size: 12px; color: var(--orange); margin-top: 4px; }
    .sc-icon { font-size: 28px; opacity: 0.4; }
    .section { margin-bottom: 24px; }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .section h2 { font-size: 18px; font-weight: 700; }
    .table-wrapper { overflow-x: auto; }
    .icon-action {
      background: none;
      font-size: 16px;
      padding: 4px 8px;
      cursor: pointer;
    }
    .chart-area {
      display: flex;
      gap: 20px;
    }
    .chart-bars {
      flex: 1;
      background: var(--white);
      border-radius: var(--radius-md);
      border: 1px solid var(--gray-200);
      padding: 20px;
      display: flex;
      align-items: flex-end;
      gap: 16px;
      height: 240px;
    }
    .bar-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
    }
    .bar-label { font-size: 11px; color: var(--gray-500); margin-bottom: 4px; }
    .bar {
      width: 40px;
      background: linear-gradient(to top, var(--primary), var(--primary-light));
      border-radius: 4px 4px 0 0;
      transition: height 0.5s ease;
    }
    .bar-month { font-size: 12px; color: var(--gray-500); margin-top: 6px; }
    .revenue-split {
      width: 280px;
      padding: 20px;
      background: var(--primary-bg);
      border-color: transparent;
    }
    .revenue-split h4 { font-size: 14px; margin-bottom: 12px; }
    .split-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
    }
    .split-val { font-weight: 800; font-size: 18px; }
    .split-val.success { color: var(--success); }
    .split-note { font-size: 12px; color: var(--gray-400); margin-top: 8px; }
  `]
})
export class InstructorDashboardComponent {
  revenueData = [
    { month: 'T1', value: '8M', height: 35 },
    { month: 'T2', value: '12M', height: 50 },
    { month: 'T3', value: '18M', height: 70 },
    { month: 'T4', value: '15M', height: 60 },
    { month: 'T5', value: '22M', height: 90 },
    { month: 'T6', value: '19M', height: 78 },
  ];
}
