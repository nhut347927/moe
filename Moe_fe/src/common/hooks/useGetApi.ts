import { useState, useEffect } from "react";
import axiosInstance from "@/services/axios/AxiosInstance";
import { ResponseAPI } from "./type";

interface UseGetApiProps<T> {
  endpoint: string;
  params?: Record<string, any>;
  onSuccess?: (data: T | null) => void;
  onError?: (error: ResponseAPI<T>) => void;
  enabled?: boolean;
}

interface UseGetApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: ResponseAPI<T> | null;
  refetch: () => void;
}

export function useGetApi<T>({
  endpoint,
  params,
  onSuccess,
  onError,
  enabled = true,
}: UseGetApiProps<T>): UseGetApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ResponseAPI<T> | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<ResponseAPI<T>>(endpoint, { params });
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
        message:
          e.response?.data?.message || "An error occurred while fetching data",
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

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [endpoint, JSON.stringify(params), enabled]);

  return { data, loading, error, refetch: fetchData };
}
