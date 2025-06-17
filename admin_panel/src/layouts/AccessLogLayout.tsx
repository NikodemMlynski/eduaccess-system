import { Outlet } from "react-router-dom";
import AccessLogNavigation from "@/components/Navigation/AccessLogNavigation.tsx";

export default function AccessLogLayout() {
  return (
    <div className="flex-col m-0 p-0">
      <AccessLogNavigation />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
