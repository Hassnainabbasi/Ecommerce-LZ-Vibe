import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


export default function Sidebar() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleLogout = async () => {
    try {

   await fetch(`${import.meta.env.VITE_API_BASE}/api/admin/logout`, {
       


        method: "POST",
        credentials: "include", // important for cookies
      });

      window.location.href = "/admin/login"; // redirect after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border-2 border-slate-200 text-gray-800 p-3 rounded-md shadow-lg"
      >
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r-2 border-slate-200 text-gray-800 transform transition-transform duration-300 ease-in-out shadow-lg
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <nav className="mt-6">
          <Link
            to="/admin"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-slate-100 hover:text-blue-600 transition-colors ${location.pathname === '/admin' ? 'bg-blue-600 text-white' : ''
              }`}
          >
            <i className="fas fa-tachometer-alt w-6 mr-3"></i>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/users"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-slate-100 hover:text-blue-600 transition-colors ${location.pathname === '/admin/users' ? 'bg-blue-600 text-white' : ''
              }`}
          >
            <i className="fas fa-users w-6 mr-3"></i>
            <span>Users</span>
          </Link>

          <Link
            to="/admin/all-products"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-slate-100 hover:text-blue-600 transition-colors ${location.pathname === '/admin/all-products' ? 'bg-blue-600 text-white' : ''
              }`}
          >
            <i className="fas fa-box w-6 mr-3"></i>
            <span>All Products</span>
          </Link>

          <Link
            to="/admin/add-product"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-slate-100 hover:text-blue-600 transition-colors ${location.pathname === '/admin/add-product' ? 'bg-blue-600 text-white' : ''
              }`}
          >
            <i className="fas fa-plus-circle w-6 mr-3"></i>
            <span>Add Product</span>
          </Link>

          <Link
            to="/admin/categories"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-slate-100 hover:text-blue-600 transition-colors ${location.pathname === '/admin/categories' ? 'bg-blue-600 text-white' : ''
              }`}
          >
            <i className="fas fa-tags w-6 mr-3"></i>
            <span>Categories</span>
          </Link>

          <Link
            to="/admin/create-admin"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-slate-100 hover:text-blue-600 transition-colors ${location.pathname === '/admin/create-admin' ? 'bg-blue-600 text-white' : ''
              }`}
          >
            <i className="fas fa-user-plus w-6 mr-3"></i>
            <span>Create Admin</span>
          </Link>

          <Link
            to="/admin/all-admins"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-slate-100 hover:text-blue-600 transition-colors ${location.pathname === '/admin/all-admins' ? 'bg-blue-600 text-white' : ''
              }`}
          >
            <i className="fas fa-users-cog w-6 mr-3"></i>
            <span>All Admins</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64">
          <div className="absolute bottom-0 w-64 p-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Icons Only) */}
      <div className="lg:hidden w-[100vw] h-[10vh] fixed bottom-0  left-0 right-0 z-10000 bg-white border-t-2 border-slate-200 text-gray-800 p-2 flex justify-center items-center shadow-lg">
        <Link
          to="/admin"
          className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-1 ${location.pathname === '/admin' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-slate-100'
            }`}
        >
          <i className="fas fa-tachometer-alt text-lg mb-1"></i>
          <span className="text-xs">Dashboard</span>
        </Link>

        <Link
          to="/admin/users"
          className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-1 ${location.pathname === '/admin/users' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-slate-100'
            }`}
        >
          <i className="fas fa-users text-lg mb-1"></i>
          <span className="text-xs">Users</span>
        </Link>

        <Link
          to="/admin/all-products"
          className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-1 ${location.pathname === '/admin/all-products' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-slate-100'
            }`}
        >
          <i className="fas fa-box text-lg mb-1"></i>
          <span className="text-xs">Products</span>
        </Link>

        <Link
          to="/admin/add-product"
          className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-1 ${location.pathname === '/admin/add-product' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-slate-100'
            }`}
        >
          <i className="fas fa-plus-circle text-lg mb-1"></i>
          <span className="text-xs">Add</span>
        </Link>

        <Link
          to="/admin/categories"
          className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-1 ${location.pathname === '/admin/categories' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-slate-100'
            }`}
        >
          <i className="fas fa-tags text-lg mb-1"></i>
          <span className="text-xs">Categories</span>
        </Link>
      </div>
    </>
  );
}