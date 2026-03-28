import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card card">
      <div class="stat-content">
        <span class="stat-value" [style.color]="valueColor">{{ value }}</span>
        <span class="stat-label">{{ label }}</span>
        <span *ngIf="trend" class="stat-trend" [class.positive]="trendPositive">
          ▲ {{ trend }}
        </span>
      </div>
      <span *ngIf="icon" class="stat-icon">{{ icon }}</span>
    </div>
  `,
  styles: [`
    .stat-card {
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 800;
      color: var(--primary);
      line-height: 1.1;
    }
    .stat-label {
      font-size: 13px;
      color: var(--gray-500);
      margin-top: 4px;
    }
    .stat-trend {
      font-size: 12px;
      color: var(--success);
      margin-top: 4px;
    }
    .stat-trend.positive {
      color: var(--success);
    }
    .stat-icon {
      font-size: 36px;
      opacity: 0.6;
    }
  `]
})
export class StatCardComponent {
  @Input() value = '';
  @Input() label = '';
  @Input() icon = '';
  @Input() valueColor = 'var(--primary)';
  @Input() trend = '';
  @Input() trendPositive = true;
}
