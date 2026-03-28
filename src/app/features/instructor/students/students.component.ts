import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorLayoutComponent } from '../../../layouts/instructor-layout/instructor-layout.component';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-instructor-students',
  standalone: true,
  imports: [CommonModule, InstructorLayoutComponent],
  template: `
    <app-instructor-layout>
      <h1>📚 Học viên của tôi</h1>
      <div class="filter-row">
        <span>Lọc theo khóa học:</span>
        <div class="filter-select">📚 Lập trình Python từ cơ bản 📋</div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card card"><span class="sv primary">450</span><span class="sl">Tổng học viên</span></div>
        <div class="stat-card card"><span class="sv success">75%</span><span class="sl">Hoàn thành TB</span></div>
        <div class="stat-card card"><span class="sv orange">4.8</span><span class="sl">Đánh giá TB</span></div>
      </div>

      <!-- Search -->
      <div class="search-row">
        <input type="text" class="form-input" placeholder="📝 Tìm học viên..." style="flex:1">
        <div class="filter-select">Tất cả trạng thái 📋</div>
      </div>

      <!-- Table -->
      <div class="table-wrapper card">
        <table>
          <thead>
            <tr>
              <th>Học viên</th>
              <th>Email</th>
              <th>Ngày đăng ký</th>
              <th>Tiến độ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let student of students">
              <td>
                <div class="student-cell">
                  <div class="avatar" [style.background]="student.color">{{ student.initials }}</div>
                  <div>
                    <strong>{{ student.name }}</strong>
                    <div class="stars-sm">★★★★★</div>
                  </div>
                </div>
              </td>
              <td>{{ student.email }}</td>
              <td>{{ student.date }}</td>
              <td>
                <div class="progress-cell">
                  <div class="progress-bar"><div class="fill" [style.width.%]="student.progress" [class.complete]="student.progress === 100"></div></div>
                  <span>{{ student.progress }}%</span>
                </div>
              </td>
              <td><span class="badge badge-primary">Đang học</span></td>
              <td>
                <button class="btn btn-outline btn-sm">📋 Xem</button>
                <button class="icon-action">📊</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </app-instructor-layout>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 12px; }
    .filter-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    .filter-select {
      padding: 8px 14px;
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-sm);
      font-size: 13px;
      background: var(--white);
      cursor: pointer;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }
    .stat-card { padding: 20px; }
    .sv { font-size: 28px; font-weight: 800; display: block; }
    .sv.primary { color: var(--primary); }
    .sv.success { color: var(--success); }
    .sv.orange { color: var(--orange); }
    .sl { font-size: 13px; color: var(--gray-500); }
    .search-row {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    .student-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: var(--white); font-weight: 700; font-size: 12px;
    }
    .stars-sm { color: var(--orange); font-size: 11px; }
    .progress-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 150px;
    }
    .progress-cell .progress-bar { flex: 1; }
    .progress-cell span { font-size: 13px; font-weight: 600; }
    .fill.complete { background: var(--success); }
    .icon-action {
      background: none;
      font-size: 16px;
      padding: 4px 8px;
      cursor: pointer;
    }
  `]
})
export class InstructorStudentsComponent {
  students = [
    { name: 'Nguyễn Ngọc Thắng', email: 'thang@email.com', date: '15/01/2025', progress: 75, initials: 'NT', color: '#5B63D3' },
    { name: 'Đoàn Duy Hiếu', email: 'hieu@email.com', date: '20/02/2025', progress: 100, initials: 'DH', color: '#FD7E14' },
    { name: 'Huỳnh Mộng Tuyền', email: 'tuyen@email.com', date: '01/03/2025', progress: 30, initials: 'HT', color: '#28A745' },
    { name: 'Trần Văn Bình', email: 'binh@email.com', date: '10/03/2025', progress: 15, initials: 'TV', color: '#17A2B8' },
    { name: 'Lê Thị Anh', email: 'anh@email.com', date: '12/03/2025', progress: 60, initials: 'LA', color: '#6F42C1' },
    { name: 'Phạm Minh', email: 'minh@email.com', date: '14/03/2025', progress: 45, initials: 'PM', color: '#DC3545' },
  ];
}
