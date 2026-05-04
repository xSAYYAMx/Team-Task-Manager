import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ToastHost from "../components/ToastHost";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 bg-transparent px-6 py-8">
          <Outlet />
        </main>
      </div>
      <ToastHost />
    </div>
  );
}
