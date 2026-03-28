import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../../core/models/models';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="course-card card">
      <div class="card-image" [class.dark-variant]="darkMode">
        <span class="card-emoji">{{ course.image }}</span>
        <span *ngIf="course.aiMatch" class="ai-badge badge-primary">
          🤖 AI {{ course.aiMatch }}%
        </span>
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ course.title }}</h3>
        <p class="card-instructor">{{ course.instructor }}</p>
        <div class="card-rating" *ngIf="showRating">
          <span class="stars">★★★★★</span>
          <span class="rating-text">{{ course.rating }} ({{ course.reviewCount }})</span>
        </div>
        <div class="card-price">
          <span class="price">{{ course.price | number }}đ</span>
          <span class="original-price">{{ course.originalPrice | number }}đ</span>
        </div>
        <button *ngIf="showCartBtn" class="btn btn-primary btn-sm cart-btn" (click)="$event.stopPropagation()">+ Giỏ hàng</button>
      </div>
    </div>
  `,
  styles: [`
    .course-card {
      cursor: pointer;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card-image {
      height: 160px;
      background: var(--primary-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .card-image.dark-variant {
      background: rgba(91, 99, 211, 0.15);
    }
    .card-emoji {
      font-size: 64px;
    }
    .ai-badge {
      position: absolute;
      bottom: 10px;
      left: 10px;
      font-size: 11px;
    }
    .card-body {
      padding: 14px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--gray-800);
      margin-bottom: 4px;
      line-height: 1.3;
    }
    .card-instructor {
      font-size: 13px;
      color: var(--gray-500);
      margin-bottom: 6px;
    }
    .card-rating {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }
    .stars {
      color: var(--orange);
      font-size: 12px;
    }
    .rating-text {
      font-size: 12px;
      color: var(--gray-500);
    }
    .card-price {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: auto;
    }
    .price {
      font-size: 17px;
      font-weight: 800;
      color: var(--primary);
    }
    .original-price {
      font-size: 13px;
      color: var(--gray-400);
      text-decoration: line-through;
    }
    .cart-btn {
      margin-top: 10px;
      width: 100%;
    }
  `]
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Input() showRating = true;
  @Input() showCartBtn = false;
  @Input() darkMode = false;
}
