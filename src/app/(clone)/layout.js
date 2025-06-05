'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MainLayout from "@/components/layouts/MainLayout";

export default function RootLayout({ children }) {
  return (
    <DndProvider backend={ HTML5Backend }>
      <MainLayout>
        { children }
      </MainLayout>
    </DndProvider>
  );
}
