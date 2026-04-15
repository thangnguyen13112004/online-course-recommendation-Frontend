import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Course } from '../../../core/models/models';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="course-card card" (click)="goToDetail()">
      <div class="card-image" [class.dark-variant]="darkMode">
        <img *ngIf="course.image && course.image.length > 5" [src]="course.image" (error)="course.image = ''" alt="course" style="width: 100%; height: 100%; object-fit: cover;">
        <div *ngIf="!course.image || course.image.length <= 5" class="card-emoji" style="display:flex; justify-content:center; align-items:center; width:100%; height:100%"><i class="fa-solid fa-box" style="font-size: 32px"></i></div>
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
          <span class="original-price" *ngIf="course.price !== undefined && course.originalPrice !== undefined && course.originalPrice > course.price">{{ course.originalPrice | number }}đ</span>
        </div>
        <button *ngIf="showCartBtn" class="btn btn-primary btn-sm cart-btn" (click)="addToCart($event)">+ Giỏ hàng</button>
      </div>
    </div>
  `,
  styles: [`
    .course-card {
      cursor: pointer;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      background: white;
      border: 1px solid #f1f5f9;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      height: 100%;
    }
    .course-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
      border-color: #e2e8f0;
    }
    .card-image {
      height: 180px;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .card-image.dark-variant {
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    }
    .card-image img { 
      transition: transform 0.5s ease; 
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .course-card:hover .card-image img { transform: scale(1.05); }
    
    .card-emoji { font-size: 64px; }
    .ai-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      color: #eb4899;
      padding: 6px 12px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      z-index: 2;
    }
    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-instructor {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 12px;
      font-weight: 500;
    }
    .card-rating {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;
    }
    .stars { color: #f59e0b; font-size: 13px; letter-spacing: 2px;}
    .rating-text { font-size: 13px; color: #64748b; font-weight: 600;}
    
    .card-price {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
    }
    .price {
      font-size: 18px;
      font-weight: 800;
      color: #4f46e5;
    }
    .original-price {
      font-size: 14px;
      color: #94a3b8;
      text-decoration: line-through;
    }
    .cart-btn {
      margin-top: 16px;
      width: 100%;
      border-radius: 12px;
      padding: 10px;
      font-weight: 700;
      background: #f1f5f9;
      color: #4f46e5;
      border: none;
      transition: all 0.2s;
      cursor: pointer;
    }
    .cart-btn:hover {
      background: #4f46e5;
      color: white;
    }
  `]
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Input() showRating = true;
  @Input() showCartBtn = false;
  @Input() darkMode = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  private dataService = inject(DataService);

  goToDetail() {
    if (this.course?.id) {
      this.router.navigate(['/course', this.course.id]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  addToCart(event: Event) {
    event.stopPropagation();
    
    if (!this.course?.id) return;

    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Yêu cầu đăng nhập',
        text: 'Vui lòng đăng nhập để thêm vào giỏ hàng.',
        confirmButtonColor: '#5a67d8',
        confirmButtonText: 'Đến trang đăng nhập'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    this.dataService.addToCart(this.course.id).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Đã thêm vào giỏ hàng!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        this.dataService.loadCart();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: err.error?.message || 'Có lỗi xảy ra.',
          confirmButtonColor: '#5a67d8'
        });
      }
    });
  }
}
