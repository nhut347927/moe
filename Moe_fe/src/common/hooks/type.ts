export interface ResponseAPI<T> {
  code: number;
  message: string;
  data: T;
  errors?: Record<string, string>;
}