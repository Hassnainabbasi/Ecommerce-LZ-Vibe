import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import AdminNavbar from './AdminNavbar';

export default function AdminPanel() {
  return (
    <div className="store-shell min-h-screen">
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 overflow-auto lg:ml-0 pt-16 lg:pt-0">
          <div className="min-h-full p-2 sm:p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
