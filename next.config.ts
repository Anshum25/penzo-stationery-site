import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client", "libsql"],
  // Ship the read-only demo database with every server function (used until Turso is connected).
  outputFileTracingIncludes: { "/**": ["./demo/penzo-demo.db"] },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
