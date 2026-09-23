import type { NextConfig } from "next";

// Keep Turbopack's Rust-side thread pool tiny — the build runs on a
// resource-limited shared host (CloudLinux LVE) that has previously
// failed with "cagefs_enter: Unable to fork" under normal parallelism.
process.env.RAYON_NUM_THREADS ??= "1";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
