export interface ApiPagination {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ApiMetadata {
  durationMs: number;
  version: string;
  cacheHit: boolean;
  pagination: ApiPagination | null;
  warnings: string[];
}

export interface ApiResponse<T> {
  code: number;
  status: 'success' | 'error' | 'warning';
  messages: string[];
  data: T;
  meta: ApiMetadata;
}
