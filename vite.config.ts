
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// Function to check if certificate files exist
const certificatesExist = () => {
  try {
    return fs.existsSync('certificates/key.pem') && fs.existsSync('certificates/cert.pem');
  } catch (error) {
    return false;
  }
};

// Configure HTTPS only if certificates exist
const getHttpsConfig = (mode: string) => {
  if (mode === 'development' && certificatesExist()) {
    return {
      key: fs.readFileSync('certificates/key.pem'),
      cert: fs.readFileSync('certificates/cert.pem'),
    };
  }
  return undefined;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    https: getHttpsConfig(mode),
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
