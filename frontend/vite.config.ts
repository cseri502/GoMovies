import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/movies': 'http://localhost:8080',
      '/uploads': 'http://localhost:8080'
    },
  },
});
