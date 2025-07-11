import { useState } from "react";
import axiosInstance from "@/services/axios/AxiosInstance";
import { ResponseAPI } from "./type";

interface UsePutApiProps<T> {
  endpoint: string;
  params?: Record<string, any>;
  onSuccess?: (data: T | null) => void;
  onError?: (error: ResponseAPI<T>) => void;
}

interface UsePutApiReturn<T> {
  put: (data: any) => Promise<ResponseAPI<T>>;
  data: T | null;
  loading: boolean;
  error: ResponseAPI<T> | null;
}

export function usePutApi<T>({
  endpoint,
  params,
  onSuccess,
  onError,
}: UsePutApiProps<T>): UsePutApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ResponseAPI<T> | null>(null);

  const put = async (body: any): Promise<ResponseAPI<T>> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.put<ResponseAPI<T>>(endpoint, body, { params });
      if (res.data.code === 200) {
        setData(res.data.data);
        onSuccess?.(res.data.data);
      } else {
        setError(res.data);
        onError?.(res.data);
      }
      return res.data;
    } catch (e: any) {
      const errorResponse: ResponseAPI<T> = {
        code: e.response?.data?.code || 500,
        message: e.response?.data?.message || "An error occurred while updating data",
        data: null,
        errors: e.response?.data?.errors || {},
      };
      setError(errorResponse);
      onError?.(errorResponse);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  return { put, data, loading, error };
}