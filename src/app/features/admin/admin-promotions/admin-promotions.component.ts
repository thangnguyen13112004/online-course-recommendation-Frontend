import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../../layouts/admin-layout/admin-layout.component';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-admin-promotions',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="promo-header">
        <h1>📋 Quản lý mã giảm giá & khuyến mãi</h1>
        <button class="btn btn-primary">📝 Tạo mã mới</button>
      </div>

      <!-- Stats -->
      <div class="promo-stats">
        <div class="ps-item card"><span class="ps-val primary">5</span><span class="ps-lbl">Mã đang hoạt động</span></div>
        <div class="ps-item card"><span class="ps-val primary">1.892</span><span class="ps-lbl">Lượt sử dụng</span></div>
        <div class="ps-item card"><span class="ps-val success">đ48M</span><span class="ps-lbl">Tiết kiệm cho học viên</span></div>
      </div>

      <!-- Table -->
      <div class="table-wrapper card">
        <table>
          <thead>
            <tr>
              <th>Mã giảm giá</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Điều kiện</th>
              <th>Đã dùng</th>
              <th>Hết hạn</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let promo of dataService.promotions()">
              <td><strong class="promo-code">{{ promo.code }}</strong></td>
              <td>{{ promo.type === 'percent' ? 'Phần trăm' : 'Cố định' }}</td>
              <td>
                <span class="promo-value success">
                  {{ promo.type === 'percent' ? promo.value + '%' : (promo.value | number) + 'đ' }}
                </span>
              </td>
              <td>{{ promo.condition }}</td>
              <td>{{ promo.usedCount | number }} lần</td>
              <td><span [class.expired-date]="promo.status === 'expired'">{{ promo.expiryDate }}</span></td>
              <td>
                <span class="status-badge" [class.active]="promo.status === 'active'" [class.expired]="promo.status === 'expired'">
                  <span class="status-dot" [class.active]="promo.status === 'active'" [class.inactive]="promo.status === 'expired'"></span>
                  {{ promo.status === 'active' ? 'Đang hoạt động' : 'Hết hạn' }}
                </span>
              </td>
              <td>
                <button class="btn btn-outline btn-sm">📝 Sửa</button>
                <button class="icon-action">📋</button>
                <button class="icon-action">📊</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tip Banner -->
      <div class="tip-banner">
        📋 Tip: Sử dụng mã GIAM50 để giảm 50% cho đơn hàng từ 300.000đ. Áp dụng cho tất cả học viên đến 31/03/2026.
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .promo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h1 { font-size: 22px; }
    .promo-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
    .ps-item { padding: 20px; }
    .ps-val { font-size: 28px; font-weight: 800; display: block; }
    .ps-val.primary { color: var(--primary); }
    .ps-val.success { color: var(--success); }
    .ps-lbl { font-size: 13px; color: var(--gray-500); }
    .promo-code {
      font-family: monospace;
      font-size: 14px;
      background: var(--gray-100);
      padding: 4px 10px;
      border-radius: 4px;
    }
    .promo-value { font-weight: 800; }
    .promo-value.success { color: var(--success); }
    .status-badge { font-size: 13px; display: flex; align-items: center; }
    .expired-date { color: var(--danger); }
    .icon-action { background: none; font-size: 16px; padding: 4px 6px; cursor: pointer; }
    .tip-banner {
      margin-top: 20px;
      padding: 14px 20px;
      background: var(--primary-bg);
      border-radius: var(--radius-md);
      font-size: 13px;
      color: var(--primary);
      border: 1px solid var(--primary-light);
    }
  `]
})
export class AdminPromotionsComponent {
  constructor(public dataService: DataService) {}
}
