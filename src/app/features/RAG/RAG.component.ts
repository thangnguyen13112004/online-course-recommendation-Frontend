import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-rag',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, CourseCardComponent],
  template: `
    <app-header />

    <div class="rag-page">
      <div class="hero-center-wrapper" *ngIf="!hasSearched">
        <div class="hero-content text-center">
          <div class="ai-badge">
            <i class="fa-solid fa-wand-magic-sparkles"></i> AI Phân tích Lộ trình
          </div>

          <h1 class="hero-title">
            Bạn muốn trở thành <span class="text-brand">ai</span> trong tương lai?
          </h1>

          <p class="hero-subtitle">
            Mô tả mục tiêu, công việc mơ ước hoặc kỹ năng bạn muốn chinh phục. <br>
            Trợ lý AI sẽ gợi ý những khóa học phù hợp nhất.
          </p>

          <div class="search-box-large">
            <input type="text"
                   [(ngModel)]="searchQuery"
                   (keyup.enter)="executeSearch()"
                   placeholder="VD: Tôi muốn trở thành lập trình viên Backend lương ngàn đô..."
                   [disabled]="isLoading">
            <button class="btn-search-large" (click)="executeSearch()" [disabled]="isLoading || !searchQuery.trim()">
              <i class="fa-solid fa-paper-plane" *ngIf="!isLoading"></i>
              <i class="fa-solid fa-circle-notch fa-spin" *ngIf="isLoading"></i>
              Gửi yêu cầu
            </button>
          </div>

          <div class="suggested-prompts">
            <span>Gợi ý:</span>
            <button (click)="setQuery('Kỹ năng phân tích dữ liệu cho người mới')">Data Analyst</button>
            <button (click)="setQuery('Thiết kế giao diện UI/UX xu hướng 2026')">UI/UX Designer</button>
            <button (click)="setQuery('Cấu trúc dữ liệu và giải thuật phỏng vấn')">Thuật toán</button>
          </div>
        </div>
      </div>

      <div class="results-wrapper container" *ngIf="hasSearched">
        <div class="top-search-bar">
          <div class="ai-icon-small">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div class="search-input-wrapper">
            <input type="text"
                   [(ngModel)]="searchQuery"
                   (keyup.enter)="executeSearch()"
                   placeholder="Mô tả mục tiêu của bạn..."
                   [disabled]="isLoading">
            <button class="btn-search-mini" (click)="executeSearch()" [disabled]="isLoading">
              <i class="fa-solid fa-magnifying-glass" *ngIf="!isLoading"></i>
              <i class="fa-solid fa-circle-notch fa-spin" *ngIf="isLoading"></i>
            </button>
          </div>

          <button class="btn-reset" (click)="resetSearch()">
            <i class="fa-solid fa-arrow-rotate-left"></i> Làm mới
          </button>
        </div>

        <div class="results-header" *ngIf="!isLoading">
          <h2 class="section-title">Khóa học AI Đề xuất</h2>
          <p class="section-subtitle">
            Dựa trên yêu cầu: <strong>"{{ lastSearchedQuery }}"</strong>
          </p>
        </div>

        <div class="loading-state" *ngIf="isLoading">
          <div class="spinner"></div>
          <p>AI đang phân tích và tìm kiếm khóa học phù hợp nhất cho bạn...</p>
        </div>

        <div class="course-grid" *ngIf="!isLoading && aiResults.length > 0">
          <div *ngFor="let course of aiResults">
             <app-course-card [course]="course" [showCartBtn]="true"></app-course-card>
          </div>
        </div>

        <div class="empty-state" *ngIf="!isLoading && aiResults.length === 0">
          <div class="empty-icon"><i class="fa-solid fa-ghost"></i></div>
          <h3>Không tìm thấy dữ liệu phù hợp</h3>
          <p>Hãy thử mô tả chi tiết hơn hoặc đổi từ khóa khác nhé.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --clr-brand: #ea580c;
      --clr-brand-hover: #c2410c;
      --clr-brand-light: #fff7ed;
      --clr-text-main: #0f172a;
      --clr-text-muted: #64748b;
      --clr-bg-main: #ffffff;
      --clr-bg-alt: #f8fafc;
      --clr-border: #e2e8f0;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    .text-brand { color: var(--clr-brand); }
    .rag-page { min-height: calc(100vh - 72px); background-color: var(--clr-bg-alt); display: flex; flex-direction: column; }

    .hero-center-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
      background: radial-gradient(circle at center, #ffffff 0%, var(--clr-bg-alt) 100%);
    }
    .hero-content {
      max-width: 800px;
      width: 100%;
      text-align: center;
    }
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      background: var(--clr-brand-light);
      color: var(--clr-brand);
      border-radius: 100px;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 24px;
      border: 1px solid rgba(234, 88, 12, 0.2);
    }
    .hero-title {
      font-size: 48px;
      font-weight: 800;
      color: var(--clr-text-main);
      margin-bottom: 20px;
      letter-spacing: -1px;
    }
    .hero-subtitle {
      font-size: 18px;
      color: var(--clr-text-muted);
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .search-box-large {
      display: flex;
      align-items: center;
      background: var(--clr-bg-main);
      border: 2px solid var(--clr-border);
      border-radius: 100px;
      padding: 8px 8px 8px 24px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
      margin-bottom: 24px;
    }
    .search-box-large:focus-within {
      border-color: var(--clr-brand);
      box-shadow: 0 0 0 4px var(--clr-brand-light);
    }
    .search-box-large input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 16px 12px;
      font-size: 18px;
      outline: none;
      color: var(--clr-text-main);
    }
    .btn-search-large {
      background: var(--clr-brand);
      color: white;
      border: none;
      padding: 16px 36px;
      border-radius: 100px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .btn-search-large:hover:not(:disabled) { background: var(--clr-brand-hover); }
    .btn-search-large:disabled { opacity: 0.6; cursor: not-allowed; }

    .suggested-prompts {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      color: var(--clr-text-muted);
      font-size: 14px;
    }
    .suggested-prompts button {
      background: var(--clr-bg-main);
      border: 1px solid var(--clr-border);
      padding: 6px 16px;
      border-radius: 100px;
      color: var(--clr-text-main);
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }
    .suggested-prompts button:hover {
      border-color: var(--clr-brand);
      color: var(--clr-brand);
      background: var(--clr-brand-light);
    }

    .container { max-width: 1320px; margin: 0 auto; padding: 40px 24px; }

    .top-search-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 40px;
      padding: 16px;
      background: var(--clr-bg-main);
      border-radius: 16px;
      border: 1px solid var(--clr-border);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .ai-icon-small {
      width: 48px; height: 48px;
      background: var(--clr-brand-light); color: var(--clr-brand);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      font-size: 24px;
    }
    .search-input-wrapper {
      flex: 1;
      display: flex; align-items: center;
      background: var(--clr-bg-alt);
      border-radius: 12px;
      padding: 4px 4px 4px 16px;
      border: 1px solid var(--clr-border);
    }
    .search-input-wrapper:focus-within { border-color: var(--clr-brand); }
    .search-input-wrapper input {
      flex: 1; border: none; background: transparent; padding: 12px; font-size: 15px; outline: none;
    }
    .btn-search-mini {
      background: var(--clr-brand); color: white; border: none;
      width: 40px; height: 40px; border-radius: 8px; cursor: pointer;
    }
    .btn-search-mini:disabled { opacity: 0.6; }

    .btn-reset {
      background: transparent; border: 1px solid var(--clr-border);
      padding: 12px 20px; border-radius: 12px; font-weight: 600;
      color: var(--clr-text-muted); cursor: pointer;
      display: flex; align-items: center; gap: 8px; transition: 0.2s;
    }
    .btn-reset:hover { background: var(--clr-bg-alt); color: var(--clr-text-main); }

    .results-header { margin-bottom: 32px; }
    .section-title { font-size: 28px; font-weight: 800; color: var(--clr-text-main); margin-bottom: 8px; }
    .section-subtitle { font-size: 16px; color: var(--clr-text-muted); }

    .course-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .loading-state, .empty-state {
      text-align: center; padding: 80px 20px; color: var(--clr-text-muted);
    }
    .spinner {
      width: 48px; height: 48px;
      border: 4px solid var(--clr-border); border-top-color: var(--clr-brand);
      border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    .empty-icon { font-size: 64px; color: #cbd5e1; margin-bottom: 20px; }
    .empty-state h3 { font-size: 20px; color: var(--clr-text-main); margin-bottom: 8px; }

    @media (max-width: 1024px) {
      .course-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 768px) {
      .hero-title { font-size: 32px; }
      .search-box-large { flex-direction: column; border-radius: 20px; padding: 12px; }
      .search-box-large input { width: 100%; text-align: center; }
      .btn-search-large { width: 100%; justify-content: center; }
      .course-grid { grid-template-columns: repeat(2, 1fr); }
      .top-search-bar { flex-direction: column; align-items: stretch; }
      .ai-icon-small { display: none; }
    }
    @media (max-width: 480px) {
      .course-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class RagComponent {
  searchQuery = '';
  lastSearchedQuery = '';
  hasSearched = false;
  isLoading = false;

  aiResults: any[] = [];

  private apiService = inject(ApiService);

  setQuery(text: string) {
    this.searchQuery = text;
    this.executeSearch();
  }

  executeSearch() {
    if (!this.searchQuery.trim()) return;

    this.hasSearched = true;
    this.isLoading = true;
    this.lastSearchedQuery = this.searchQuery;
    this.aiResults = [];

    this.apiService.searchCoursesByAI(this.searchQuery).pipe(
      switchMap((ragResponse: any[]) => {
        if (!ragResponse || ragResponse.length === 0) {
          return of([]);
        }

        const courseRequests = ragResponse.map(r =>
          this.apiService.getCourseById(r.courseId || r.id).pipe(
            map((fullCourseRes: any) => {
              const courseData = fullCourseRes.course || fullCourseRes.data || fullCourseRes;

              // TÌM TÊN GIẢNG VIÊN (Nếu API trả về mảng)
              let instructorName = 'Đang cập nhật';
              if (courseData.giangVien && Array.isArray(courseData.giangVien) && courseData.giangVien.length > 0) {
                // Ưu tiên giảng viên chính, nếu không có lấy người đầu tiên
                const mainIns = courseData.giangVien.find((g: any) => g.laGiangVienChinh) || courseData.giangVien[0];
                instructorName = mainIns.ten || mainIns.name || 'Đang cập nhật';
              }

              // ÁNH XẠ DỮ LIỆU (MAPPING)
              // Chuyển các field từ tiếng Việt sang các field tiếng Anh chuẩn mà <app-course-card> cần
              return {
                ...courseData,
                id: courseData.id || courseData.maKhoaHoc,
                title: courseData.title || courseData.tieuDe,
                image: courseData.image || courseData.anhUrl,
                anhUrl: courseData.anhUrl || courseData.image,
                thumbnail: courseData.thumbnail || courseData.anhUrl,
                price: courseData.price !== undefined ? courseData.price : courseData.giaGoc,
                rating: courseData.rating !== undefined ? courseData.rating : courseData.tbdanhGia,
                students: courseData.students !== undefined ? courseData.students : courseData.soHocVien,
                reviewCount: courseData.reviewCount !== undefined ? courseData.reviewCount : courseData.soLuongDanhGia,
                instructor: courseData.instructor || instructorName,

                // Giữ lại điểm xếp hạng của AI
                aiScore: r.score
              };
            }),
            catchError((err) => {
              console.error('Lỗi khi fetch chi tiết khóa học:', err);
              return of(null);
            })
          )
        );

        return forkJoin(courseRequests);
      })
    ).subscribe({
      next: (fullCourses: any[]) => {
        this.aiResults = fullCourses
          .filter(c => c !== null)
          .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('AI Search Error:', err);
        this.aiResults = [];
        this.isLoading = false;
      }
    });
  }

  resetSearch() {
    this.hasSearched = false;
    this.searchQuery = '';
    this.lastSearchedQuery = '';
    this.aiResults = [];
  }
}
