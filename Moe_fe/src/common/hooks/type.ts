export interface ResponseAPI<T> {
  code: number;
  message: string;
  data: T | null;
  errors?: Record<string, string>;
}
export interface Page<T> {
  contents: T[];
  totalElements: Number;
  totalPages: Number;
  page: Number;
  size: Number;
  hasNext: boolean;
  hasPrevious: boolean;
}
