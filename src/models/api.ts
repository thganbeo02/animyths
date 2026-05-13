export type ApiResponse<T> = { success: true; data: T } | { success: false; error: ApiError };

export type ApiErrorCode =
  | 'network' // No connection/timeout
  | 'unauthorized' // 401 - token expired
  | 'forbidden' // 403 - RLS denied or insufficient role
  | 'not_found' // 404
  | 'validation' // 400 - bad input
  | 'rate_limited' // 429
  | 'server' // 5xx
  | 'unknown';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  cursor: string | null;
  hasMore: boolean;
}
