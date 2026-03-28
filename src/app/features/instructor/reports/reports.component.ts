import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe, DecimalPipe } from '@angular/common';
import { InstructorLayoutComponent } from '../../../layouts/instructor-layout/instructor-layout.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-instructor-reports',
  standalone: true,
  imports: [CommonModule, InstructorLayoutComponent],
  template: `
    <app-instructor-layout>
      <div class="header-action no-print">
        <div>
          <h1><i class="fa-solid fa-chart-column"></i> Báo cáo & Phân tích</h1>
          <p class="subtitle">Theo dõi sự tăng trưởng và hiệu suất các khóa học của bạn.</p>
        </div>
        <div class="actions">
          <button class="btn btn-outline btn-sm" (click)="exportPDF()"><i class="fa-solid fa-download"></i> Xuất PDF</button>
          
          <div class="dropdown-wrapper">
            <button class="btn btn-primary btn-sm" (click)="toggleDropdown()">
              <i class="fa-solid fa-calendar-days"></i> {{ selectedRange }}
              <i class="fa-solid fa-chevron-down" style="font-size: 10px; margin-left: 6px;"></i>
            </button>
            <div class="dropdown-menu card" *ngIf="isDropdownOpen">
              <div class="menu-item" *ngFor="let range of dateRanges" (click)="selectRange(range)">
                {{ range }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PDF Header (Only for Print) -->
      <div class="print-only-header">
         <h2>BÁO CÁO GIẢNG VIÊN - EDULEARN</h2>
         <p>Ngày xuất: {{ today | date:'dd/MM/yyyy HH:mm' }} • Phạm vi: {{ selectedRange }}</p>
         <hr>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card card">
          <div class="kpi-header">
            <span class="kpi-icon blue"><i class="fa-solid fa-users"></i></span>
            <span class="kpi-trend up">+12.5%</span>
          </div>
          <div class="kpi-body">
            <span class="kpi-val">{{ stats?.tongHocVien | number }}</span>
            <span class="kpi-lbl">Tổng học viên</span>
          </div>
        </div>
        <div class="kpi-card card">
          <div class="kpi-header">
            <span class="kpi-icon green"><i class="fa-solid fa-money-bill-trend-up"></i></span>
            <span class="kpi-trend up">+8.2%</span>
          </div>
          <div class="kpi-body">
            <span class="kpi-val">{{ formatCurrency(stats?.tongDoanhThu || 0) }}</span>
            <span class="kpi-lbl">Doanh thu tích lũy</span>
          </div>
        </div>
        <div class="kpi-card card">
          <div class="kpi-header">
            <span class="kpi-icon yellow"><i class="fa-solid fa-star"></i></span>
            <span class="kpi-trend down">-0.1</span>
          </div>
          <div class="kpi-body">
            <span class="kpi-val">{{ stats?.tbDanhGia | number:'1.1-1' }}</span>
            <span class="kpi-lbl">Xếp hạng trung bình</span>
          </div>
        </div>
        <div class="kpi-card card">
          <div class="kpi-header">
            <span class="kpi-icon purple"><i class="fa-solid fa-award"></i></span>
            <span class="kpi-trend up">+4</span>
          </div>
          <div class="kpi-body">
            <span class="kpi-val">{{ stats?.tongKhoaHoc }}</span>
            <span class="kpi-lbl">Khóa học đang dạy</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <div class="chart-container card main-chart">
          <div class="chart-header">
            <h3><i class="fa-solid fa-arrow-trend-up"></i> Tăng trưởng học viên</h3>
            <div class="chart-legend">
              <span class="dot Blue"></span> Học viên mới
            </div>
          </div>
          <div class="chart-content growth-chart">
            <div *ngFor="let item of growthData" class="growth-bar-wrapper">
              <div class="growth-bar" [style.height.%]="item.value"></div>
              <span class="month-label">{{ item.month }}</span>
            </div>
          </div>
        </div>

        <div class="chart-container card side-chart">
          <div class="chart-header">
            <h3><i class="fa-solid fa-pie-chart"></i> Phân bổ doanh thu</h3>
          </div>
          <div class="pie-placeholder">
             <div class="pie-ring">
               <div class="pie-center">
                 <strong>70%</strong>
                 <span>Lợi nhuận</span>
               </div>
             </div>
             <div class="pie-labels">
                <div class="p-item"><span class="dot success"></span> Giảng viên (70%)</div>
                <div class="p-item"><span class="dot gray"></span> Nền tảng (30%)</div>
             </div>
          </div>
        </div>
      </div>

      <!-- Course Performance -->
      <div class="performance-section">
        <div class="section-header">
          <h2><i class="fa-solid fa-list-check"></i> Hiệu suất khóa học</h2>
        </div>
        <div class="table-wrapper card">
          <table>
            <thead>
              <tr>
                <th>Khóa học</th>
                <th>Sức hút (Enroll)</th>
                <th>Doanh thu</th>
                <th>Đánh giá</th>
                <th>Xu hướng</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of courses">
                <td>
                  <div class="course-cell">
                    <strong>{{ c.tieuDe }}</strong>
                    <span>{{ c.theLoai }}</span>
                  </div>
                </td>
                <td>{{ c.soHocVien | number }}</td>
                <td>{{ formatCurrency(c.giaGoc || 0) }}</td>
                <td>
                  <div class="rating-cell">
                    <i class="fa-solid fa-star" style="color: #fccc29;"></i>
                    {{ c.tbdanhGia | number:'1.1-1' }}
                  </div>
                </td>
                <td>
                  <span class="trend-indicator up" *ngIf="c.soHocVien > 1">
                    <i class="fa-solid fa-arrow-up"></i> +{{ c.soHocVien * 0.1 | number:'1.0-0' }}%
                  </span>
                  <span class="trend-indicator side" *ngIf="c.soHocVien <= 1">
                     <i class="fa-solid fa-minus"></i> Ổn định
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-instructor-layout>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { font-size: 14px; color: var(--gray-500); }
    .header-action { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
    .actions { display: flex; gap: 10px; }

    /* Dropdown */
    .dropdown-wrapper { position: relative; }
    .dropdown-menu {
      position: absolute; top: 105%; right: 0; width: 180px; z-index: 100;
      padding: 8px; box-shadow: var(--shadow-lg); transition: all 0.2s ease;
    }
    .menu-item {
      padding: 10px 14px; font-size: 13px; color: var(--gray-700); cursor: pointer; border-radius: 8px;
    }
    .menu-item:hover { background: var(--gray-50); color: var(--primary); }

    /* Print Formatting */
    .print-only-header { display: none; text-align: center; margin-bottom: 30px; }
    .print-only-header hr { border: 0; height: 1px; background: #eee; margin-top: 20px; }

    @media print {
      .no-print, .instructor-sidebar, .instructor-topbar { display: none !important; }
      .instructor-main { margin-left: 0 !important; width: 100% !important; padding: 0 !important; }
      .instructor-layout { background: white !important; display: block !important; }
      .instructor-content { padding: 0 !important; }
      .print-only-header { display: block !important; }
      .card { border: 1px solid #eee !important; box-shadow: none !important; }
      .kpi-grid { gap: 10px !important; }
      .charts-row { grid-template-columns: 1fr !important; gap: 40px !important; } /* Stack charts vertically for print */
      .growth-bar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }

    /* KPI Cards */
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card { padding: 20px; border-radius: 16px; border: 1px solid var(--gray-200); }
    .kpi-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .kpi-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .kpi-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
    .kpi-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
    .kpi-icon.yellow { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
    .kpi-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }
    .kpi-trend { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 20px; }
    .kpi-trend.up { background: rgba(16, 185, 129, 0.1); color: #10B981; }
    .kpi-trend.down { background: rgba(220, 53, 69, 0.1); color: #DC3545; }
    .kpi-body { display: flex; flex-direction: column; }
    .kpi-val { font-size: 24px; font-weight: 800; color: var(--gray-800); }
    .kpi-lbl { font-size: 13px; color: var(--gray-500); margin-top: 2px; }

    /* Charts Row */
    .charts-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px; }
    .chart-container { padding: 24px; min-height: 350px; display: flex; flex-direction: column; }
    .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .chart-header h3 { font-size: 16px; font-weight: 700; }
    .chart-legend { font-size: 12px; color: var(--gray-500); display: flex; align-items: center; gap: 6px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.Blue { background: #3B82F6; }
    .dot.success { background: #10B981; }
    .dot.gray { background: var(--gray-300); }

    /* Growth Chart (Custom Visualization) */
    .growth-chart { flex: 1; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; padding: 0 10px; }
    .growth-bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 10px; height: 100%; justify-content: flex-end; }
    .growth-bar { width: 100%; max-width: 45px; background: linear-gradient(to top, #3B82F6, #60A5FA); border-radius: 6px 6px 0 0; transition: height 1s ease-out; position: relative; }
    .growth-bar:hover { filter: brightness(1.1); }
    .month-label { font-size: 11px; color: var(--gray-400); font-weight: 600; }

    /* Pie Placeholder */
    .pie-placeholder { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
    .pie-ring { width: 140px; height: 140px; border-radius: 50%; border: 15px solid #10B981; border-top-color: var(--gray-200); position: relative; display: flex; align-items: center; justify-content: center; }
    .pie-center { text-align: center; display: flex; flex-direction: column; }
    .pie-center strong { font-size: 20px; font-weight: 800; }
    .pie-center span { font-size: 11px; color: var(--gray-400); }
    .pie-labels { display: flex; flex-direction: column; gap: 8px; font-size: 13px; }
    .p-item { display: flex; align-items: center; gap: 8px; }

    /* Performance Section */
    .performance-section { margin-bottom: 30px; }
    .section-header { margin-bottom: 16px; }
    .section-header h2 { font-size: 18px; font-weight: 700; }
    .course-cell { display: flex; flex-direction: column; }
    .course-cell span { font-size: 11px; color: var(--gray-400); margin-top: 2px; }
    .rating-cell { display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--gray-700); }
    .trend-indicator { font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
    .trend-indicator.up { color: var(--success); }
    .trend-indicator.side { color: var(--gray-400); }

    .btn-sm { padding: 8px 16px; border-radius: 10px; }
  `]
})
export class InstructorReportsComponent implements OnInit {
  private api = inject(ApiService);

