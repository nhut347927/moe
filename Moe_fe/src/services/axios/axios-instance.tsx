import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ENV } from "@/common/config/env";

// ✅ Cookie helpers
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

function setAccessTokenFe(token: string) {
  document.cookie = `accessToken_fe=${token}; path=/; secure; samesite=lax`;
}

const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
 // headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken_fe");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
   // console.log("✅ Response:", response.config?.url);
    return response;
  },
  async (error: AxiosError) => {
    console.warn("⚠️ Caught error:", error);

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Trường hợp không có response (CORS, lỗi mạng, ...)
    if (!error.response) {
      console.error("❌ No response from server. Check network or CORS.");
      return Promise.reject(error);
    }

    // Nếu lỗi 401 và chưa retry → gọi refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getCookie("refreshToken_fe");
        console.log("🔐 Refresh token:", refreshToken);

        if (!refreshToken) {
          throw new Error("❌ No refresh token in cookie");
        }

        const res = await axios.post(
          `${ENV.API_BASE_URL}auth/refresh-token`,
          { refreshToken: refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const newAccessToken = res.data?.data;
        if (newAccessToken) {
          setAccessTokenFe(newAccessToken);
          console.log("🔁 Retry original request:", originalRequest.url);
        }

        // Retry request với token mới
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh failed. Redirect to login.");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    // Nếu lỗi không phải 401 hoặc đã retry → reject
    return Promise.reject(error);
  }
);

export default axiosInstance;
