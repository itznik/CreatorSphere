/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Whenever the frontend calls /api/...
        source: '/api/:path*',
        // Next.js will silently forward it to your Express backend
        destination: 'http://localhost:5000/api/:path*', 
      },
    ];
  },
};

export default nextConfig;
