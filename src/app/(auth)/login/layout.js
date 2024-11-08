'use client';

import EmptyLayout from "@/components/layouts/EmptyLayout";

export default function LoginLayout ({ children }) {
  return (
    <EmptyLayout>
      { children }
    </EmptyLayout>
  );
}
