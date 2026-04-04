import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container" *ngIf="totalPages > 1">
      <div class="pagination-info">
        Hiển thị <strong>{{ startIndex }} - {{ endIndex }}</strong> trong số <strong>{{ totalItems }}</strong> mục
      </div>
      
      <div class="pagination-actions">
        <button class="page-btn nav-btn" 
                [disabled]="currentPage === 1" 
                (click)="setPage(currentPage - 1)">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        
        <button *ngFor="let page of pages" 
                class="page-btn" 
                [class.active]="page === currentPage"
                [class.dots]="page === -1"
                (click)="page !== -1 && setPage(page)">
          {{ page === -1 ? '...' : page }}
        </button>
        
        <button class="page-btn nav-btn" 
                [disabled]="currentPage === totalPages" 
                (click)="setPage(currentPage + 1)">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      margin-top: 24px;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 100px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .pagination-info {
      font-size: 14px;
      color: #64748b;
    }
    
    .pagination-info strong {
      color: #0f172a;
      font-weight: 700;
    }
    
    .pagination-actions {
      display: flex;
      gap: 6px;
    }
    
    .page-btn {
      min-width: 38px;
      height: 38px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: #475569;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .page-btn:hover:not(.dots):not(:disabled) {
      background: #f1f5f9;
      color: #0f172a;
    }
    
    .page-btn.active {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
    }
    
    .page-btn.dots {
      cursor: default;
      background: transparent;
    }
    
    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    
    .nav-btn {
      background: white;
      border: 1px solid #e2e8f0;
      color: #0f172a;
    }
    
    .nav-btn:hover:not(:disabled) {
      border-color: #cbd5e1;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      background: white;
    }
    
    @media (max-width: 640px) {
      .pagination-container {
        flex-direction: column;
        justify-content: center;
        border-radius: 20px;
      }
    }
  `]
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 0;
  pages: number[] = [];
  startIndex: number = 0;
  endIndex: number = 0;

  ngOnChanges() {
    this.calculatePagination();
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.calculatePagination();
    this.pageChange.emit(page);
  }

  private calculatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
    this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endIndex = Math.min(this.startIndex + this.pageSize - 1, this.totalItems);
    
    if (this.totalItems === 0) {
      this.startIndex = 0;
      this.endIndex = 0;
    }

    this.pages = this.generatePages();
  }

  private generatePages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      if (this.currentPage <= 2) {
        end = 3;
      }
      
      if (this.currentPage >= this.totalPages - 1) {
        start = this.totalPages - 2;
      }
      
      if (start > 2) {
        pages.push(-1); // denotes dots
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < this.totalPages - 1) {
        pages.push(-1); // denotes dots
      }
      
      pages.push(this.totalPages);
    }
    
    return pages;
  }
}
