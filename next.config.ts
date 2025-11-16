import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", // Cho phép mọi đường dẫn ảnh từ host này
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**", // Cho phép host dự phòng
      },
    ],
  },
};

export default nextConfig;
