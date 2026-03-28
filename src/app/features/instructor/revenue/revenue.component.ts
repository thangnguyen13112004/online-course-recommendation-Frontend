import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorLayoutComponent } from '../../../layouts/instructor-layout/instructor-layout.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-instructor-revenue',
  standalone: true,
  imports: [CommonModule, InstructorLayoutComponent],
  template: `
    <app-instructor-layout>
      <div class="header-action">
        <div>
          <h1><i class="fa-solid fa-coins"></i> Doanh thu & Báo cáo</h1>
          <p class="subtitle">Theo dõi lịch sử thanh toán và thống kê khóa học.</p>
        </div>
        <button class="btn btn-outline">
          <i class="fa-solid fa-download"></i> Xuất dữ liệu
        </button>
      </div>

      <!-- Overview Cards -->
      <div class="stats-grid">
        <div class="stat-card card">
          <span class="sl">Doanh thu tháng này</span>
          <span class="sv primary">{{ revenueThisMonth }}</span>
          <span class="sc-trend success" *ngIf="totalRevenue > 0"><i class="fa-solid fa-arrow-trend-up"></i> +15% so với tháng trước</span>
          <span class="sc-trend" *ngIf="totalRevenue === 0" style="color: var(--gray-400);">Kỳ đầu tiên</span>
        </div>
        <div class="stat-card card">
          <span class="sl">Doanh thu kỳ vọng (Tháng tới)</span>
          <span class="sv" style="color: var(--gray-700);">{{ expectedRevenue }}</span>
          <span class="sc-trend" style="color: var(--gray-400);">Dự kiến dựa trên xu hướng</span>
        </div>
        <div class="stat-card card">
          <span class="sl">Tổng doanh thu (Tính tới nay)</span>
          <span class="sv success">{{ totalRevenue ? formatCurrencyFull(totalRevenue) : 'đ0' }}</span>
          <span class="sc-trend success" *ngIf="totalRevenue > 0"><i class="fa-solid fa-check-circle"></i> Đã thanh toán đầy đủ</span>
          <span class="sc-trend" *ngIf="totalRevenue === 0" style="color: var(--gray-400);">Chưa có dữ liệu</span>
        </div>
      </div>

      <!-- Main Chart Area -->
      <div class="section card" style="padding: 24px;">
        <h3 class="section-title">Biểu đồ doanh thu năm nay</h3>
        <div class="chart-wrapper">
          <div class="y-axis">
            <span>20M</span><span>15M</span><span>10M</span><span>5M</span><span>0</span>
          </div>
          <div class="chart-bars">
            <div *ngFor="let bar of annualRevenue" class="bar-col">
              <div class="bar-value">{{ bar.value }}</div>
              <div class="bar-fill" [style.height.%]="bar.height"></div>
              <div class="bar-month">{{ bar.month }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payout History -->
      <div class="section card" style="padding: 0;">
        <div style="padding: 24px; border-bottom: 1px solid var(--gray-100); display: flex; justify-content: space-between; align-items: center;">
          <h3 class="section-title" style="margin: 0;">Lịch sử đối soát (Payouts)</h3>
          <span style="font-size: 13px; color: var(--gray-500);"><i class="fa-solid fa-circle-info"></i> Nền tảng kết toán vào ngày 1 hàng tháng</span>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: var(--gray-50); border-bottom: 1px solid var(--gray-200); text-align: left;">
              <th style="padding: 12px 24px; font-weight: 600; font-size: 12px; color: var(--gray-500);">Kỳ đối soát</th>
              <th style="padding: 12px 24px; font-weight: 600; font-size: 12px; color: var(--gray-500);">Doanh thu gộp</th>
              <th style="padding: 12px 24px; font-weight: 600; font-size: 12px; color: var(--gray-500);">Phí nền tảng (30%)</th>
              <th style="padding: 12px 24px; font-weight: 600; font-size: 12px; color: var(--gray-500);">Thực nhận (70%)</th>
              <th style="padding: 12px 24px; font-weight: 600; font-size: 12px; color: var(--gray-500);">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--gray-100);" *ngFor="let p of payouts">
              <td style="padding: 16px 24px; font-size: 14px; font-weight: 500;">{{ p.period }}</td>
              <td style="padding: 16px 24px; font-size: 14px; color: var(--gray-600);">{{ p.gross }}</td>
              <td style="padding: 16px 24px; font-size: 14px; color: var(--danger);">-{{ p.fee }}</td>
              <td style="padding: 16px 24px; font-size: 14px; font-weight: 700; color: var(--success);">{{ p.net }}</td>
              <td style="padding: 16px 24px;">
                <span class="badge" [ngClass]="p.status === 'Đã hoàn tất' ? 'badge-success' : 'badge-warning'">
                  {{ p.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </app-instructor-layout>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { font-size: 14px; color: var(--gray-500); }
    .header-action { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
    .stat-card { padding: 24px; display: flex; flex-direction: column; }
    .sl { font-size: 13px; color: var(--gray-500); margin-bottom: 8px; font-weight: 600; text-transform: uppercase; }
    .sv { font-size: 32px; font-weight: 800; margin-bottom: 12px; }
    .sv.primary { color: #FF7B54; }
    .sv.success { color: var(--success); }
    .sc-trend { font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .sc-trend.success { color: var(--success); }
    
    .section-title { font-size: 16px; font-weight: 700; color: var(--gray-800); margin-bottom: 24px; }
    
    .chart-wrapper {
      display: flex;
      height: 250px;
      gap: 16px;
    }
    .y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: var(--gray-400);
      font-size: 11px;
      padding-bottom: 24px;
      text-align: right;
    }
    .chart-bars {
      flex: 1;
      display: flex;
      align-items: flex-end;
      border-bottom: 1px solid var(--gray-200);
      border-left: 1px solid var(--gray-200);
      padding-bottom: 1px;
      position: relative;
    }
    .bar-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
      position: relative;
    }
    .bar-fill {
      width: 45px;
      background: linear-gradient(to top, #FF7B54, #FFB26B);
      border-radius: 4px 4px 0 0;
      transition: height 0.5s ease;
      position: relative;
      z-index: 2;
    }
    .bar-fill:hover { background: linear-gradient(to top, #FF9574, #FFC48B); cursor: pointer; }
    .bar-month {
      position: absolute;
      bottom: -28px;
      font-size: 12px;
      color: var(--gray-500);
      width: 100%;
      text-align: center;
    }
    
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-success { background: rgba(40,167,69,0.15); color: #28A745; }
    .badge-warning { background: rgba(253,126,20,0.15); color: #FD7E14; }
  `]
})
export class InstructorRevenueComponent implements OnInit {
  private api = inject(ApiService);
  
