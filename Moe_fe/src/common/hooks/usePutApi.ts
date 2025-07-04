// hooks/usePutApi.ts
import { useState } from "react";
import axiosInstance from "@/services/axios/axios-instance";

export function usePutApi<T = any>(url: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const put = async (data: any): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(url, data);
      return response.data.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Đã xảy ra lỗi khi gửi yêu cầu PUT.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { put, loading, error };
}
