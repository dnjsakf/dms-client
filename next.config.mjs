/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    myHost: "0.0.0.0",
    myPort: 4001
  },
  reactStrictMode: true,
  transpilePackages: ['primereact'],
};

export default nextConfig;
