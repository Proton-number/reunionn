import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zkekgkqwibhroileoqvc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
