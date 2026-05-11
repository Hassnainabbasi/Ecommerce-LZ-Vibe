import React, { useState, useEffect } from 'react';
import { fetchDashboardStats, fetchAllOrders } from '../../api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const data = await fetchDashboardStats();
      setStats(data);

      const orderData = await fetchAllOrders();
      setOrders(orderData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center p-6 text-center">
        <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
          <p className="text-lg font-black text-slate-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-4 lg:p-6 text-gray-800">
      <div className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-red-900 to-red-600 p-6 text-white shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300">Admin dashboard</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight lg:text-4xl">Dashboard Overview</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          Track catalogue, users, orders, and real offer performance from one premium control panel.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 lg:p-6 text-slate-950 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="bg-red-600 p-3 rounded-2xl mr-3 lg:mr-4 shadow-lg shadow-red-600/20">
              <i className="fas fa-users text-white text-xl lg:text-2xl"></i>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold">
                {stats.totalUsers.toLocaleString()}
              </p>
              <p className="text-sm lg:text-base font-medium">Total Users</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 lg:p-6 text-slate-950 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="bg-yellow-400 p-3 rounded-2xl mr-3 lg:mr-4 shadow-lg shadow-yellow-400/20">
              <i className="fas fa-shopping-cart text-white text-xl lg:text-2xl"></i>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold">
                {stats.totalOrders.toLocaleString()}
              </p>
              <p className="text-sm lg:text-base font-medium">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 lg:p-6 text-slate-950 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="bg-slate-950 p-3 rounded-2xl mr-3 lg:mr-4 shadow-lg shadow-slate-950/20">
              <i className="fas fa-box text-white text-xl lg:text-2xl"></i>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold">
                {stats.totalProducts.toLocaleString()}
              </p>
              <p className="text-sm lg:text-base font-medium">Total Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">Recent activity</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Recent Orders</h2>
        </div>
        <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">
          {orders.length} total
        </span>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="bg-slate-950 text-white">
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Total Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Cart Items</th>
              <th className="px-4 py-2 text-left">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? currentOrders.map((order) => (
              <tr key={order._id} className="border-b border-slate-100 hover:bg-red-50/40">
                <td className="px-4 py-2">{order.name}</td>
                <td className="px-4 py-2">{order.email}</td>
                <td className="px-4 py-2">{order.phone}</td>
                <td className="px-4 py-2">{order.address}</td>
                <td className="px-4 py-2">Rs {order.totalAmount}</td>
                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {order.cartItems && order.cartItems.length > 0 ? (
                    order.cartItems.map((item, index) => (
                      <div key={index}>
                        <strong>{item.name}</strong> (x{item.count}) - Rs {item.price}
                      </div>
                    ))
                  ) : (
                    "No items"
                  )}
                </td>
                <td className="px-4 py-2">{order.paymentMethod == "cod" ? "Cash on Delivery" : order.paymentMethod}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-600">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-950 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-950 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
