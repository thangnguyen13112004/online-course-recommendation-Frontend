import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../../layouts/admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-approvals',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <h1>📋 Duyệt nội dung khóa học</h1>
      <p class="subtitle">Xem xét và phê duyệt các khóa học mới từ giảng viên</p>

      <!-- Stats -->
      <div class="approval-stats">
        <div class="as-item card"><span class="as-val orange">3</span><span>Chờ duyệt</span></div>
        <div class="as-item card"><span class="as-val primary">18</span><span>Đã duyệt tháng này</span></div>
        <div class="as-item card"><span class="as-val danger">2</span><span>Từ chối</span></div>
      </div>

      <!-- Tabs -->
      <div class="approval-tabs">
        <button class="tab active">Chờ duyệt (3)</button>
        <button class="tab">Đã duyệt</button>
        <button class="tab">Từ chối</button>
      </div>

      <!-- Course Cards -->
      <div *ngFor="let course of pendingCourses" class="approval-card card">
        <div class="ac-thumb">📦</div>
        <div class="ac-content">
          <h3>{{ course.name }}</h3>
          <div class="ac-meta">
            👨‍🏫 {{ course.instructor }} • 📂 {{ course.category }} • ⭐ {{ course.rating }} • 📅 {{ course.date }}
          </div>
          <p class="ac-desc">{{ course.description }}</p>
          <div class="ac-details">
            <span class="detail-chip">💰 {{ course.price }}</span>
            <span class="detail-chip">📦 {{ course.modules }} mô-đun</span>
            <span class="detail-chip">⏱ {{ course.hours }} giờ</span>
            <span class="detail-chip">👁 Xem trước</span>
          </div>
          <div class="ac-actions">
            <button class="btn btn-success btn-sm">✓ Duyệt & Xuất bản</button>
            <button class="btn btn-danger btn-sm">✕ Từ chối</button>
            <button class="btn btn-outline btn-sm">📝 Ghi chú phản hồi</button>
            <button class="btn btn-outline btn-sm">📋 Xem chi tiết</button>
          </div>
        </div>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { font-size: 14px; color: var(--gray-500); margin-bottom: 20px; }
    .approval-stats { display: flex; gap: 16px; margin-bottom: 20px; }
    .as-item { padding: 16px 32px; display: flex; align-items: center; gap: 12px; }
    .as-val { font-size: 28px; font-weight: 800; }
    .as-val.orange { color: var(--orange); }
    .as-val.primary { color: var(--primary); }
    .as-val.danger { color: var(--danger); }

    .approval-tabs { display: flex; gap: 0; border-bottom: 2px solid var(--gray-200); margin-bottom: 20px; }
    .tab {
      padding: 10px 24px; background: none; font-size: 14px;
      font-weight: 600; color: var(--gray-400);
      border-bottom: 2px solid transparent; margin-bottom: -2px;
    }
    .tab.active { color: var(--primary); border-bottom-color: var(--primary); }

    .approval-card { padding: 20px; display: flex; gap: 20px; margin-bottom: 16px; }
    .ac-thumb {
      width: 120px; height: 120px; flex-shrink: 0;
      background: var(--primary-bg); border-radius: var(--radius-md);
      display: flex; align-items: center; justify-content: center;
      font-size: 48px;
    }
    .ac-content { flex: 1; }
    .ac-content h3 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
    .ac-meta { font-size: 13px; color: var(--gray-500); margin-bottom: 8px; }
    .ac-desc { font-size: 14px; color: var(--gray-600); margin-bottom: 12px; }
    .ac-details { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
    .detail-chip {
      padding: 6px 14px; background: var(--gray-100); border-radius: var(--radius-sm);
      font-size: 13px; color: var(--gray-600);
    }
    .ac-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  `]
})
export class AdminApprovalsComponent {
  pendingCourses = [
    { name: 'Advanced React Patterns', instructor: 'Trần Văn B', category: 'Frontend', rating: '4.9', date: '14/03/2026', description: 'Khóa học về các pattern nâng cao trong React bao gồm Hooks, Context, Performance...', price: '399.000đ', modules: 8, hours: 35 },
    { name: 'Docker cho DevOps', instructor: 'Lê Minh C', category: 'DevOps', rating: 'Mới', date: '13/03/2026', description: 'Từ cơ bản đến nâng cao về Docker và Kubernetes cho kỹ sư DevOps...', price: '499.000đ', modules: 8, hours: 35 },
    { name: 'Python ML Advanced', instructor: 'Nguyễn Đức D', category: 'AI/ML', rating: 'Mới', date: '12/03/2026', description: 'Các kỹ thuật ML nâng cao bao gồm Deep Learning, NLP, Computer Vision...', price: '549.000đ', modules: 8, hours: 35 },
  ];
}
