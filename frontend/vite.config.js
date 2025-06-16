import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],

  server: {
    https: {
      rejectUnauthorized: false, // Only for development
    },
    cors: true,
    proxy: {
      "/api": {
        target: "http://192.168.100.25:5000",
        changeOrigin: true,
        secure: false, // This allows HTTP backend
      },
      "/backend": {
        target: "http://192.168.100.25:5000",
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxying
        rewrite: (path) => path.replace(/^\/backend/, ""), // removes /backend prefix
      },
      "/socket.io": {
        target: "http://192.168.100.25:5000",
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying
      },
      // Add this proxy rule for uploads
      "/uploads": {
        target: "http://192.168.100.25:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
