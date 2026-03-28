import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorLayoutComponent } from '../../../layouts/instructor-layout/instructor-layout.component';
import { ApiService } from '../../../core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, FormsModule, InstructorLayoutComponent],
  template: `
    <app-instructor-layout>
      <h1>
        <i class="fa-solid" [class.fa-plus-circle]="!editId" [class.fa-pen-to-square]="editId"></i> 
        {{ editId ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới' }}
      </h1>

      <div *ngIf="isInitialLoading" style="padding: 100px; text-align: center; color: var(--gray-400);">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
        Đang tải thông tin khóa học...
      </div>

      <!-- Stepper -->
      <div class="stepper" *ngIf="!isInitialLoading">
        <div class="step active"><span class="sn">1</span> Thông tin cơ bản</div>
        <div class="step-line"></div>
        <div class="step"><span class="sn">2</span> Nội dung</div>
        <div class="step-line"></div>
        <div class="step"><span class="sn">3</span> Giá & Xuất bản</div>
      </div>

      <div class="create-body" *ngIf="!isInitialLoading">
        <!-- Form -->
        <div class="create-main">
          <div class="form-card card">
            <h3>Thông tin cơ bản</h3>
            <div class="form-group">
              <label>Tiêu đề khóa học *</label>
              <input type="text" class="form-control" [(ngModel)]="title" placeholder="Ví dụ: Python cho người mới bắt đầu">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Ngôn ngữ *</label>
                <select class="form-select" [(ngModel)]="selectedLang">
                  <option *ngFor="let lang of languages" [value]="lang">{{ lang }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Cấp độ *</label>
                <select class="form-select" [(ngModel)]="selectedLevel">
                  <option *ngFor="let lvl of levels" [value]="lvl">{{ lvl }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Danh mục *</label>
                <select class="form-select" [(ngModel)]="selectedCategory">
                  <option *ngFor="let cat of categories" [value]="cat.maTheLoai || cat.MaTheLoai">{{ cat.ten || cat.Ten }}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea class="form-control" rows="4" [(ngModel)]="description" placeholder="Mô tả những gì học viên sẽ học được..."></textarea>
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
              <h3><i class="fa-solid fa-book"></i> Nội dung khóa học</h3>
              <button class="btn btn-outline btn-sm"><i class="fa-solid fa-pen-to-square"></i> Thêm chương</button>
            </div>
            <p style="font-size:13px; color: var(--gray-400); margin-bottom: 12px;">Tính năng quản lý chương/bài học đang được cập nhật...</p>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="create-sidebar">
          <div class="publish-card card">
            <h3>📤 Xuất bản</h3>
            <div class="pub-status">
              <span>Trạng thái:</span>
              <span class="badge" [class.badge-success]="status === 'Published'" [class.badge-warning]="status === 'Draft'" [class.badge-danger]="status === 'Pending'">
                {{ getStatusLabel() }}
              </span>
            </div>
            
            <div class="form-group" style="margin-top: 16px;">
              <label>Giá khóa học *</label>
              <input type="number" class="form-control" [(ngModel)]="price" placeholder="Giá gốc (VND)">
            </div>
            
            <button class="btn btn-primary w-100" style="margin-top: 12px; height: 48px; font-size:16px;" (click)="saveCourse()" [disabled]="isSaving">
               <i class="fa-solid fa-circle-notch fa-spin" *ngIf="isSaving"></i>
               <i class="fa-solid fa-save" *ngIf="!isSaving"></i>
               {{ editId ? 'Cập nhật khóa học' : 'Tạo & Tiếp tục' }}
            </button>

            <div class="split-info">
              <h4>📊 Tỷ lệ doanh thu</h4>
              <span>Giảng viên: <strong class="success">70%</strong></span>
            </div>
          </div>

          <div class="checklist card">
            <h4><i class="fa-solid fa-clipboard-list"></i> Checklist</h4>
            <div class="check-item" [class.done]="title">✓ Tiêu đề đầy đủ</div>
            <div class="check-item" [class.done]="description">✓ Mô tả chi tiết</div>
            <div class="check-item done">✓ Ảnh bìa đạt chuẩn</div>
            <div class="check-item" [class.done]="price > 0">✓ Giá được thiết lập</div>
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
    
    .form-group { margin-bottom: 16px; position: relative; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px; }
    .form-control {
      width: 100%; padding: 10px 14px; border: 1px solid var(--gray-200); border-radius: var(--radius-sm);
      font-size: 14px; outline: none; transition: all 0.2s ease;
      font-family: inherit;
    }
    .form-control:focus { border-color: #FF7B54; box-shadow: 0 0 0 3px rgba(255,123,84,0.1); }
    .form-select {
      width: 100%; padding: 10px 32px 10px 14px; border: 1px solid var(--gray-200); border-radius: var(--radius-sm);
      font-size: 14px; background: var(--white); outline: none; cursor: pointer; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;
    }

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

    .create-sidebar { width: 300px; flex-shrink: 0; }
    .publish-card { padding: 20px; margin-bottom: 16px; }
    .publish-card h3 { font-size: 16px; margin-bottom: 12px; }
    .pub-status { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 14px; }
    .cat-select { padding: 10px 14px; border: 1px solid var(--gray-300); border-radius: var(--radius-sm); font-size: 14px; }
    .split-info { margin-top: 16px; }
    .split-info h4 { font-size: 14px; margin-bottom: 6px; }
    .success { color: var(--success); }

    .checklist { padding: 16px; background: var(--primary-bg); border-color: transparent; }
    .checklist h4 { font-size: 14px; margin-bottom: 12px; color: var(--primary); }
    .check-item { font-size: 13px; padding: 3px 0; color: var(--gray-400); }
    .check-item.done { color: var(--success); }
  `]
})
export class CreateCourseComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories: any[] = [];
  editId: string | null = null;
  isInitialLoading = false;
  isSaving = false;

  // Form Fields
  title = '';
  description = '';
  price = 0;
  selectedCategory = '';
  selectedLang = 'Tiếng Việt';
  selectedLevel = 'Tất cả cấp độ';
  status = 'Draft';

  // Static options
  languages = ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Nhật', 'Tiếng Hàn', 'Song ngữ (Việt - Anh)'];
  levels = ['Tất cả cấp độ', 'Cơ bản (Cho người mới)', 'Trung bình', 'Nâng cao', 'Chuyên gia'];

  ngOnInit() {
    this.editId = this.route.snapshot.paramMap.get('id');
    
    // Load categories first
    this.api.getCategories().subscribe(res => {
      this.categories = res || [];
      if (!this.editId && this.categories.length > 0) {
        this.selectedCategory = this.categories[0].maTheLoai || this.categories[0].MaTheLoai;
      }
    });

    if (this.editId) {
      this.loadCourseData(Number(this.editId));
    }
  }

  loadCourseData(id: number) {
    this.isInitialLoading = true;
    this.api.getCourseById(id).subscribe({
      next: (res) => {
        // Many APIs return data wrapped in 'data' field
        const course = res.data || res;
        if (course) {
          this.title = course.tieuDe || course.TieuDe || '';
          this.description = course.moTa || course.MoTa || '';
          this.price = course.giaGoc || course.GiaGoc || 0;
          this.selectedCategory = course.maTheLoai || course.MaTheLoai || '';
          this.status = course.tinhTrang || course.TinhTrang || 'Draft';
        }
        this.isInitialLoading = false;
      },
      error: () => {
        this.isInitialLoading = false;
        Swal.fire('Lỗi', 'Không thể tải thông tin khóa học.', 'error');
        this.router.navigate(['/instructor/courses']);
      }
    });
  }

  getStatusLabel(): string {
    const map: Record<string, string> = {
      'Published': 'Đã xuất bản',
      'Draft': 'Bản nháp',
      'Pending': 'Chờ duyệt'
    };
    return map[this.status] || 'Bản nháp';
  }

  saveCourse() {
    if (!this.title) {
      Swal.fire('Thông báo', 'Vui lòng nhập tiêu đề khóa học', 'warning');
      return;
    }

    this.isSaving = true;
    const data = {
      tieuDe: this.title,
      moTa: this.description,
      giaGoc: this.price,
      maTheLoai: Number(this.selectedCategory),
      ngonNgu: this.selectedLang,
      capDo: this.selectedLevel
    };

    const request = this.editId 
      ? this.api.updateCourse(Number(this.editId), data)
      : this.api.createCourse(data);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire('Thành công', this.editId ? 'Đã cập nhật khóa học' : 'Đã tạo khóa học mới', 'success');
        this.router.navigate(['/instructor/courses']);
      },
      error: (err) => {
        this.isSaving = false;
        Swal.fire('Lỗi', err.error?.message || 'Có lỗi xảy ra khi lưu khóa học', 'error');
      }
    });
  }
}

