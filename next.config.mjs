/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    myHost: "0.0.0.0",
    myPort: 4001
  },
  reactStrictMode: true,
  transpilePackages: ['primereact'],

  // output: 'export', // Static Build // HTML로 생성
  distDir: 'dist',
    // 비동기 함수로 rewrites를 설정합니다.
  async rewrites() {
    return [
      {
        // source: 이 경로로 들어오는 요청을
        source: '/api/:path*', // '/api/'로 시작하는 모든 경로를 의미합니다.
        // destination: 이 주소로 대신 보냅니다.
        destination: 'http://localhost:4000/api/:path*', // 실제 API 서버 주소
      },
    ];
  },
};

export default nextConfig;
