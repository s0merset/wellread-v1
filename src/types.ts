export type NavPage = 'Home' | 'Discover' | 'Lists' | 'Tracker' | 'Profile';

export interface Book {
  title: string;
  author: string;
  coverUrl: string;
  progress?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface Stat {
  icon: string;
  value: string | number;
  label: string;
  color: 'blue' | 'yellow' | 'green' | 'purple';
}

export interface ReadingProgress {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  currentPage: number;
  totalPages: number;
  color?: string; // For the progress bar color
}

export interface ReadingList {
  id: string;
  title: string;
  bookCount: number;
  updatedAt: string;
  covers: string[];
  isPublic: boolean;
  tags: string[];
}

export interface RecommendedBook {
  title: string;
  author: string;
  reason: string;
  tags: string[];
  cover?: string;
}

export interface GroqResponse {
  books: RecommendedBook[];
}
