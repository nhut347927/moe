const getEnv = () => {
    const {
      VITE_APP_API_BASE_URL,
      VITE_APP_GOOGLE_CLIENT_ID,
    } = import.meta.env;
  
    if (!VITE_APP_API_BASE_URL || !VITE_APP_GOOGLE_CLIENT_ID) {
      throw new Error("Thiếu biến môi trường trong .env!");
    }
  
    return {
      API_BASE_URL: VITE_APP_API_BASE_URL,
      GOOGLE_CLIENT_ID: VITE_APP_GOOGLE_CLIENT_ID,
    };
  };
  
  export const ENV = getEnv();
  