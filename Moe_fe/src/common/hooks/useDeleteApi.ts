import { useState } from "react";
import axiosInstance from "@/services/axios/AxiosInstance";
import { ResponseAPI } from "./type";

interface UseDeleteApiProps<T> {
  endpoint: string;
  params?: Record<string, any>;
  onSuccess?: (data: T| null) => void;
  onError?: (error: ResponseAPI<T>) => void;
}

interface UseDeleteApiReturn<T> {
  remove: (data?: any) => Promise<ResponseAPI<T>>;
  data: T | null;
  loading: boolean;
  error: ResponseAPI<T> | null;
}

export function useDeleteApi<T>({
  endpoint,
  params,
  onSuccess,
  onError,
}: UseDeleteApiProps<T>): UseDeleteApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ResponseAPI<T> | null>(null);

  const remove = async (body?: any): Promise<ResponseAPI<T>> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.delete<ResponseAPI<T>>(endpoint, { data: body, params });
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
        message: e.response?.data?.message || "An error occurred while deleting data",
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

  return { remove, data, loading, error };
}