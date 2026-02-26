export type Rating = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';

export interface StockTarget {
  id: string;
  name: string;
  category: string;
  tags: string[];
  rating: Rating;
  completion: number; // 0-100
  lastUpdateDate: string;
}

export type ContentType = 'text' | 'table' | 'chart';

export interface BaseContent {
  id: string;
  type: ContentType;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface TextContent extends BaseContent {
  type: 'text';
  content: string;
}

export interface TableCell {
  row: number;
  col: number;
  value: string;
}

export interface TableContent extends BaseContent {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface ChartContent extends BaseContent {
  type: 'chart';
  chartType: 'line' | 'bar' | 'pie' | 'scatter';
  data: any;
  option: any;
}

export type ContentItem = TextContent | TableContent | ChartContent;

export interface CategoryData {
  category: string;
  targets: StockTarget[];
  color: string;
}

export interface TargetContent {
  targetId: string;
  targetName: string;
  contents: ContentItem[];
}

export type SortType = 'rating' | 'completion' | 'category' | 'none';
export type SortOrder = 'asc' | 'desc';

export interface AppData {
  targets: StockTarget[];
  targetContents: TargetContent[];
}

export const RATING_ORDER: Record<Rating, number> = {
  'A+': 7,
  'A': 6,
  'B+': 5,
  'B': 4,
  'C+': 3,
  'C': 2,
  'D': 1,
};

export const CATEGORY_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
  '#6366F1', // indigo
  '#84CC16', // lime
];
