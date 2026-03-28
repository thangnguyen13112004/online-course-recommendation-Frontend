export interface Course {
  id: number;
  title: string;
  slug: string;
  instructor: string;
  rating: number;
  reviewCount: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  level: string;
  aiMatch?: number;
  aiReason?: string;
  hours?: number;
  modules?: number;
  students?: number;
  year?: number;
  description?: string;
  source?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  initials: string;
  color: string;
  joinDate: string;
  status: 'active' | 'inactive';
  coursesCount: number;
  rating?: number;
}

export interface CartItem {
  course: Course;
  quantity: number;
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  current?: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Promotion {
  id: number;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  condition: string;
  usedCount: number;
  expiryDate: string;
  status: 'active' | 'expired';
}

export interface EnrolledCourse {
  course: Course;
  progress: number;
  modules: number;
}

export interface Certificate {
  id: number;
  courseName: string;
  source: string;
  date: string;
}
