/** @type {import('next').NextConfig} */
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
