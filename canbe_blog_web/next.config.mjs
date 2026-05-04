/** @type {import('next').NextConfig} */
const apiBaseUrl = process.env.BLOG_API_BASE_URL || "http://localhost:18080";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`
      },
      {
        source: "/uploads/:path*",
        destination: `${apiBaseUrl}/uploads/:path*`
      }
    ];
  }
};

export default nextConfig;
