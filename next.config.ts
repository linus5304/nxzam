import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
    // dynamicIO: true,
    // authInterrupts: true,
    reactCompiler: true,
  },
};

export default nextConfig;
