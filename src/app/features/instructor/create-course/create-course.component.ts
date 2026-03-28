import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorLayoutComponent } from '../../../layouts/instructor-layout/instructor-layout.component';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, InstructorLayoutComponent],
  template: `
    <app-instructor-layout>
      <h1>📝 Tạo khóa học mới</h1>
      <!-- Stepper -->
      <div class="stepper">
        <div class="step active"><span class="sn">1</span> Thông tin cơ bản</div>
        <div class="step-line"></div>
        <div class="step"><span class="sn">2</span> Nội dung</div>
        <div class="step-line"></div>
        <div class="step"><span class="sn">3</span> Giá & Xuất bản</div>
      </div>

      <div class="create-body">
        <!-- Form -->
        <div class="create-main">
          <div class="form-card card">
            <h3>Thông tin cơ bản</h3>
            <div class="form-group">
              <label>Tiêu đề khóa học *</label>
              <input type="text" class="form-input" placeholder="Ví dụ: Python cho người mới bắt đầu">
            </div>
            <div class="form-row">
              <div class="form-group"><label>Ngôn ngữ 📋</label><input type="text" class="form-input" value="Tiếng Việt"></div>
              <div class="form-group"><label>Cấp độ 📋</label><input type="text" class="form-input" value="Cơ bản"></div>
              <div class="form-group"><label>Danh mục 📋</label><input type="text" class="form-input" value="Lập trình"></div>
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea class="form-input" rows="3" placeholder="Mô tả những gì học viên sẽ học được..."></textarea>
            </div>
          </div>

          <div class="form-card card">
            <h3>📁 Media</h3>
            <div class="media-grid">
              <div class="upload-box">
                <span class="upload-icon">🖼️</span>
                <strong>Ảnh bìa</strong>
                <span class="upload-meta">750 x 422px • JPG, PNG</span>
                <button class="btn btn-primary btn-sm">↑ Tải lên</button>
              </div>
              <div class="upload-box">
                <span class="upload-icon">🎬</span>
                <strong>Video giới thiệu</strong>
                <span class="upload-meta">MP4 • Tối đa 1GB</span>
                <button class="btn btn-primary btn-sm">↑ Tải lên</button>
              </div>
            </div>
          </div>

          <div class="form-card card">
            <div class="section-header">
              <h3>📚 Nội dung khóa học</h3>
              <button class="btn btn-outline btn-sm">📝 Thêm chương</button>
            </div>
            <div class="chapter-item">
              <div class="ch-header">
                <strong>Chương 1: Giới thiệu</strong>
                <span>📝 Sửa • 🗑️</span>
              </div>
              <div class="lesson-sub">► Bài 1: Giới thiệu khóa học • 5 phút</div>
              <div class="lesson-sub">► Bài 2: Cài đặt môi trường • 10 phút</div>
            </div>
            <div class="chapter-item">
              <div class="ch-header">
                <strong>Chương 2: Cơ bản</strong>
                <span>📝 Sửa • 🗑️</span>
              </div>
              <div class="lesson-sub">► Bài 3: Biến & kiểu dữ liệu • 15 phút</div>
            </div>
            <button class="btn btn-outline btn-sm" style="margin-top:12px">📝 Thêm bài học</button>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="create-sidebar">
          <div class="publish-card card">
            <h3>📤 Xuất bản</h3>
            <div class="pub-status">
              <span>Trạng thái:</span>
              <span class="badge badge-danger">📝 Bản nháp</span>
            </div>
            <p class="pub-note">Khóa học sẽ được xét duyệt trong 1-3 ngày làm việc trước khi xuất bản.</p>

            <div class="form-group">
              <label>Giá khóa học *</label>
              <input type="text" class="form-input" placeholder="Giá gốc (VND) e.g. 299.000">
            </div>
            <div class="form-group">
              <input type="text" class="form-input" placeholder="Giá khuyến mãi (tùy chọn)">
            </div>
            <div class="form-group">
              <label>Danh mục *</label>
              <div class="cat-select">Lập trình 📋</div>
            </div>

            <div class="split-info">
              <h4>📊 Tỷ lệ doanh thu</h4>
              <span>Giảng viên: <strong class="success">70%</strong></span>
            </div>
          </div>

          <div class="checklist card">
            <h4>📋 Checklist trước khi xuất bản</h4>
            <div class="check-item done">✓ Tiêu đề đầy đủ</div>
            <div class="check-item done">✓ Mô tả chi tiết</div>
            <div class="check-item done">✓ Ảnh bìa đạt chuẩn</div>
            <div class="check-item">○ Video giới thiệu</div>
            <div class="check-item done">✓ Ít nhất 5 bài học</div>
            <div class="check-item">○ Giá được thiết lập</div>
          </div>
        </aside>
      </div>
    </app-instructor-layout>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 12px; }
    .stepper { display: flex; align-items: center; margin-bottom: 24px; }
    .step {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; color: var(--gray-400); font-weight: 500;
    }
    .step.active { color: var(--gray-800); font-weight: 700; }
    .sn {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700;
      background: var(--gray-200); color: var(--gray-500);
    }
    .step.active .sn { background: var(--primary); color: var(--white); }
    .step-line { flex: 1; height: 2px; background: var(--gray-200); margin: 0 16px; max-width: 100px; }

    .create-body { display: flex; gap: 20px; }
    .create-main { flex: 1; }
    .form-card { padding: 20px; margin-bottom: 16px; }
    .form-card h3 { font-size: 16px; margin-bottom: 16px; }
    .form-row { display: flex; gap: 12px; }
    .form-row .form-group { flex: 1; }
    .media-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .upload-box {
      border: 2px dashed var(--gray-300);
      border-radius: var(--radius-md);
      padding: 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .upload-icon { font-size: 32px; }
    .upload-meta { font-size: 12px; color: var(--gray-400); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .chapter-item {
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-sm);
      padding: 14px;
      margin-bottom: 10px;
    }
    .ch-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .ch-header span { font-size: 13px; color: var(--gray-400); cursor: pointer; }
    .lesson-sub { font-size: 13px; color: var(--gray-500); padding: 4px 0 4px 16px; }

    .create-sidebar { width: 300px; flex-shrink: 0; }
    .publish-card { padding: 20px; margin-bottom: 16px; }
    .publish-card h3 { font-size: 16px; margin-bottom: 12px; }
    .pub-status { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 14px; }
    .pub-note { font-size: 13px; color: var(--gray-500); margin-bottom: 16px; }
    .cat-select {
      padding: 10px 14px;
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-sm);
      font-size: 14px;
    }
    .split-info { margin-top: 16px; }
    .split-info h4 { font-size: 14px; margin-bottom: 6px; }
    .success { color: var(--success); }

    .checklist { padding: 16px; background: var(--primary-bg); border-color: transparent; }
    .checklist h4 { font-size: 14px; margin-bottom: 12px; color: var(--primary); }
    .check-item { font-size: 13px; padding: 3px 0; color: var(--gray-500); }
    .check-item.done { color: var(--success); }
  `]
})
export class CreateCourseComponent {}
