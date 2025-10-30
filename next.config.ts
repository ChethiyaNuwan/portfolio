import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  
  // Ensure NEXT_PUBLIC_* variables are available
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
    RESEND_API_KEY: process.env.RESEND_API_KEY || '',
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || '',
  },
};

export default nextConfig;
