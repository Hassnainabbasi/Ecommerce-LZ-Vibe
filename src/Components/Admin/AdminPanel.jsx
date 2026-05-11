import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function AdminPanel() {
  return (
    <div className="flex h-screen bg-[radial-gradient(circle_at_top_left,rgba(254,226,226,0.75),transparent_28rem),linear-gradient(135deg,#fff7ed_0%,#f8fafc_45%,#fff_100%)]">
      <Sidebar />
      <div className="flex-1 overflow-auto lg:ml-0 pt-16 lg:pt-0">
        <div className="min-h-full p-2 sm:p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
