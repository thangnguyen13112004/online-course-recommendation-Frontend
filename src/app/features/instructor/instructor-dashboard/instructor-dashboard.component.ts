import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { InstructorLayoutComponent } from '../../../layouts/instructor-layout/instructor-layout.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, InstructorLayoutComponent],
  template: `
    <app-instructor-layout>
      <h1>Tổng quan</h1>
      <p class="subtitle">Chào mừng trở lại, {{ instructorName }}! Đây là thống kê của bạn.</p>

      <!-- Loading State -->
      <div *ngIf="isLoading" style="padding: 40px; text-align: center; color: var(--gray-400);">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 28px; margin-bottom: 8px; display: block;"></i>
        Đang tải dữ liệu từ hệ thống...
      </div>

      <ng-container *ngIf="!isLoading">
        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card card">
            <div class="sc-body">
              <span class="sc-val primary">{{ stats?.tongHocVien | number:'1.0-0' }}</span>
              <span class="sc-lbl">Tổng học viên</span>
            </div>
            <span class="sc-icon"><i class="fa-solid fa-users"></i></span>
          </div>
          <div class="stat-card card">
            <div class="sc-body">
              <span class="sc-val success" [title]="stats?.tongDoanhThu">{{ formatCurrencyM(stats?.tongDoanhThu || 0) }}</span>
              <span class="sc-lbl">Doanh thu</span>
            </div>
            <span class="sc-icon"><i class="fa-solid fa-coins"></i></span>
          </div>
          <div class="stat-card card">
            <div class="sc-body">
              <span class="sc-val orange">{{ stats?.tbDanhGia | number:'1.1-1' }}</span>
              <span class="sc-lbl">Đánh giá TB ({{ stats?.tongDanhGia }} lượt)</span>
            </div>
            <span class="sc-icon"><i class="fa-solid fa-star" style="color: #fccc29;"></i></span>
          </div>
          <div class="stat-card card">
            <div class="sc-body">
              <span class="sc-val primary">{{ stats?.tongKhoaHoc }}</span>
              <span class="sc-lbl">Khóa học</span>
              <span class="sc-note" *ngIf="draftCount > 0">{{ draftCount }} đang nháp</span>
            </div>
            <span class="sc-icon"><i class="fa-solid fa-book"></i></span>
          </div>
        </div>

        <!-- Courses Table -->
        <div class="section">
          <div class="section-header">
            <h2><i class="fa-solid fa-book"></i> Khóa học của tôi</h2>
            <a routerLink="/instructor/courses/create" class="btn btn-primary btn-sm"><i class="fa-solid fa-pen-to-square"></i> Tạo khóa mới</a>
          </div>
          <div class="table-wrapper card">
            <table>
              <thead>
                <tr>
                  <th>Khóa học</th>
                  <th>Trạng thái</th>
                  <th>Học viên</th>
                  <th>Giá gốc</th>
                  <th>Đánh giá</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let course of courses">
                  <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <div class="course-thumb" [style.background-image]="course.anhUrl ? 'url(' + course.anhUrl + ')' : ''" [class.no-img]="!course.anhUrl">
                        <i class="fa-solid fa-image" *ngIf="!course.anhUrl"></i>
                      </div>
                      <div>
                        <strong>{{ course.tieuDe }}</strong>
                        <div style="font-size: 11px; color: var(--gray-500); margin-top: 4px;">{{ course.theLoai }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getStatusClass(course.tinhTrang)">
                      {{ getStatusLabel(course.tinhTrang) }}
                    </span>
                  </td>
                  <td>{{ course.soHocVien | number }}</td>
                  <td>{{ (course.giaGoc) ? (course.giaGoc | currency:'VND':'symbol':'1.0-0') : 'Miễn phí' }}</td>
                  <td><i class="fa-solid fa-star" style="color: #fccc29;"></i> {{ course.tbdanhGia | number:'1.1-1' }}</td>
                  <td>
                    <button class="btn btn-outline btn-sm" (click)="editCourse(course.maKhoaHoc || course.id)">
                      <i class="fa-solid fa-pen-to-square"></i> Sửa
                    </button>
                    <button class="icon-action" title="Xem báo cáo chi tiết" (click)="viewReports()">📊</button>
                  </td>
                </tr>
                <tr *ngIf="courses.length === 0">
                  <td colspan="6" style="text-align: center; padding: 40px; color: var(--gray-400);">
                    Bạn chưa có khóa học nào. Hãy nhấp "Tạo khóa mới" để bắt đầu!
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
      </ng-container>
    </app-instructor-layout>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { font-size: 14px; color: var(--gray-500); margin-bottom: 20px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card { padding: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .sc-body { display: flex; flex-direction: column; }
    .sc-val { font-size: 28px; font-weight: 800; }
    .sc-val.primary { color: var(--primary); }
    .sc-val.success { color: var(--success); }
    .sc-val.orange { color: var(--orange); }
    .sc-lbl { font-size: 13px; color: var(--gray-500); }
    .sc-note { font-size: 12px; color: var(--orange); margin-top: 4px; }
    .sc-icon { font-size: 28px; opacity: 0.4; }
    
    .section { margin-bottom: 24px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .section h2 { font-size: 18px; font-weight: 700; }
    
    .badge { padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    .badge-success { background: rgba(40,167,69,0.15); color: #28A745; }
    .badge-warning { background: rgba(253,126,20,0.15); color: #FD7E14; }
    .badge-danger { background: rgba(220,53,69,0.15); color: #DC3545; }

    .table-wrapper { overflow-x: auto; }
    .course-thumb { width: 48px; height: 36px; border-radius: 6px; background-size: cover; background-position: center; border: 1px solid var(--gray-200); }
    .course-thumb.no-img { background: var(--gray-100); display: flex; align-items: center; justify-content: center; color: var(--gray-300); }

    .icon-action { background: none; font-size: 16px; padding: 4px 8px; cursor: pointer; border: none; }
    .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 6px; }

    .chart-area { display: flex; gap: 20px; }
    .chart-bars {
      flex: 1; background: var(--white); border-radius: var(--radius-md); border: 1px solid var(--gray-200);
      padding: 20px; display: flex; align-items: flex-end; gap: 16px; height: 240px;
    }
    .bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
    .bar-label { font-size: 11px; color: var(--gray-500); margin-bottom: 4px; }
    .bar { width: 40px; background: linear-gradient(to top, var(--primary), var(--primary-light)); border-radius: 4px 4px 0 0; transition: height 0.5s ease; }
    .bar-month { font-size: 12px; color: var(--gray-500); margin-top: 6px; }
    .revenue-split { width: 280px; padding: 20px; background: var(--primary-bg); border-color: transparent; }
    .revenue-split h4 { font-size: 14px; margin-bottom: 12px; }
    .split-item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .split-val { font-weight: 800; font-size: 18px; }
    .split-val.success { color: var(--success); }
    .split-note { font-size: 12px; color: var(--gray-400); margin-top: 8px; }
  `]
})
export class InstructorDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoading = true;
  stats: any = null;
  courses: any[] = [];
  draftCount = 0;
  instructorName = '';

  revenueData: any[] = [];

  ngOnInit() {
    // Get instructor name from Auth
    const currentUser = this.auth.currentUser();
    this.instructorName = currentUser?.userName || 'Giảng viên';

    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // Fetch Stats
    this.api.getInstructorStats().subscribe({
      next: (res) => this.stats = res,
      error: (err) => console.error('Failed to load stats', err)
    });

    // Fetch Revenue Series
    this.api.getRevenueSeries().subscribe({
      next: (res) => {
        const maxRev = Math.max(...res.map((r: any) => r.revenue)) || 1;
        this.revenueData = res.map((r: any) => ({
          month: r.month,
          value: r.revenue > 0 ? this.formatCurrencyM(r.revenue) : '0',
          height: r.revenue > 0 ? Math.max((r.revenue / maxRev) * 100, 5) : 0
        }));
      },
      error: (err) => console.error('Failed to load revenue series', err)
    });

    // Fetch Courses
    this.api.getInstructorCourses().subscribe({
      next: (res) => {
        this.courses = res || [];
        // Calculate draft count
        this.draftCount = this.courses.filter(c => c.tinhTrang === 'Draft').length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load courses', err);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Published': 'badge-success',
      'Draft': 'badge-warning',
      'Pending': 'badge-danger'
    };
    return map[status] || 'badge-warning';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'Published': '✓ Đã xuất bản',
      'Draft': '✎ Bản nháp',
      'Pending': '⌛ Chờ duyệt'
    };
    return map[status] || status;
  }

  formatCurrencyM(value: number): string {
    if (value >= 1000000) {
      return 'đ' + (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
      return 'đ' + (value / 1000).toFixed(0) + 'k';
    }
    return 'đ' + value;
  }

  editCourse(id: number) {
    if (!id) return;
    this.router.navigate(['/instructor/courses/edit', id]);
  }

  viewReports() {
    this.router.navigate(['/instructor/reports']);
  }
}
