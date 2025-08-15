/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "@clerk/nextjs", "pusher-js"],
  },

  webpack: (config, { dev }) => {
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,

            clerk: {
              test: /[\\/]node_modules[\\/]@clerk[\\/]/,
              name: "clerk",
              chunks: "all",
              priority: 10,
            },

            pusher: {
              test: /[\\/]node_modules[\\/]pusher-js[\\/]/,
              name: "pusher",
              chunks: "async",
              priority: 8,
            },

            dateFns: {
              test: /[\\/]node_modules[\\/]date-fns[\\/]/,
              name: "date-fns",
              chunks: "all",
              priority: 7,
            },

            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 5,
            },
          },
        },
      };

      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },

  compress: true,

  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;
