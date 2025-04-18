import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation/Navigation";

export default function RootLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 overflow-y-auto ml-64">
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
