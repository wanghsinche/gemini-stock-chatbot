/** @type {import('next').NextConfig} */
import { config } from "dotenv";
import fs from 'fs';

if (fs.existsSync('.env.local')) {
  config({ path: ".env.local" });
}

const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000", // Allow local development
        "bookish-yodel-pjpprgg6q4wh7pg6-3000.app.github.dev" // Allow your Codespaces domain
      ]
    }
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
