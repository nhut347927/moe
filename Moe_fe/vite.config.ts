import path from "path";
import react from "@vitejs/plugin-react-swc"; // Đảm bảo cài đúng plugin này
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true, // hoặc '0.0.0.0'
  },
});
