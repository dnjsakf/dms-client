/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    myHost: "0.0.0.0",
    myPort: 4001
  },
  reactStrictMode: true,
  transpilePackages: ['primereact'],

  output: 'export', // Static Build
  distDir: 'dist',
};

export default nextConfig;
