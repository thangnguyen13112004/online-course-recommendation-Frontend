import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="learn-layout" *ngIf="courseData">
      <!-- Sidebar Curriculum -->
      <aside class="learn-sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="back-link"><i class="fa-solid fa-arrow-left"></i> Quay lại</a>
          <h3>{{ courseData.tieuDe }}</h3>
          <div class="progress-info">
            Tiến độ: <strong>{{ courseData.phanTramTienDo | number:'1.0-0' }}%</strong>
            <div class="progress-bar"><div class="fill" [style.width.%]="courseData.phanTramTienDo"></div></div>
          </div>
        </div>

        <div *ngFor="let ch of courseData.chuongs; let ci = index" class="chapter">
          <div class="chapter-header">
            <span>Ch.{{ ci + 1 }}: {{ ch.tieuDe }}</span>
            <span class="ch-toggle"><i class="fa-solid fa-clipboard-list"></i></span>
          </div>
          <div *ngFor="let lesson of ch.baiHocs"
               class="lesson-item"
               [class.completed]="lesson.daHoanThanh"
               [class.current]="lesson.maBaiHoc === currentLessonId"
               (click)="selectLesson(lesson, courseData.maKhoaHoc)">
            <span class="lesson-icon">
              <i *ngIf="lesson.daHoanThanh" class="fa-solid fa-circle-check" style="color: #10B981"></i>
              <i *ngIf="!lesson.daHoanThanh && lesson.maBaiHoc === currentLessonId" class="fa-solid fa-circle-play" style="color: var(--primary-light)"></i>
              <i *ngIf="!lesson.daHoanThanh && lesson.maBaiHoc !== currentLessonId" class="fa-regular fa-circle" style="color: var(--gray-500)"></i>
            </span>
            <span class="lesson-name">{{ getLessonTitle(lesson) }}</span>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="learn-main">
        <!-- Top Bar -->
        <div class="learn-topbar">
          <span>EduLearn | {{ courseData.tieuDe }}</span>
          <div class="topbar-right">
            <button class="topbar-btn" (click)="openRating()">
              <i class="fa-solid fa-star" style="color: #fccc29"></i> Đánh giá
            </button>
            <span class="topbar-sep">|</span>
            <button class="topbar-btn" (click)="showProgressDetail()">
              <i class="fa-solid fa-chart-pie"></i> Tiến độ {{ courseData.phanTramTienDo | number:'1.0-0' }}%
            </button>
            <span class="topbar-sep">|</span>
            <button class="topbar-btn" (click)="shareLink()">
              <i class="fa-solid fa-share-nodes"></i> Chia sẻ
            </button>
            <span class="topbar-sep">|</span>
            <a class="topbar-btn" [routerLink]="['/dashboard']">
              <i class="fa-solid fa-gear"></i>
            </a>
          </div>
        </div>

        <!-- Video Player -->
        <div class="video-player">
          <div class="video-placeholder" *ngIf="!currentLesson?.linkVideo">
            <div class="no-video-msg" *ngIf="!currentLesson?.lyThuyet && !currentLesson?.baiTap">
              <i class="fa-solid fa-file-lines" style="font-size: 48px; margin-bottom: 16px; color: var(--gray-500)"></i>
              <p>Bài học này không có video</p>
            </div>
            
            <div class="reading-content" *ngIf="currentLesson?.lyThuyet || currentLesson?.baiTap" style="width: 100%; max-width: 800px; padding: 40px; background: white; color: var(--gray-800); border-radius: 8px; margin: 20px; overflow-y: auto; text-align: left; max-height: 90%;">
              <h2 style="font-size: 24px; margin-bottom: 20px; color: var(--text-dark);">{{ getLessonTitle(currentLesson) }}</h2>
              
              <div *ngIf="currentLesson?.lyThuyet" style="margin-bottom: 30px;">
                <h4 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;"><i class="fa-solid fa-book"></i> Lý thuyết</h4>
                <div [innerHTML]="formatContent(currentLesson.lyThuyet)" style="line-height: 1.8; font-size: 15px;"></div>
              </div>
              
              <div *ngIf="currentLesson?.baiTap" style="padding: 20px; background: rgba(91,99,211,0.05); border-left: 4px solid var(--primary); border-radius: 4px;">
                <h4 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;"><i class="fa-solid fa-pen-to-square"></i> Bài tập</h4>
                <div [innerHTML]="formatContent(currentLesson.baiTap)" style="line-height: 1.8; font-size: 15px;"></div>
              </div>
            </div>
          </div>
          <div class="video-container" *ngIf="currentLesson?.linkVideo">
            <video controls [src]="getVideoUrl(currentLesson!.linkVideo)" style="width:100%;height:100%;background:#000"></video>
          </div>
          <div class="video-info" *ngIf="currentLesson">
            <span>{{ getCurrentChapterTitle() }} <i class="fa-solid fa-chevron-right" style="font-size:10px"></i> {{ getLessonTitle(currentLesson) }}</span>
          </div>
        </div>
      </main>

      <!-- Right Panel -->
      <aside class="learn-panel">
        <div class="panel-tabs">
          <button class="p-tab" [class.active]="panelTab === 'overview'" (click)="panelTab = 'overview'">Tổng quan</button>
          <button class="p-tab" [class.active]="panelTab === 'notes'" (click)="panelTab = 'notes'">Ghi chú</button>
        </div>

        <div class="panel-content" *ngIf="panelTab === 'overview' && currentLesson">
          <h3>{{ getLessonTitle(currentLesson) }}</h3>

          <!-- Lý thuyết -->
          <div class="theory-content" *ngIf="currentLesson.lyThuyet">
            <div [innerHTML]="formatContent(currentLesson.lyThuyet)"></div>
          </div>

          <!-- Bài tập -->
          <div class="exercise-section" *ngIf="currentLesson.baiTap">
            <h4><i class="fa-solid fa-pen-to-square"></i> Bài tập</h4>
            <div class="exercise-content" [innerHTML]="formatContent(currentLesson.baiTap)"></div>
          </div>

          <div *ngIf="!currentLesson.lyThuyet && !currentLesson.baiTap" class="empty-content">
            <i class="fa-solid fa-book-open" style="font-size: 32px; color: var(--gray-400); margin-bottom: 8px"></i>
            <p>Chưa có nội dung cho bài học này.</p>
          </div>

          <!-- Nav buttons -->
          <div class="nav-buttons">
            <button class="btn btn-outline" (click)="goToPrevLesson()" [disabled]="!hasPrevLesson()">
              <i class="fa-solid fa-arrow-left"></i> Bài trước
            </button>
            <button class="btn btn-primary" *ngIf="!currentLesson.daHoanThanh" (click)="completeLesson()">
              Hoàn thành <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button class="btn btn-success" *ngIf="currentLesson.daHoanThanh && hasNextLesson()" (click)="goToNextLesson()">
              Bài tiếp theo <i class="fa-solid fa-arrow-right"></i>
            </button>
            <a class="btn btn-warning" *ngIf="currentLesson.daHoanThanh && !hasNextLesson()" routerLink="/dashboard" style="text-decoration:none; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none;">
              <i class="fa-solid fa-award"></i> Nhận chứng chỉ
            </a>
          </div>
        </div>

        <div class="panel-content" *ngIf="panelTab === 'notes'">
          <div class="empty-content">
            <i class="fa-solid fa-sticky-note" style="font-size: 32px; color: var(--gray-400); margin-bottom: 8px"></i>
            <p>Tính năng ghi chú sẽ sớm ra mắt.</p>
          </div>
        </div>
      </aside>
    </div>

    <!-- Loading -->
    <div *ngIf="loading" class="loading-screen">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 32px; color: var(--primary)"></i>
      <p>Đang tải nội dung khóa học...</p>
    </div>

    <!-- Error -->
    <div *ngIf="!loading && !courseData" class="error-screen">
      <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; color: var(--danger); margin-bottom: 16px"></i>
      <h2>Không thể tải khóa học</h2>
      <p>{{ errorMsg }}</p>
      <a routerLink="/dashboard" class="btn btn-primary" style="margin-top: 16px">Quay lại trang học tập</a>
    </div>
  `,
  styles: [`
    .learn-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .learn-sidebar {
      width: 280px;
      background: var(--gray-800);
      color: var(--white);
      overflow-y: auto;
      flex-shrink: 0;
    }
    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .back-link {
      font-size: 12px;
      color: var(--gray-400);
      text-decoration: none;
      display: inline-block;
      margin-bottom: 8px;
      transition: color 0.2s;
    }
    .back-link:hover { color: var(--white); }
    .back-link i { margin-right: 4px; }
    .sidebar-header h3 {
      font-size: 14px;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .progress-info {
      font-size: 12px;
      color: var(--gray-400);
    }
    .progress-info strong { color: var(--white); }
    .progress-bar { margin-top: 4px; background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; }
    .progress-bar .fill { height: 100%; background: var(--primary); border-radius: 2px; transition: width 0.3s; }
    .chapter { border-bottom: 1px solid rgba(255,255,255,0.05); }
    .chapter-header {
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 600;
      color: var(--gray-400);
    }
    .lesson-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px 8px 24px;
      font-size: 13px;
      color: var(--gray-400);
      cursor: pointer;
      transition: all 0.2s;
    }
    .lesson-item:hover { background: rgba(255,255,255,0.05); }
    .lesson-item.completed { color: var(--gray-500); }
    .lesson-item.current {
      color: var(--primary-light, #a5b4fc);
      background: rgba(91, 99, 211, 0.15);
      font-weight: 600;
    }
    .lesson-icon { font-size: 14px; width: 20px; text-align: center; flex-shrink: 0; }

    .learn-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #0D0D0D;
    }
    .learn-topbar {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      background: var(--gray-800);
      color: var(--gray-400);
      font-size: 13px;
    }
    .topbar-right i { margin: 0 2px; }
    .topbar-right { display: flex; align-items: center; gap: 4px; }
    .topbar-btn {
      background: none;
      border: none;
      color: var(--gray-400);
      font-size: 13px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s;
      text-decoration: none;
    }
    .topbar-btn:hover {
      color: var(--white);
      background: rgba(255,255,255,0.1);
    }
    .topbar-sep { color: var(--gray-600); }
    .video-player {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .video-placeholder, .video-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a2e;
    }
    .no-video-msg {
      text-align: center;
      color: var(--gray-400);
    }
    .video-info {
      padding: 8px 20px;
      color: var(--gray-400);
      font-size: 13px;
      text-align: center;
      background: rgba(0,0,0,0.3);
    }

    .learn-panel {
      width: 360px;
      background: var(--white);
      overflow-y: auto;
      flex-shrink: 0;
      border-left: 1px solid var(--gray-200);
    }
    .panel-tabs {
      display: flex;
      border-bottom: 2px solid var(--gray-200);
    }
    .p-tab {
      flex: 1;
      padding: 12px;
      background: none;
      font-size: 13px;
      font-weight: 600;
      color: var(--gray-400);
      border: none;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
      cursor: pointer;
    }
    .p-tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }
    .panel-content { padding: 20px; }
    .panel-content h3 {
      font-size: 16px;
      margin-bottom: 12px;
    }
    .theory-content {
      font-size: 14px;
      color: var(--gray-700);
      line-height: 1.7;
      margin-bottom: 20px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .exercise-section {
      margin-bottom: 20px;
      padding: 16px;
      background: rgba(91,99,211,0.05);
      border-radius: 8px;
      border-left: 3px solid var(--primary);
    }
    .exercise-section h4 {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--primary);
    }
    .exercise-section h4 i { margin-right: 6px; }
    .exercise-content {
      font-size: 14px;
      color: var(--gray-700);
      line-height: 1.7;
      white-space: pre-wrap;
    }
    .empty-content {
      text-align: center;
      padding: 40px 20px;
      color: var(--gray-500);
    }
    .nav-buttons {
      display: flex;
      gap: 10px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--gray-200);
    }
    .nav-buttons .btn { flex: 1; }
    .btn-success {
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      border: none;
    }
    .btn-success:hover {
      background: linear-gradient(135deg, #059669, #047857);
    }

    .loading-screen, .error-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      color: var(--gray-600);
    }
    .loading-screen p, .error-screen p {
      margin-top: 12px;
    }
  `]
})
export class LearnComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private sanitizer = inject(DomSanitizer);

  courseData: any = null;
  currentLesson: any = null;
  currentLessonId = 0;
  loading = true;
  errorMsg = '';
  panelTab: 'overview' | 'notes' = 'overview';
  
  isVideoFinished = false;
  isExerciseCompleted = false;

  private allLessons: any[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const courseId = +(params.get('slug') || 0);
      const lessonId = +(params.get('id') || 0);
      this.currentLessonId = lessonId;
      if (courseId) {
        this.loadCourseContent(courseId, lessonId);
      }
    });
  }

  loadCourseContent(courseId: number, lessonId: number) {
    this.loading = true;
    this.api.getCourseContent(courseId).subscribe({
      next: (data: any) => {
        this.courseData = data;
        this.buildLessonList();

        // Chọn bài học theo ID hoặc bài đầu tiên
        if (lessonId && this.allLessons.some(l => l.maBaiHoc === lessonId)) {
          this.currentLessonId = lessonId;
        } else if (this.allLessons.length > 0) {
          // Chọn bài chưa hoàn thành đầu tiên hoặc bài đầu
          const firstIncomplete = this.allLessons.find(l => !l.daHoanThanh);
          this.currentLessonId = firstIncomplete ? firstIncomplete.maBaiHoc : this.allLessons[0].maBaiHoc;
        }
        this.currentLesson = this.allLessons.find(l => l.maBaiHoc === this.currentLessonId) || null;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Không thể tải nội dung khóa học.';
      }
    });
  }

  private buildLessonList() {
    this.allLessons = [];
    if (this.courseData?.chuongs) {
      for (const ch of this.courseData.chuongs) {
        for (const lesson of (ch.baiHocs || [])) {
          this.allLessons.push(lesson);
        }
      }
    }
  }

  selectLesson(lesson: any, courseId: number) {
    this.currentLessonId = lesson.maBaiHoc;
    this.currentLesson = lesson;
    this.panelTab = 'overview';
    this.isVideoFinished = false;
    this.isExerciseCompleted = false;
  }

  onVideoEnded() {
    this.isVideoFinished = true;
  }

  canCompleteLesson(): boolean {
    return true;
  }

  getLessonTitle(lesson: any): string {
    if (!lesson) return 'Bài học';
    if (lesson.lyThuyet && lesson.lyThuyet.length > 0) {
      const firstLine = lesson.lyThuyet.split('\n')[0].trim();
      return firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
    }
    return 'Bài học #' + lesson.maBaiHoc;
  }

  getCurrentChapterTitle(): string {
    if (!this.courseData?.chuongs) return '';
    for (let i = 0; i < this.courseData.chuongs.length; i++) {
      const ch = this.courseData.chuongs[i];
      if (ch.baiHocs?.some((l: any) => l.maBaiHoc === this.currentLessonId)) {
        return 'Ch.' + (i + 1) + ': ' + ch.tieuDe;
      }
    }
    return '';
  }

  getVideoUrl(linkVideo: string): string {
    if (linkVideo.startsWith('http')) return linkVideo;
    return 'http://localhost:5128' + linkVideo;
  }

  formatContent(text: string): SafeHtml {
    if (!text) return '';
    // Fix newlines and allow raw HTML
    const htmlWithBr = text.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(htmlWithBr);
  }

  completeLesson() {
    if (!this.currentLesson) return;
    this.api.completeLesson(this.currentLessonId).subscribe({
      next: (res: any) => {
        this.currentLesson.daHoanThanh = true;
        if (res.phanTramTienDo !== undefined) {
          this.courseData.phanTramTienDo = res.phanTramTienDo;
        }
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: res.message || 'Đã hoàn thành bài học!',
          showConfirmButton: false,
          timer: 2000
        });

        // Tự động chuyển bài tiếp theo
        if (this.hasNextLesson()) {
          setTimeout(() => this.goToNextLesson(), 1000);
        } else {
          // Bài cuối cùng
          if (this.courseData.phanTramTienDo >= 100 || this.allLessons.every(l => l.daHoanThanh)) {
            Swal.fire({
              title: '🎉 Chúc mừng!',
              text: 'Bạn đã hoàn thành xuất sắc toàn bộ khóa học này. Hệ thống đã ghi nhận và đang cấp chứng chỉ cho bạn.',
              icon: 'success',
              confirmButtonText: 'Xem chứng chỉ',
              confirmButtonColor: '#f59e0b',
              allowOutsideClick: false
            }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          }
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: err.error?.message || 'Không thể hoàn thành bài học.',
          confirmButtonColor: '#5a67d8'
        });
      }
    });
  }

  hasPrevLesson(): boolean {
    const idx = this.allLessons.findIndex(l => l.maBaiHoc === this.currentLessonId);
    return idx > 0;
  }

  hasNextLesson(): boolean {
    const idx = this.allLessons.findIndex(l => l.maBaiHoc === this.currentLessonId);
    return idx < this.allLessons.length - 1;
  }

  goToPrevLesson() {
    const idx = this.allLessons.findIndex(l => l.maBaiHoc === this.currentLessonId);
    if (idx > 0) {
      const prev = this.allLessons[idx - 1];
      this.selectLesson(prev, this.courseData.maKhoaHoc);
    }
  }

  goToNextLesson() {
    const idx = this.allLessons.findIndex(l => l.maBaiHoc === this.currentLessonId);
    if (idx < this.allLessons.length - 1) {
      const next = this.allLessons[idx + 1];
      this.selectLesson(next, this.courseData.maKhoaHoc);
    }
  }

  openRating() {
    this.router.navigate(['/course', this.courseData.maKhoaHoc], { fragment: 'reviews' });
  }

  showProgressDetail() {
    const total = this.allLessons.length;
    const completed = this.allLessons.filter(l => l.daHoanThanh).length;
    const remaining = total - completed;
    Swal.fire({
      title: '<i class="fa-solid fa-chart-pie"></i> Chi tiết tiến độ',
      html: `
        <div style="text-align:left; padding: 8px 0;">
          <p style="margin:8px 0"><strong>Khóa học:</strong> ${this.courseData.tieuDe}</p>
          <p style="margin:8px 0"><strong>Tổng bài học:</strong> ${total}</p>
          <p style="margin:8px 0; color:#10B981"><strong>Đã hoàn thành:</strong> ${completed}/${total}</p>
          <p style="margin:8px 0; color:#F59E0B"><strong>Còn lại:</strong> ${remaining} bài</p>
          <div style="margin-top:12px; background:#e5e7eb; border-radius:8px; height:12px; overflow:hidden">
            <div style="height:100%; background:linear-gradient(90deg,#10B981,#059669); border-radius:8px; width:${this.courseData.phanTramTienDo}%"></div>
          </div>
          <p style="text-align:center; margin-top:8px; font-weight:700; font-size:18px; color:#5a67d8">${this.courseData.phanTramTienDo | 0}%</p>
        </div>
      `,
      confirmButtonColor: '#5a67d8',
      confirmButtonText: 'Tiếp tục học'
    });
  }

  shareLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Đã sao chép link khóa học!',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }
}
