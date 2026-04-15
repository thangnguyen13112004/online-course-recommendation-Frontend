import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../../layouts/admin-layout/admin-layout.component';
import { ApiService } from '../../../core/services/api.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent, PaginationComponent],
  template: `
    <app-admin-layout>
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-left">
          <h1>Thể loại khóa học</h1>
          <p class="page-subtitle">
            <i class="fa-regular fa-clock"></i>
            Quản lý {{ categories.length }} thể loại • <span class="live-dot"></span> Đang hoạt động
          </p>
        </div>
        <div class="page-header-right">
          <button class="header-action-btn primary" (click)="openAddModal()">
            <i class="fa-solid fa-plus"></i> Thêm thể loại mới
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="mini-stat">
          <div class="mini-stat-icon blue"><i class="fa-solid fa-folder-open"></i></div>
          <div class="mini-stat-content">
            <span class="mini-stat-value">{{ categories.length }}</span>
            <span class="mini-stat-label">Tổng thể loại</span>
          </div>
        </div>
        <div class="mini-stat">
          <div class="mini-stat-icon green"><i class="fa-solid fa-book-open"></i></div>
          <div class="mini-stat-content">
            <span class="mini-stat-value">{{ getTotalCourses() }}</span>
            <span class="mini-stat-label">Tổng khóa học</span>
          </div>
        </div>
      </div>

      <!-- Category Grid -->
      <div *ngIf="isLoading" style="padding: 100px; text-align: center; color: var(--gray-400);">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 32px; margin-bottom: 12px;"></i>
        <p>Đang tải dữ liệu từ máy chủ...</p>
      </div>

      <div class="category-grid" *ngIf="!isLoading">
        <div *ngIf="categories.length === 0" style="grid-column: 1/-1; padding: 60px; text-align: center; background: var(--white); border-radius: 16px; border: 1px dashed var(--gray-300); color: var(--gray-400);">
          Chưa có thể loại nào được tìm thấy.
        </div>
        <div *ngFor="let cat of categories; let i = index"
             class="category-card"
             [style.animation-delay]="(i * 0.06) + 's'">
          <div class="cat-card-header" [style.background]="cat.gradient">
            <div class="cat-icon-wrapper">
              <i [class]="cat.icon"></i>
            </div>
            <div class="cat-card-badge">{{ cat.courseCount }} khóa học</div>
          </div>
          <div class="cat-card-body">
            <h3>{{ cat.name }}</h3>
            <p class="cat-description">{{ cat.description }}</p>
          </div>
          <div class="cat-card-footer">
            <button class="cat-action edit" (click)="openEditModal(cat)" title="Sửa">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="cat-action delete" (click)="confirmDelete(cat)" title="Xóa">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <app-pagination 
        *ngIf="!isLoading"
        [currentPage]="currentCategoriesPage"
        [totalItems]="totalCategories"
        [pageSize]="12"
        (pageChange)="onPageChange($event)">
      </app-pagination>

      <!-- Add/Edit Category Modal -->
      <div class="modal-overlay" *ngIf="showAddModal" (click)="showAddModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <i [class]="editingCatId ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-wand-magic-sparkles'"></i>
              {{ editingCatId ? 'Chỉnh sửa thể loại' : 'Tạo thể loại mới' }}
            </h2>
            <button class="modal-close" (click)="showAddModal = false">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-split">
              <!-- Form Section -->
              <div class="modal-fields">
                <div class="form-group">
                  <label>Tên thể loại</label>
                  <input type="text" class="form-input" placeholder="Ví dụ: Thiết kế đồ họa..." [(ngModel)]="newCatName">
                </div>
                
                <div class="form-group">
                  <label>Mô tả ngắn</label>
                  <textarea class="form-input" placeholder="Tóm tắt về thể loại này..." [(ngModel)]="newCatDesc"></textarea>
                </div>

                <!-- Icon Picker -->
                <div class="form-group">
                  <label style="color: var(--primary); font-weight: 700;">Nhấn để chọn biểu tượng</label>
                  <div class="visual-picker icons-grid">
                    <button *ngFor="let icon of iconPresets" 
                            type="button"
                            class="picker-item icon-item" 
                            [class.active]="selectedIcon === icon.class"
                            (click)="selectedIcon = icon.class">
                      <i [class]="icon.class"></i>
                    </button>
                  </div>
                </div>

                <!-- Color Picker -->
                <div class="form-group">
                  <label style="color: var(--primary); font-weight: 700;">Nhấn để chọn màu sắc chủ đề</label>
                  <div class="visual-picker colors-row">
                    <button *ngFor="let color of colorPresets" 
                            type="button"
                            class="picker-item color-item" 
                            [class.active]="selectedGradient === color.value"
                            [style.background]="color.value"
                            (click)="selectedGradient = color.value">
                    </button>
                  </div>
                </div>
              </div>

              <!-- Preview Section -->
              <div class="live-preview-box">
                <span class="preview-label">Đây là hình ảnh thực tế sẽ hiển thị:</span>
                <div class="category-card preview-card">
                  <div class="cat-card-header" [style.background]="selectedGradient">
                    <div class="cat-icon-wrapper">
                      <i [class]="selectedIcon"></i>
                    </div>
                  </div>
                  <div class="cat-card-body">
                    <h3>{{ newCatName || 'Tên thể loại' }}</h3>
                    <p class="cat-description">{{ newCatDesc || 'Mô tả tóm tắt...' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn cancel" (click)="showAddModal = false">Hủy bỏ</button>
            <button class="modal-btn save" (click)="saveCategory()" [disabled]="isSaving">
              <i [class]="isSaving ? 'fa-solid fa-circle-notch fa-spin' : 'fa-solid fa-check-double'"></i>
              {{ isSaving ? 'Đang lưu...' : (editingCatId ? 'Cập nhật' : 'Lưu vào hệ thống') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirm Modal -->
      <div class="modal-overlay" *ngIf="showDeleteModal" (click)="showDeleteModal = false">
        <div class="modal-card delete-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2><i class="fa-solid fa-triangle-exclamation" style="color: #DC3545;"></i> Xác nhận xóa</h2>
            <button class="modal-close" (click)="showDeleteModal = false">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="modal-body" style="text-align: center; padding: 32px;">
            <p style="font-size: 16px; margin-bottom: 8px;">
              Bạn có chắc muốn xóa thể loại <strong>"{{ deletingCat?.name }}"</strong>?
            </p>
            <p style="color: var(--gray-400); font-size: 13px;">Hành động này không thể hoàn tác.</p>
          </div>
          <div class="modal-footer">
            <button class="modal-btn cancel" (click)="showDeleteModal = false">Hủy</button>
            <button class="modal-btn delete-btn" (click)="deleteCategory()" [disabled]="isSaving">
              <i [class]="isSaving ? 'fa-solid fa-circle-notch fa-spin' : 'fa-solid fa-trash'"></i>
              {{ isSaving ? 'Đang xóa...' : 'Xóa thể loại' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div class="toast" *ngIf="toastMessage" [class.error]="toastType === 'error'" (click)="toastMessage = ''">
        <i [class]="toastType === 'error' ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-check'"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    h1 { font-size: 26px; font-weight: 800; color: var(--gray-800); }
    .page-subtitle { font-size: 13px; color: var(--gray-500); display: flex; align-items: center; gap: 6px; }
    .live-dot { width: 7px; height: 7px; background: #28A745; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    
    .header-action-btn { 
      padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; border: none;
      background: linear-gradient(135deg, #5B63D3, #7B82E0); color: white;
      transition: all 0.2s ease;
    }
    .header-action-btn:hover { box-shadow: 0 4px 15px rgba(91,99,211,0.3); transform: translateY(-1px); }

    .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .mini-stat { background: white; padding: 20px; border-radius: 16px; border: 1px solid var(--gray-100); display: flex; align-items: center; gap: 15px; }
    .mini-stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    .mini-stat-icon.blue { background: rgba(91,99,211,0.1); color: #5B63D3; }
    .mini-stat-icon.green { background: rgba(40,167,69,0.1); color: #28A745; }
    .mini-stat-value { font-size: 24px; font-weight: 800; display: block; }
    .mini-stat-label { font-size: 13px; color: var(--gray-400); }

    .category-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .category-card { background: white; border-radius: 16px; border: 1px solid var(--gray-100); overflow: hidden; transition: 0.3s ease; }
    .category-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
    .cat-card-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; min-height: 80px; }
    .cat-icon-wrapper { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
    .cat-card-badge { background: rgba(255,255,255,0.2); color: white; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .cat-card-body { padding: 20px; }
    .cat-card-body h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
    .cat-description { font-size: 13px; color: var(--gray-500); line-height: 1.5; }
    .cat-card-footer { padding: 12px 20px; border-top: 1px solid var(--gray-50); display: flex; justify-content: flex-end; gap: 10px; }
    .cat-action { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; transition: 0.2s; }
    .cat-action.edit { background: rgba(91,99,211,0.06); color: #5B63D3; }
    .cat-action.edit:hover { background: #5B63D3; color: white; }
    .cat-action.delete { background: rgba(220,53,69,0.06); color: #DC3545; }
    .cat-action.delete:hover { background: #DC3545; color: white; }

    /* Modal Styles */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); z-index: 999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-card { background: white; border-radius: 24px; width: 800px; box-shadow: 0 30px 60px rgba(0,0,0,0.2); overflow: hidden; }
    .delete-modal { width: 480px; }
    .modal-header { padding: 24px; border-bottom: 1px solid var(--gray-50); display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { font-size: 20px; font-weight: 800; color: var(--gray-800); display: flex; align-items: center; gap: 10px; }
    .modal-close { background: var(--gray-50); border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; }
    .modal-body { padding: 32px; }
    .modal-split { display: grid; grid-template-columns: 1fr 300px; gap: 40px; }
    .form-group { margin-bottom: 24px; }
    .form-group label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 10px; color: var(--gray-700); }
    .form-input { width: 100%; padding: 14px; border: 2px solid var(--gray-100); border-radius: 12px; outline: none; transition: 0.3s; font-family: inherit; }
    .form-input:focus { border-color: var(--primary); background: white; }

    .visual-picker { display: flex; flex-wrap: wrap; gap: 10px; }
    .picker-item { 
      width: 44px; height: 44px; border-radius: 12px; border: 2px solid transparent; 
      cursor: pointer; display: flex; align-items: center; justify-content: center; 
      transition: 0.2s; font-size: 18px; color: var(--gray-400); background: var(--gray-50);
    }
    .picker-item:hover { transform: scale(1.1); }
    .picker-item.active { border-color: var(--primary); background: var(--primary); color: white; transform: scale(1.1); box-shadow: 0 4px 12px rgba(91,99,211,0.2); }
    .color-item.active { border-color: white; box-shadow: 0 0 0 3px var(--primary); }
    .icon-item.active { background: var(--primary); color: white; }

    .live-preview-box { background: var(--gray-50); padding: 24px; border-radius: 20px; border: 1px dashed var(--gray-200); }
    .preview-label { display: block; font-size: 12px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; margin-bottom: 20px; text-align: center; }
    .preview-card { background: white; pointer-events: none; transform: scale(1); }

    .modal-footer { padding: 20px 32px; background: var(--gray-50); display: flex; justify-content: flex-end; gap: 12px; }
    .modal-btn { padding: 12px 24px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
    .modal-btn.cancel { background: white; color: var(--gray-500); }
    .modal-btn.save { background: var(--primary); color: white; }
    .modal-btn.save:hover { background: var(--primary-dark); }
    .modal-btn.save:disabled { opacity: 0.6; cursor: not-allowed; }
    .modal-btn.delete-btn { background: #DC3545; color: white; }
    .modal-btn.delete-btn:hover { background: #C82333; }
    .modal-btn.delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    /* Toast */
    .toast {
      position: fixed; bottom: 32px; right: 32px;
      background: var(--gray-800); color: white;
      padding: 14px 24px; border-radius: 14px;
      display: flex; align-items: center; gap: 10px;
      font-size: 14px; font-weight: 600;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      animation: toastSlide 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      cursor: pointer; z-index: 1000;
    }
    .toast i { color: #28A745; font-size: 18px; }
    .toast.error { background: #DC3545; }
    .toast.error i { color: white; }
    @keyframes toastSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminCategoriesComponent implements OnInit {
  private api = inject(ApiService);

  categories: any[] = [];
  totalCategories = 0;
  currentCategoriesPage = 1;
  isLoading = false;
  isSaving = false;
  showAddModal = false;
  showDeleteModal = false;
  editingCatId: number | null = null;
  deletingCat: any = null;

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  // Form State
  newCatName = '';
  newCatDesc = '';
  selectedIcon = 'fa-solid fa-code';
  selectedGradient = 'linear-gradient(135deg, #5B63D3, #7B82E0)';

  iconPresets = [
    { class: 'fa-solid fa-code' },
    { class: 'fa-solid fa-brain' },
    { class: 'fa-solid fa-palette' },
    { class: 'fa-solid fa-database' },
    { class: 'fa-solid fa-mobile-screen' },
    { class: 'fa-solid fa-cloud' },
    { class: 'fa-solid fa-terminal' },
    { class: 'fa-solid fa-bolt' }
  ];

  colorPresets = [
    { value: 'linear-gradient(135deg, #5B63D3, #7B82E0)' },
    { value: 'linear-gradient(135deg, #28A745, #5BD67A)' },
    { value: 'linear-gradient(135deg, #FD7E14, #FDAA5E)' },
    { value: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
    { value: 'linear-gradient(135deg, #EC4899, #F472B6)' },
    { value: 'linear-gradient(135deg, #06B6D4, #22D3EE)' }
  ];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(page = 1) {
    this.isLoading = true;
    this.api.getCategories(page, 12).subscribe({
      next: (res) => {
        // Hỗ trợ cả response dạng mảng (nếu backend chưa restart) và dạng object phân trang
        const raw = Array.isArray(res) ? res : (res.data || []);
        this.totalCategories = res.totalCount || raw.length;
        this.currentCategoriesPage = res.page || page;
        
        this.categories = raw.map((c: any, i: number) => {
          let desc = c.moTa || c.MoTa || 'Thể loại khóa học trên hệ thống';
          let icon = this.iconPresets[i % this.iconPresets.length].class;
          let gradient = this.colorPresets[i % this.colorPresets.length].value;

          if (desc.includes('||')) {
            const parts = desc.split('||').map((p: string) => p.trim());
            desc = parts[0] || 'Thể loại khóa học trên hệ thống';
            parts.slice(1).forEach((p: string) => {
              if (p.startsWith('icon:')) icon = p.replace('icon:', '');
              if (p.startsWith('color:')) gradient = p.replace('color:', '');
            });
          }

          return {
            id: c.maTheLoai || c.MaTheLoai,
            name: c.ten || c.Ten,
            description: desc,
            courseCount: c.soKhoaHoc ?? c.SoKhoaHoc ?? 0,
            gradient: gradient,
            icon: icon,
            rawMoTa: c.moTa || c.MoTa
          };
        });
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onPageChange(page: number) {
    this.loadCategories(page);
  }

  openAddModal() {
    this.editingCatId = null;
    this.newCatName = '';
    this.newCatDesc = '';
    this.selectedIcon = this.iconPresets[0].class;
    this.selectedGradient = this.colorPresets[0].value;
    this.showAddModal = true;
  }

  openEditModal(cat: any) {
    this.editingCatId = cat.id;
    this.newCatName = cat.name;
    this.newCatDesc = cat.description;
    this.selectedIcon = cat.icon;
    this.selectedGradient = cat.gradient;
    this.showAddModal = true;
  }

  saveCategory() {
    if (!this.newCatName.trim()) {
      this.showToast('Vui lòng nhập tên thể loại', 'error');
      return;
    }

    this.isSaving = true;

    // Encode icon and color into description
    const descText = this.newCatDesc.trim() || 'Thể loại khóa học trên hệ thống';
    const metaStr = ` || icon:${this.selectedIcon} || color:${this.selectedGradient}`;

    const data = {
      ten: this.newCatName.trim(),
      moTa: descText + metaStr
    };

    if (this.editingCatId) {
      // Cập nhật
      this.api.updateCategory(this.editingCatId, data).subscribe({
        next: (res) => {
          this.showToast(res.message || 'Cập nhật thể loại thành công!');
          this.showAddModal = false;
          this.isSaving = false;
          this.loadCategories();
        },
        error: (err) => {
          this.showToast(err.error?.message || 'Lỗi khi cập nhật thể loại', 'error');
          this.isSaving = false;
        }
      });
    } else {
      // Tạo mới
      this.api.createCategory(data).subscribe({
        next: (res) => {
          this.showToast(res.message || 'Tạo thể loại thành công!');
          this.showAddModal = false;
          this.isSaving = false;
          this.loadCategories();
        },
        error: (err) => {
          this.showToast(err.error?.message || 'Lỗi khi tạo thể loại', 'error');
          this.isSaving = false;
        }
      });
    }
  }

  confirmDelete(cat: any) {
    this.deletingCat = cat;
    this.showDeleteModal = true;
  }

  deleteCategory() {
    if (!this.deletingCat) return;
    this.isSaving = true;

    this.api.deleteCategory(this.deletingCat.id).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Đã xóa thể loại thành công!');
        this.showDeleteModal = false;
        this.isSaving = false;
        this.deletingCat = null;
        this.loadCategories();
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Lỗi khi xóa thể loại', 'error');
        this.isSaving = false;
      }
    });
  }

  getTotalCourses() {
    return this.categories.reduce((total, c) => total + c.courseCount, 0);
  }

  private showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 4000);
  }
}
