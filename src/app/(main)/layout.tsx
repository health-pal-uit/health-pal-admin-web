"use client";

import { Sidebar } from "@/src/components/UI/mainLayout/sidebar";
import { Toaster } from "react-hot-toast";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" />

      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-base-200">
          {children}
        </main>
      </div>
    </>
  );
}
