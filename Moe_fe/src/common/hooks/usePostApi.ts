import { useState } from "react";
import axiosInstance from "@/services/axios/axios-instance";
import { ResponseAPI } from "./type";

interface UsePostApiReturn<T> {
  callApi: (data?: any) => Promise<ResponseAPI<T> | null>;
  loading: boolean;
  error: ResponseAPI<T> | null;
}

export function usePostApi<T>(endpoint: string): UsePostApiReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ResponseAPI<T> | null>(null);

  const callApi = async (data?: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post<ResponseAPI<T>>(endpoint, data);
      if (res.data.code === 200) {
        return res.data;
      } else {
        setError(res.data);
        return res.data;
      }
    } catch (e: any) {
      setError({
        code: 500,
        message: e.message,
        data: null as any,
        errors: {},
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error };
}
