import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  template: `
    <app-header [isAuthenticated]="true" />
    <div class="container cart-page">
      <div class="cart-body">
        <!-- Cart Items -->
        <div class="cart-main">
          <h1>🛒 Giỏ hàng</h1>
          <p class="cart-count">{{ dataService.cartItems().length }} khóa học</p>

          <div *ngFor="let item of dataService.cartItems()" class="cart-item card">
            <div class="item-thumb">📦</div>
            <div class="item-info">
              <h3>{{ item.course.title }}</h3>
              <p>{{ item.course.instructor }}</p>
              <p class="item-meta">{{ item.course.hours }} giờ • {{ item.course.level }}</p>
              <div class="item-actions">
                <button class="action-link danger">🗑️ Xóa</button>
                <button class="action-link">♡ Lưu sau</button>
              </div>
            </div>
            <div class="item-price">
              <span class="price-current">{{ item.course.price | number }}đ</span>
              <span class="price-old">{{ item.course.originalPrice | number }}đ</span>
            </div>
          </div>

          <!-- AI Suggestion -->
          <div class="ai-suggest card">
            <div class="ai-suggest-header">
              <span>🤖 AI gợi ý thêm:</span>
            </div>
            <p>Dựa trên giỏ hàng, AI gợi ý Python Bootcamp — phù hợp 94% với lộ trình học của bạn</p>
            <button class="btn btn-outline btn-sm">+ Thêm vào giỏ</button>
          </div>
        </div>

        <!-- Order Summary -->
        <aside class="cart-sidebar">
          <div class="summary-card card">
            <h3>Tổng đơn hàng</h3>
            <div class="summary-items">
              <div class="summary-row" *ngFor="let item of dataService.cartItems()">
                <span>{{ item.course.title }}</span>
                <span>{{ item.course.price | number }}đ</span>
              </div>
            </div>

            <div class="coupon-row">
              <h4>Mã giảm giá</h4>
              <div class="coupon-input">
                <input type="text" class="form-input" placeholder="Nhập mã...">
                <button class="btn btn-outline btn-sm">Áp dụng</button>
              </div>
            </div>

            <div class="summary-total">
              <div class="total-row">
                <span>Tổng cộng</span>
                <span class="total-value">608.000đ</span>
              </div>
              <div class="total-row discount">
                <span>Giảm giá (10%)</span>
                <span>- 60.800đ</span>
              </div>
              <div class="total-row final">
                <span><strong>Thanh toán:</strong></span>
                <span class="final-value">547.200đ</span>
              </div>
            </div>

            <a routerLink="/checkout" class="btn btn-primary btn-lg" style="width:100%">🔒 Thanh toán ngay →</a>
            <p class="security-note">🔒 Bảo mật SSL • Hoàn tiền 30 ngày</p>
            <div class="payment-methods">
              <span>Chấp nhận thanh toán:</span>
              <div class="methods">
                <span class="method">💳 Thẻ</span>
                <span class="method">📱 MoMo</span>
                <span class="method">🏦 VNPay</span>
                <span class="method">💰 Zalo</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .cart-page { padding: 24px 0 60px; }
    .cart-page h1 { font-size: 22px; margin-bottom: 4px; }
    .cart-count { font-size: 14px; color: var(--gray-500); margin-bottom: 20px; }
    .cart-body { display: flex; gap: 24px; }
    .cart-main { flex: 1; }
    .cart-item {
      display: flex;
      gap: 16px;
      padding: 20px;
      margin-bottom: 12px;
    }
    .item-thumb {
      width: 80px; height: 80px;
      background: var(--primary-bg);
      border-radius: var(--radius-sm);
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; flex-shrink: 0;
    }
    .item-info { flex: 1; }
    .item-info h3 { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
    .item-info p { font-size: 13px; color: var(--gray-500); }
    .item-meta { font-size: 12px; color: var(--gray-400); }
    .item-actions {
      display: flex; gap: 16px; margin-top: 8px;
    }
    .action-link {
      background: none;
      font-size: 13px;
      color: var(--primary);
      cursor: pointer;
      padding: 0;
    }
    .action-link.danger { color: var(--danger); }
    .item-price { text-align: right; }
    .price-current {
      display: block;
      font-size: 18px;
      font-weight: 800;
      color: var(--primary);
    }
    .price-old {
      text-decoration: line-through;
      color: var(--gray-400);
      font-size: 13px;
    }
    .ai-suggest {
      padding: 16px;
      background: var(--primary-bg);
      border-color: var(--primary-light);
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .ai-suggest p { flex: 1; font-size: 13px; color: var(--gray-600); }

    .cart-sidebar { width: 380px; flex-shrink: 0; }
    .summary-card { padding: 24px; }
    .summary-card h3 { font-size: 18px; margin-bottom: 16px; }
    .summary-items { border-bottom: 1px solid var(--gray-200); padding-bottom: 12px; margin-bottom: 16px;}
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 4px 0;
      color: var(--gray-600);
    }
    .coupon-row { margin-bottom: 16px; }
    .coupon-row h4 { font-size: 14px; margin-bottom: 8px; }
    .coupon-input { display: flex; gap: 8px; }
    .coupon-input .form-input { flex: 1; }
    .summary-total {
      border-top: 1px solid var(--gray-200);
      padding-top: 12px;
      margin-bottom: 16px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 14px;
    }
    .total-value { font-weight: 700; color: var(--primary); font-size: 18px; }
    .discount span { color: var(--success); }
    .final { margin-top: 8px; }
    .final-value { font-size: 22px; font-weight: 800; color: var(--primary); }
    .security-note {
      text-align: center;
      font-size: 12px;
      color: var(--gray-400);
      margin: 12px 0;
    }
    .payment-methods { font-size: 12px; color: var(--gray-500); }
    .methods { display: flex; gap: 8px; margin-top: 6px; }
    .method {
      padding: 6px 12px;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-sm);
      font-size: 12px;
    }
  `]
})
export class CartComponent {
  constructor(public dataService: DataService) { }
}