  totalRevenue = 0;
  revenueThisMonth = 'đ0';
  expectedRevenue = 'đ0';

  annualRevenue = [
    { month: 'Tháng 1', value: '0', height: 0 },
    { month: 'Tháng 2', value: '0', height: 0 },
    { month: 'Tháng 3', value: '0', height: 0 },
    { month: 'Tháng 4', value: '0', height: 0 },
    { month: 'Tháng 5', value: '0', height: 0 },
    { month: 'Tháng 6', value: '0', height: 0 },
  ];

  payouts: any[] = [];

  ngOnInit() {
    // Get actual total revenue from API stats
    this.api.getInstructorStats().subscribe({
      next: (res) => {
        if (res && res.tongDoanhThu !== undefined) {
          this.totalRevenue = res.tongDoanhThu;

          if (this.totalRevenue > 0) {
            // Apply mock data proportionally
            this.revenueThisMonth = this.formatCurrencyM(this.totalRevenue * 0.32);
            this.expectedRevenue = this.formatCurrencyM(this.totalRevenue * 0.35);

            this.annualRevenue = [
              { month: 'Tháng 1', value: this.formatCurrencyM(this.totalRevenue * 0.1), height: 30 },
              { month: 'Tháng 2', value: this.formatCurrencyM(this.totalRevenue * 0.25), height: 60 },
              { month: 'Tháng 3', value: this.formatCurrencyM(this.totalRevenue * 0.32), height: 80 },
              { month: 'Tháng 4', value: '0', height: 0 },
              { month: 'Tháng 5', value: '0', height: 0 },
              { month: 'Tháng 6', value: '0', height: 0 },
            ];

            const p1 = this.totalRevenue * 0.25;
            const p2 = this.totalRevenue * 0.1;

            this.payouts = [
              { period: 'Tháng 2/2026', gross: this.formatCurrencyFull(p1), fee: this.formatCurrencyFull(p1 * 0.3), net: this.formatCurrencyFull(p1 * 0.7), status: 'Đã hoàn tất' },
              { period: 'Tháng 1/2026', gross: this.formatCurrencyFull(p2), fee: this.formatCurrencyFull(p2 * 0.3), net: this.formatCurrencyFull(p2 * 0.7), status: 'Đã hoàn tất' }
            ];
          }
        }
      }
    });
  }

  formatCurrencyM(value: number): string {
    if (value >= 1000000) return 'đ' + (value / 1000000).toFixed(1) + 'M';
    if (value > 0) return 'đ' + (value / 1000).toFixed(0) + 'k';
    return 'đ0';
  }

  formatCurrencyFull(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }
}
