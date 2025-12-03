"use client";

import React from "react";
import { Sidebar, Header, SidebarProvider, useSidebar } from "./Navigation";

function LayoutContent({
  children,
  fullHeight,
}: {
  children: React.ReactNode;
  fullHeight?: boolean;
}) {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header />
        {fullHeight ? (
          <main className="h-[calc(100vh-64px)] flex">{children}</main>
        ) : (
          <main className="p-6">{children}</main>
        )}
      </div>
    </div>
  );
}

export function AppLayout({
  children,
  fullHeight,
}: {
  children: React.ReactNode;
  fullHeight?: boolean;
}) {
  return (
    <SidebarProvider>
      <LayoutContent fullHeight={fullHeight}>{children}</LayoutContent>
    </SidebarProvider>
  );
}
