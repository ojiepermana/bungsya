/**
 * Cross-module contracts shared by the whole app. Starter templates — use them
 * to keep response envelopes consistent across modules.
 *
 * Rule: shared/ must never import from modules/.
 */
export interface ApiResponse<T> {
  data: T;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}
