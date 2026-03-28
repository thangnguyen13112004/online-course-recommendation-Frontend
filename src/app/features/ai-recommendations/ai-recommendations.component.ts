import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-ai-recommendations',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header />
    <div class="ai-page">
      <div class="container">
        <!-- Hero -->
        <div class="ai-hero">
          <span class="ai-badge-top">🤖 Powered by Content-Based Filtering + Collaborative Filtering</span>
          <h1>Khóa học được AI chọn<br><span class="highlight">riêng cho bạn</span></h1>
          <p class="ai-desc">Dựa trên lịch sử học tập, sở thích và hành vi người dùng tương tự bạn</p>
        </div>

        <!-- Top Picks -->
        <section class="ai-section">
          <h2>Dành riêng cho bạn — Độ phù hợp cao nhất</h2>
          <div class="ai-grid top-grid">
            <div *ngFor="let course of dataService.courses().slice(0, 3)" class="ai-card card">
              <div class="ai-card-image"><i class="fa-solid fa-box"></i></div>
              <span class="match-badge badge badge-primary">🤖 {{ course.aiMatch }}% phù hợp</span>
              <div class="ai-card-body">
                <h3>{{ course.title }}</h3>
                <p class="ai-instructor">{{ course.instructor }}</p>
                <div class="ai-reason" *ngIf="course.aiReason">💡 {{ course.aiReason }}</div>
                <div class="ai-card-footer">
                  <span class="ai-price">{{ course.price | number }}đ</span>
                  <button class="btn btn-outline btn-sm">+ Giỏ hàng</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Similar Users -->
        <section class="ai-section">
          <h2>Người học tương tự bạn cũng xem</h2>
          <div class="ai-grid bottom-grid">
            <div *ngFor="let course of dataService.courses().slice(4)" class="ai-card-sm card">
              <div class="ai-sm-image"><i class="fa-solid fa-box"></i></div>
              <div class="ai-sm-body">
                <h4>{{ course.title }}</h4>
                <span class="ai-price-sm">{{ course.price | number }}đ</span>
                <button class="btn btn-primary btn-sm" style="width:100%">+ Giỏ</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .ai-page {
      background: var(--dark-bg);
      min-height: 100vh;
      color: var(--white);
      padding-bottom: 60px;
    }
    .ai-hero {
      padding: 48px 0 32px;
    }
    .ai-badge-top {
      display: inline-block;
      background: rgba(91, 99, 211, 0.3);
      padding: 6px 18px;
      border-radius: 20px;
      font-size: 13px;
      margin-bottom: 20px;
    }
    .ai-hero h1 {
      font-size: 36px;
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 12px;
    }
    .highlight {
      color: var(--primary-light);
    }
    .ai-desc {
      font-size: 15px;
      opacity: 0.7;
    }
    .ai-section {
      margin-top: 36px;
    }
    .ai-section h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .top-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .ai-card {
      background: var(--dark-card);
      border-color: var(--dark-border);
      overflow: hidden;
      position: relative;
    }
    .ai-card:hover {
      border-color: var(--primary);
      box-shadow: 0 0 20px rgba(91, 99, 211, 0.2);
    }
    .ai-card-image {
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      background: rgba(91, 99, 211, 0.1);
    }
    .match-badge {
      position: absolute;
      top: 130px;
      left: 12px;
    }
    .ai-card-body {
      padding: 20px 16px 16px;
    }
    .ai-card-body h3 {
      font-size: 16px;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 4px;
    }
    .ai-instructor {
      font-size: 13px;
      color: var(--gray-400);
      margin-bottom: 10px;
    }
    .ai-reason {
      font-size: 12px;
      background: rgba(91, 99, 211, 0.15);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      color: var(--gray-300);
      margin-bottom: 12px;
    }
    .ai-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ai-price {
      font-size: 18px;
      font-weight: 800;
      color: var(--primary-light);
    }
    .bottom-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .ai-card-sm {
      background: var(--dark-card);
      border-color: var(--dark-border);
      overflow: hidden;
    }
    .ai-card-sm:hover {
      border-color: var(--primary);
    }
    .ai-sm-image {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      background: rgba(91, 99, 211, 0.1);
    }
    .ai-sm-body {
      padding: 12px;
    }
    .ai-sm-body h4 {
      font-size: 14px;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 6px;
    }
    .ai-price-sm {
      display: block;
      font-weight: 700;
      color: var(--primary-light);
      margin-bottom: 10px;
    }
  `]
})
export class AiRecommendationsComponent {
  constructor(public dataService: DataService) {}
}
