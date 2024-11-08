import MainLayout from "@/components/layouts/MainLayout";

// app/not-found.js
export default function Custom404() {
  return (
    <MainLayout>
      <div>
        <h1>404 - 페이지를 찾을 수 없습니다</h1>
        <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
      </div>
    </MainLayout>
  );
}