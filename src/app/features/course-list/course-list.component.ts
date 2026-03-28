import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';

import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header />
    <div class="page-body">
      <!-- Sidebar Filters -->
      <aside class="filter-sidebar">
        <h3>📋 Bộ lọc</h3>

        <div class="filter-group">
          <h4>Nguồn</h4>
          <label *ngFor="let s of sources" class="radio-item">
            <input type="radio" name="source" [checked]="s === 'Coursera'">
            <span>{{ s }}</span>
          </label>
        </div>

        <div class="filter-group">
          <h4>Cấp độ</h4>
          <label *ngFor="let l of levels" class="radio-item">
            <input type="radio" name="level" [checked]="l === 'Tất cả'">
            <span>{{ l }}</span>
          </label>
        </div>

        <div class="filter-group">
          <h4>Đánh giá</h4>
          <label class="radio-item"><input type="radio" name="rating" checked><span>Tất cả</span></label>
          <label class="radio-item"><input type="radio" name="rating"><span>★★★★★ 4.5+</span></label>
          <label class="radio-item"><input type="radio" name="rating"><span>★★★★ 4.0+</span></label>
        </div>

        <div class="filter-group">
          <h4>Giá</h4>
          <label class="radio-item"><input type="radio" name="price" checked><span>Tất cả</span></label>
          <label class="radio-item"><input type="radio" name="price"><span>Miễn phí</span></label>
          <label class="radio-item"><input type="radio" name="price"><span>Có phí</span></label>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="course-main">
        <div class="top-bar">
          <span>Hiển thị <strong>{{ dataService.courses().length }} khóa học</strong></span>
          <div class="sort-select">
            <span>📋 Phù hợp nhất</span> ▾
          </div>
        </div>

        <div class="search-bar-mini">
          <input type="text" placeholder="Tìm kiếm kỹ năng..." class="form-input">
          <div class="search-cat-mini">Tất cả danh mục ▾</div>
          <button class="btn btn-primary btn-sm">🔍 Tìm kiếm</button>
        </div>

        <div class="category-tags">
          <button *ngFor="let cat of dataService.categories(); let i = index"
                  class="cat-tag" [class.active]="i === 0">
            {{ cat }}
          </button>
        </div>

        <div class="course-grid">
          <div *ngFor="let course of dataService.courses()" class="course-item card">
            <div class="item-image">
              <span class="item-emoji">{{ course.image }}</span>
              <span *ngIf="course.aiMatch" class="ai-badge badge badge-primary">🤖 AI {{ course.aiMatch }}%</span>
            </div>
            <div class="item-body">
              <h3>{{ course.title }}</h3>
              <p class="instructor">{{ course.instructor }}</p>
              <div class="rating-row">
                <span class="stars">★★★★★</span>
                <span class="rating-text">{{ course.rating }} ({{ course.reviewCount }})</span>
              </div>
              <div class="price-row">
                <span class="price">{{ course.price | number }}đ</span>
                <span class="original">{{ course.originalPrice | number }}đ</span>
              </div>
            </div>
            <button class="btn btn-primary btn-sm add-cart">+ Giỏ hàng</button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .page-body {
      display: flex;
      max-width: 1320px;
      margin: 0 auto;
      padding: 24px;
      gap: 24px;
    }
    .filter-sidebar {
      width: 220px;
      flex-shrink: 0;
    }
    .filter-sidebar h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .filter-group {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--gray-200);
    }
    .filter-group h4 {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .radio-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
      cursor: pointer;
      font-size: 14px;
      color: var(--gray-600);
    }
    .radio-item input[type="radio"] {
      accent-color: var(--primary);
    }
    .course-main {
      flex: 1;
    }
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .sort-select {
      padding: 8px 14px;
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-sm);
      font-size: 13px;
      cursor: pointer;
      background: var(--white);
    }
    .search-bar-mini {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    .search-bar-mini .form-input {
      flex: 1;
    }
    .search-cat-mini {
      padding: 10px 14px;
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-sm);
      font-size: 13px;
      white-space: nowrap;
      display: flex;
      align-items: center;
      background: var(--white);
    }
    .category-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .cat-tag {
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid var(--gray-300);
      background: var(--white);
      font-size: 13px;
      cursor: pointer;
      transition: var(--transition);
    }
    .cat-tag.active, .cat-tag:hover {
      background: var(--primary);
      color: var(--white);
      border-color: var(--primary);
    }
    .course-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .course-item {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .item-image {
      height: 140px;
      background: var(--primary-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .item-emoji {
      font-size: 56px;
    }
    .ai-badge {
      position: absolute;
      bottom: 8px;
      left: 8px;
    }
    .item-body {
      padding: 12px;
      flex: 1;
    }
    .item-body h3 {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .instructor {
      font-size: 12px;
      color: var(--gray-500);
      margin-bottom: 4px;
    }
    .rating-row {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 6px;
    }
    .stars { color: var(--orange); font-size: 11px; }
    .rating-text { font-size: 12px; color: var(--gray-500); }
    .price-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .price {
      font-weight: 800;
      color: var(--primary);
      font-size: 16px;
    }
    .original {
      text-decoration: line-through;
      color: var(--gray-400);
      font-size: 13px;
    }
    .add-cart {
      margin: 0 12px 12px;
    }
  `]
})
export class CourseListComponent {
  sources = ['Coursera', 'Udemy', 'edX', 'LinkedIn'];
  levels = ['Tất cả', 'Cơ bản', 'Trung cấp', 'Nâng cao'];

  constructor(public dataService: DataService) { }
}
