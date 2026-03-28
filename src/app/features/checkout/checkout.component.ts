import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  template: `
    <app-header />
    <div class="container checkout-page">
      <a routerLink="/cart" class="back-link">← Quay lại giỏ hàng</a>

      <!-- Stepper -->
      <div class="stepper-header">
        <h1>🔒 Thanh toán</h1>
        <div class="stepper">
          <div class="step active"><span class="step-num">1</span> Phương thức</div>
          <div class="step-line"></div>
          <div class="step"><span class="step-num">2</span> Xác nhận</div>
          <div class="step-line"></div>
          <div class="step"><span class="step-num">3</span> Hoàn tất</div>
        </div>
      </div>

      <div class="checkout-body">
        <!-- Payment Methods -->
        <div class="checkout-main">
          <div class="payment-card card">
            <h3>Chọn phương thức thanh toán</h3>
            <div class="payment-methods">
              <label *ngFor="let method of paymentMethods" class="method-option" [class.active]="selectedMethod() === method.id" (click)="selectedMethod.set(method.id)">
                <span class="method-icon">{{ method.icon }}</span>
                <span class="method-name">{{ method.name }}</span>
                <span *ngIf="selectedMethod() === method.id" class="method-check">✓</span>
              </label>
            </div>

            <!-- Card Form -->
            <div *ngIf="selectedMethod() === 'card'" class="card-form">
              <h4>Thông tin thẻ</h4>
              <div class="form-group">
                <label>Số thẻ</label>
                <input type="text" class="form-input" placeholder="1234 5678 9012 3456">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Họ và tên trên thẻ</label>
                  <input type="text" class="form-input" placeholder="Nguyễn Văn A">
                </div>
                <div class="form-group">
                  <label>Ngày hết hạn</label>
                  <input type="text" class="form-input" placeholder="MM/YY">
                </div>
                <div class="form-group" style="max-width:100px">
                  <label>CVV</label>
                  <input type="text" class="form-input" placeholder="•••">
                </div>
              </div>
              <button class="btn btn-primary btn-lg" style="width:100%">→ Tiếp theo</button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <aside class="checkout-sidebar">
          <div class="order-card card">
            <h3>Đơn hàng của bạn</h3>
            <div class="order-item" *ngFor="let item of orderItems">
              <span class="oi-icon"><i class="fa-solid fa-box"></i></span>
              <div class="oi-info">
                <strong>{{ item.name }}</strong>
                <span>{{ item.instructor }}</span>
              </div>
              <span class="oi-price">{{ item.price }}</span>
            </div>

            <div class="order-totals">
              <div class="ot-row"><span>Tạm tính:</span><span>608.000đ</span></div>
              <div class="ot-row discount"><span>Giảm 10%:</span><span>- 60.800đ</span></div>
              <div class="ot-row final">
                <span><strong>Tổng thanh toán:</strong></span>
                <span class="final-price">547.200đ</span>
              </div>
            </div>

            <button class="btn btn-primary btn-lg" style="width:100%">🔒 Xác nhận & Thanh toán</button>
            <p class="terms">Bằng việc đặt hàng, bạn đồng ý với Điều khoản dịch vụ của chúng tôi</p>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { padding: 16px 0 60px; }
    .back-link { font-size: 13px; color: var(--gray-500); display: block; margin-bottom: 8px; }
    .stepper-header { margin-bottom: 24px; }
    .stepper-header h1 { font-size: 22px; margin-bottom: 12px; }
    .stepper {
      display: flex;
      align-items: center;
      gap: 0;
    }
    .step {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--gray-400);
      font-weight: 500;
    }
    .step.active { color: var(--gray-800); font-weight: 700; }
    .step-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      background: var(--gray-200);
      color: var(--gray-500);
    }
    .step.active .step-num {
      background: var(--primary);
      color: var(--white);
    }
    .step-line {
      flex: 1;
      height: 2px;
      background: var(--gray-200);
      margin: 0 16px;
      max-width: 120px;
    }
    .checkout-body { display: flex; gap: 24px; }
    .checkout-main { flex: 1; }
    .payment-card { padding: 24px; }
    .payment-card h3 { font-size: 16px; margin-bottom: 16px; }
    .method-option {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-sm);
      margin-bottom: 8px;
      cursor: pointer;
      transition: var(--transition);
    }
    .method-option.active {
      border-color: var(--primary);
      background: var(--primary-bg);
    }
    .method-icon { font-size: 20px; }
    .method-name { flex: 1; font-weight: 500; }
    .method-check { color: var(--primary); font-weight: 700; }
    .card-form { margin-top: 16px; }
    .card-form h4 { font-size: 15px; margin-bottom: 12px; }
    .form-row {
      display: flex;
      gap: 12px;
    }
    .form-row .form-group { flex: 1; }

    .checkout-sidebar { width: 400px; flex-shrink: 0; }
    .order-card { padding: 24px; }
    .order-card h3 { font-size: 16px; margin-bottom: 16px; }
    .order-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--gray-50);
      border-radius: var(--radius-sm);
      margin-bottom: 8px;
    }
    .oi-icon { font-size: 24px; }
    .oi-info { flex: 1; }
    .oi-info strong { display: block; font-size: 13px; }
    .oi-info span { font-size: 12px; color: var(--gray-500); }
    .oi-price { font-weight: 700; color: var(--primary); }
    .order-totals {
      border-top: 1px solid var(--gray-200);
      padding-top: 12px;
      margin: 16px 0;
    }
    .ot-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 14px;
    }
    .discount span { color: var(--success); }
    .final { margin-top: 8px; }
    .final-price { font-size: 22px; font-weight: 800; color: var(--primary); }
    .terms {
      text-align: center;
      font-size: 11px;
      color: var(--gray-400);
      margin-top: 12px;
    }
  `]
})
export class CheckoutComponent {
  selectedMethod = signal('card');

  paymentMethods = [
    { id: 'card', icon: '💳', name: 'Thẻ tín dụng / Ghi nợ' },
    { id: 'momo', icon: '📱', name: 'Ví MoMo' },
    { id: 'vnpay', icon: '🏦', name: 'VNPay / Internet Banking' },
    { id: 'zalo', icon: '💰', name: 'ZaloPay' },
  ];

  orderItems = [
    { name: 'React & TypeScript', instructor: 'Trần Thị Bích', price: '349.000đ' },
    { name: 'UI/UX Figma', instructor: 'Phạm Thanh Hà', price: '259.000đ' },
  ];
}
