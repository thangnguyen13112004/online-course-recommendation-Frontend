import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="learn-layout">
      <!-- Sidebar Curriculum -->
      <aside class="learn-sidebar">
        <div class="sidebar-header">
          <h3>Python từ cơ bản đến nâng cao</h3>
          <div class="progress-info">
            Tiến độ: <strong>65%</strong>
            <div class="progress-bar"><div class="fill" style="width:65%"></div></div>
          </div>
        </div>

        <div *ngFor="let ch of chapters" class="chapter">
          <div class="chapter-header">
            <span>{{ ch.title }}</span>
            <span class="ch-toggle"><i class="fa-solid fa-clipboard-list"></i></span>
          </div>
          <div *ngFor="let lesson of ch.lessons" class="lesson-item" [class.completed]="lesson.completed" [class.current]="lesson.current">
            <span class="lesson-icon">
              <ng-container *ngIf="lesson.completed">✅</ng-container>
              <ng-container *ngIf="lesson.current">🔵</ng-container>
              <ng-container *ngIf="!lesson.completed && !lesson.current">⚪</ng-container>
            </span>
            <span class="lesson-name">{{ lesson.name }}</span>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="learn-main">
        <!-- Top Bar -->
        <div class="learn-topbar">
          <span>EduLearn | Python từ cơ bản đến nâng cao</span>
          <div class="topbar-right">
            ★ Đánh giá | Tiến độ 65% | Chia sẻ | ⚙️
          </div>
        </div>

        <!-- Video Player -->
        <div class="video-player">
          <div class="video-placeholder">
            <button class="play-btn"><i class="fa-solid fa-play"></i></button>
          </div>
          <div class="video-info">
            <span>Ch.2 • Functions in Python • 20 phút</span>
          </div>
          <div class="video-controls">
            <div class="controls-left">
              <button>⏮</button>
              <button><i class="fa-solid fa-play"></i></button>
              <button>⏭</button>
            </div>
            <span>0:00 / 20:32</span>
            <div class="progress-bar video-progress"><div class="fill" style="width:0%"></div></div>
            <span>🔊 HD ⚙️</span>
          </div>
        </div>
      </main>

      <!-- Right Panel -->
      <aside class="learn-panel">
        <div class="panel-tabs">
          <button class="p-tab active">Tổng quan</button>
          <button class="p-tab">Ghi chú</button>
          <button class="p-tab">Hỏi & Đáp</button>
        </div>

        <div class="panel-content">
          <h3>Bài 5: Functions in Python</h3>
          <p class="panel-desc">Trong bài học này, bạn sẽ tìm hiểu về các hàm (functions) trong Python.</p>

          <div class="code-block">
            <code>
              <span class="comment"># Ví dụ về function</span><br>
              <span class="keyword">def</span> greet(name):<br>
              &nbsp;&nbsp;<span class="keyword">return</span> f"Xin chào, &#123;name&#125;!"<br><br>
              result = greet('Python')<br>
              <span class="func">print</span>(result)<br>
              <span class="comment"># Xin chào, Python!</span>
            </code>
          </div>

          <div class="nav-buttons">
            <button class="btn btn-outline">← Bài trước</button>
            <button class="btn btn-primary">Hoàn thành →</button>
          </div>

          <div class="faq-section">
            <h4>Câu hỏi phổ biến</h4>
            <div class="faq-item card">
              <strong>Sự khác biệt return vs print?</strong>
              <span>✔ Đã trả lời</span>
            </div>
            <div class="faq-item card">
              <strong>Default parameters khi nào dùng?</strong>
              <span>12 câu trả lời</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .learn-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .learn-sidebar {
      width: 260px;
      background: var(--gray-800);
      color: var(--white);
      overflow-y: auto;
      flex-shrink: 0;
    }
    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .sidebar-header h3 {
      font-size: 14px;
      margin-bottom: 8px;
    }
    .progress-info {
      font-size: 12px;
      color: var(--gray-400);
    }
    .progress-info strong { color: var(--white); }
    .progress-bar { margin-top: 4px; background: rgba(255,255,255,0.1); }
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
      transition: var(--transition);
    }
    .lesson-item:hover { background: rgba(255,255,255,0.05); }
    .lesson-item.completed { color: var(--gray-400); }
    .lesson-item.current {
      color: var(--primary-light);
      background: rgba(91, 99, 211, 0.15);
      font-weight: 600;
    }
    .lesson-icon { font-size: 14px; width: 20px; text-align: center; }

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
    .video-player {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .video-placeholder {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a2e;
    }
    .play-btn {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--primary);
      color: var(--white);
      font-size: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: var(--transition);
    }
    .play-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 0 30px rgba(91, 99, 211, 0.5);
    }
    .video-info {
      padding: 8px 20px;
      color: var(--gray-400);
      font-size: 13px;
      text-align: center;
    }
    .video-controls {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 10px 20px;
      background: rgba(0,0,0,0.3);
      color: var(--gray-400);
      font-size: 13px;
    }
    .controls-left {
      display: flex;
      gap: 8px;
    }
    .controls-left button {
      background: none;
      border: none;
      color: var(--white);
      font-size: 18px;
      cursor: pointer;
    }
    .video-progress {
      flex: 1;
      background: rgba(255,255,255,0.2);
    }

    .learn-panel {
      width: 340px;
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
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: var(--transition);
    }
    .p-tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }
    .panel-content { padding: 20px; }
    .panel-content h3 {
      font-size: 16px;
      margin-bottom: 8px;
    }
    .panel-desc {
      font-size: 13px;
      color: var(--gray-500);
      margin-bottom: 16px;
    }
    .code-block {
      background: #1e1e2e;
      color: #cdd6f4;
      padding: 16px;
      border-radius: var(--radius-sm);
      font-family: 'Fira Code', monospace;
      font-size: 13px;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .comment { color: #6c7086; }
    .keyword { color: #cba6f7; }
    .func { color: #89b4fa; }
    .nav-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 24px;
    }
    .faq-section { }
    .faq-section h4 {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .faq-item {
      padding: 12px;
      margin-bottom: 8px;
    }
    .faq-item strong {
      display: block;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .faq-item span {
      font-size: 12px;
      color: var(--gray-400);
    }
  `]
})
export class LearnComponent {
  chapters = [
    { title: 'Ch.1: Giới thiệu', lessons: [
      { name: 'Giới thiệu khóa học', completed: true, current: false },
      { name: 'Cài đặt Python', completed: true, current: false },
    ]},
    { title: 'Ch.2: Cơ bản', lessons: [
      { name: 'Biến & kiểu dữ liệu', completed: true, current: false },
      { name: 'Functions', completed: false, current: true },
      { name: 'Vòng lặp', completed: false, current: false },
    ]},
    { title: 'Ch.3: OOP', lessons: [
      { name: 'Classes', completed: false, current: false },
      { name: 'Kế thừa', completed: false, current: false },
    ]},
    { title: 'Ch.4: Advanced', lessons: [
      { name: 'Decorators', completed: false, current: false },
      { name: 'Generators', completed: false, current: false },
    ]},
  ];
}