  stats: any = null;
  courses: any[] = [];
  isLoading = true;
  today = new Date();

  // Dropdown State
  isDropdownOpen = false;
  selectedRange = '30 ngày qua';
  dateRanges = ['7 ngày qua', '30 ngày qua', '90 ngày qua', 'Năm nay', 'Toàn thời gian'];

  growthData = [
    { month: 'T1', value: 30 },
    { month: 'T2', value: 45 },
    { month: 'T3', value: 40 },
    { month: 'T4', value: 65 },
    { month: 'T5', value: 85 },
    { month: 'T6', value: 75 },
    { month: 'T7', value: 95 },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // Fetch Stats
    this.api.getInstructorStats().subscribe(res => {
      this.stats = res;
    });

    // Fetch Courses
    this.api.getInstructorCourses().subscribe(res => {
      this.courses = res || [];
      this.isLoading = false;
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectRange(range: string) {
    this.selectedRange = range;
    this.isDropdownOpen = false;

    // Simulate data refresh on range change
    this.isLoading = true;
    setTimeout(() => {
      // Randomize growth data for demo
      this.growthData = this.growthData.map(d => ({
        ...d,
        value: Math.floor(Math.random() * 70) + 30
      }));
      this.isLoading = false;
    }, 600);
  }

  exportPDF() {
    window.print();
  }

  formatCurrency(value: number): string {
    if (value >= 1000000) {
      return 'đ' + (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return 'đ' + (value / 1000).toFixed(0) + 'k';
    }
    return 'đ' + value;
  }
}
