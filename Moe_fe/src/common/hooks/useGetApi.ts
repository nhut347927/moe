import { useState, useEffect } from "react";
import axiosInstance from "@/services/axios/axios-instance";
import { ResponseAPI } from "./type";



interface UseGetApiProps<T> {
  endpoint: string;
  params?: any;
  onSuccess?: (data: T) => void;
  onError?: (error: ResponseAPI<T> | null) => void;
  enabled?: boolean; // để có thể bật/tắt auto fetch
}

export function useGetApi<T>({
  endpoint,
  params,
  onSuccess,
  onError,
  enabled = true,
}: UseGetApiProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ResponseAPI<T> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get<ResponseAPI<T>>(endpoint, { params });
        if (res.data.code === 200) {
          setData(res.data.data);
          onSuccess && onSuccess(res.data.data);
        } else {
          setError(res.data);
          onError && onError(res.data);
        }
      } catch (e: any) {
        setError({
          code: 500,
          message: e.message,
          data: null as any,
          errors: {},
        });
        onError && onError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(params), enabled]); // note: stringify params để so sánh

  return { data, loading, error };
}
