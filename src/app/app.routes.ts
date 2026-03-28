import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'course', loadComponent: () => import('./features/course-list/course-list.component').then(m => m.CourseListComponent) },
  { path: 'course/:id', loadComponent: () => import('./features/course-detail/course-detail.component').then(m => m.CourseDetailComponent) },
  { path: 'ai-recommendations', loadComponent: () => import('./features/ai-recommendations/ai-recommendations.component').then(m => m.AiRecommendationsComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'my-courses', loadComponent: () => import('./features/my-courses/my-courses.component').then(m => m.MyCoursesComponent) },
  { path: 'learn/:slug/lesson/:id', loadComponent: () => import('./features/learn/learn.component').then(m => m.LearnComponent) },
  { path: 'cart', loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'instructor/dashboard', loadComponent: () => import('./features/instructor/instructor-dashboard/instructor-dashboard.component').then(m => m.InstructorDashboardComponent) },
  { path: 'instructor/courses/create', loadComponent: () => import('./features/instructor/create-course/create-course.component').then(m => m.CreateCourseComponent) },
  { path: 'instructor/students', loadComponent: () => import('./features/instructor/students/students.component').then(m => m.InstructorStudentsComponent) },
  { path: 'admin/dashboard', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'admin/users', loadComponent: () => import('./features/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
  { path: 'admin/courses/approvals', loadComponent: () => import('./features/admin/admin-approvals/admin-approvals.component').then(m => m.AdminApprovalsComponent) },
  { path: 'admin/promotions', loadComponent: () => import('./features/admin/admin-promotions/admin-promotions.component').then(m => m.AdminPromotionsComponent) },
  { path: '**', redirectTo: '/home' },
];
