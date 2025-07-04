// hooks/useDeleteApi.ts
import { useState } from "react";
import axiosInstance from "@/services/axios/axios-instance";

export function useDeleteApi<T = any>(url: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (data: any): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(url, { data });
      return response.data.data;
    } catch (err: any) {
    const errorMessage =
      err.response?.data?.message ||
      "An error occurred while sending the DELETE request.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}
