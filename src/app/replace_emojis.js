const fs = require('fs');
const path = require('path');

const emojiMap = {
  '📚': '<i class="fa-solid fa-book"></i>',
  '📦': '<i class="fa-solid fa-box"></i>',
  '🎯': '<i class="fa-solid fa-bullseye"></i>',
  '⭐': '<i class="fa-solid fa-star" style="color: #fccc29;"></i>',
  '⏱️': '<i class="fa-solid fa-stopwatch"></i>',
  '⏱': '<i class="fa-solid fa-stopwatch"></i>',
  '👨‍🏫': '<i class="fa-solid fa-chalkboard-user"></i>',
  '🎓': '<i class="fa-solid fa-graduation-cap"></i>',
  '🔔': '<i class="fa-solid fa-bell"></i>',
  '🛒': '<i class="fa-solid fa-cart-shopping"></i>',
  '👥': '<i class="fa-solid fa-users"></i>',
  '🔍': '<i class="fa-solid fa-magnifying-glass"></i>',
  '🏆': '<i class="fa-solid fa-trophy"></i>',
  '▶️': '<i class="fa-solid fa-play"></i>',
  '▶': '<i class="fa-solid fa-play"></i>',
  '📝': '<i class="fa-solid fa-pen-to-square"></i>',
  '🗑️': '<i class="fa-solid fa-trash"></i>',
  '🗑': '<i class="fa-solid fa-trash"></i>',
  '📋': '<i class="fa-solid fa-clipboard-list"></i>',
  '💳': '<i class="fa-solid fa-credit-card"></i>',
  '💰': '<i class="fa-solid fa-coins"></i>'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(process.cwd());

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const replaceAll = (search, replacement) => {
    if (content.includes(search)) {
      content = content.split(search).join(replacement);
      changed = true;
    }
  };

  // Safe manual replacements avoiding regex
  // course-card.component.ts
  replaceAll(
    `(error)="course.image = '📦'"`,
    `(error)="course.imageError = true"`
  );
  replaceAll(
    `<span *ngIf="!course.image || course.image.length <= 5" class="card-emoji">{{ course.image || '📦' }}</span>`,
    `<div *ngIf="!course.image || course.image.length <= 5 || course.imageError" class="card-emoji" style="display:flex; justify-content:center; align-items:center; width:100%; height:100%"><i class="fa-solid fa-box" style="font-size: 32px"></i></div>`
  );
  if (content.includes('CourseCardComponent {') && !content.includes('course.imageError')) {
    replaceAll('export class CourseCardComponent {', 'export class CourseCardComponent { course = { imageError: false } as any; ');
  }

  // my-courses.component.ts & dashboard.component.ts
  replaceAll(
    `(error)="ec.course!.image = '📦'"`,
    `(error)="ec.courseError = true"`
  );
  replaceAll(
    `<span *ngIf="!ec.course?.image || ec.course!.image!.length <= 5" style="font-size: 32px">{{ ec.course?.image || '📦' }}</span>`,
    `<div *ngIf="!ec.course?.image || ec.course!.image!.length <= 5 || ec.courseError" style="font-size: 32px; display:flex; justify-content:center; align-items:center; width:100%; height:100%"><i class="fa-solid fa-box"></i></div>`
  );
  replaceAll(
    `<img *ngIf="ec.course?.image && ec.course!.image!.length > 5" [src]="ec.course?.image"`,
    `<img *ngIf="ec.course?.image && ec.course!.image!.length > 5 && !ec.courseError" [src]="ec.course?.image"`
  );

  // course-list.component.ts
  replaceAll(
    `(error)="course.image = '📦'"`,
    `(error)="course.imageError = true"`
  );
  replaceAll(
    `<span *ngIf="!course.image || course.image.length <= 5" class="item-emoji">{{ course.image || '📦' }}</span>`,
    `<div *ngIf="!course.image || course.image.length <= 5 || course.imageError" class="item-emoji" style="display:flex; justify-content:center; align-items:center; width:100%; height:100%"><i class="fa-solid fa-box"></i></div>`
  );
  replaceAll(
    `<img *ngIf="course.image && course.image.length > 5" [src]="course.image"`,
    `<img *ngIf="course.image && course.image.length > 5 && !course.imageError" [src]="course.image"`
  );

  // course-detail.component.ts
  replaceAll(
    `(error)="course.anhUrl = '📚'"`,
    `(error)="imageError = true"`
  );
  replaceAll(
    `<span *ngIf="!course.anhUrl || !course.anhUrl.startsWith('http')" style="font-size: 64px">{{ course.anhUrl || '📚' }}</span>`,
    `<div *ngIf="!course.anhUrl || !course.anhUrl.startsWith('http') || imageError" style="font-size: 64px; display:flex; justify-content:center; align-items:center; height:100%"><i class="fa-solid fa-book"></i></div>`
  );
  if (content.includes('CourseDetailComponent implements OnInit {') && !content.includes('imageError = false;')) {
    replaceAll('export class CourseDetailComponent implements OnInit {', 'export class CourseDetailComponent implements OnInit {\\n  imageError = false;');
  }

  // Generic emoji replacement for remaining text emojis, but avoiding modifying inside single quotes like fallback values if we missed any
  for (const [emoji, tag] of Object.entries(emojiMap)) {
    if (content.includes(emoji)) {
      // Split by ' and check boundaries if necessary, but actually for simplicity we can just replace all.
      // But we must NOT replace '📦' because it will break angular syntax.
      // Let's replace only occurrences NOT surrounded by quotes.
      let parts = content.split("'");
      for (let i = 0; i < parts.length; i++) {
        // Even indices are OUTSIDE single quotes, odd indices are INSIDE single quotes.
        // Wait, what about double quotes? Similar logic.
        // Let's just avoid replacing '📦' exactly
        if (i % 2 === 0) {
          parts[i] = parts[i].split(emoji).join(tag);
        }
      }
      content = parts.join("'");
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
