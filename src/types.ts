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
