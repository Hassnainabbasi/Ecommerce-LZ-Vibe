import React, { useState, useEffect } from "react";
import {
  fetchDashboardStats,
  fetchAllOrders,
  fetchAllProducts,
} from "../../api";

function getLastMonths(count = 6) {
  const labels = [];
  const now = new Date();

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    labels.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
      month: date.getMonth(),
      total: 0,
      orders: 0,
    });
  }

  return labels;
}

function getProductStockQuantity(product) {
  const qty = product.stockQuantity ?? product.quantity ?? product.stock ?? 0;
  const parsed = Number(qty);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildMonthlySalesTimeline(orders) {
  const months = getLastMonths(6);

  orders.forEach((order) => {
    const createdAt = order.createdAt || order.date || order.createdAt?.$date;
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return;

    const target = months.find(
      (m) => m.year === date.getFullYear() && m.month === date.getMonth()
    );
    if (!target) return;

    const amount = Number(order.totalAmount ?? order.amount ?? 0);
    if (Number.isFinite(amount)) {
      target.total += amount;
    }
    target.orders += 1;
  });

  return months;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [statsData, orderData, productData] = await Promise.all([
        fetchDashboardStats(),
        fetchAllOrders(),
        fetchAllProducts(),
      ]);

      setStats(statsData);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setProducts(Array.isArray(productData) ? productData : []);
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
          <p className="text-lg font-black text-slate-900">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const salesTimeline = buildMonthlySalesTimeline(orders);
  const totalMonthlySales = salesTimeline.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const maxMonthlySales = Math.max(...salesTimeline.map((m) => m.total), 1);

  const inStockProducts = products.filter(
    (product) => getProductStockQuantity(product) > 0
  );
  const outOfStockProducts = products.filter(
    (product) => getProductStockQuantity(product) === 0
  );
  const lowStockProducts = products
    .filter((product) => {
      const qty = getProductStockQuantity(product);
      return qty > 0 && qty <= 5;
    })
    .sort((a, b) => getProductStockQuantity(a) - getProductStockQuantity(b));

  const displayedProductsCount = products.length || stats.totalProducts;

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-4 lg:p-6 text-gray-800">
      <div className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-red-900 to-red-600 p-6 text-white shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300">
          Admin dashboard
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight lg:text-4xl">
          Advanced Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          Monthly sales, stock availability, low-stock alerts, and recent order
          activity in one theme-ready admin panel.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6 mb-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                Sales summary
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Monthly sales
              </h2>
            </div>
            <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">
              {salesTimeline.length} months
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Total revenue</p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                Rs {totalMonthlySales.toLocaleString()}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-[0.18em]">Orders</p>
              <p className="mt-1 text-2xl font-black">{orders.length}</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-end gap-3 h-60">
              {salesTimeline.map((month) => {
                const height = Math.max(
                  (month.total / maxMonthlySales) * 100,
                  12
                );
                return (
                  <div key={month.key} className="flex-1 text-center">
                    <div className="mx-auto mb-2 h-[180px] w-full max-w-[60px] overflow-hidden rounded-3xl bg-slate-100">
                      <div
                        className="h-full w-full rounded-3xl bg-gradient-to-t from-red-600 to-red-300"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">
                      {month.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      Rs {Math.round(month.total).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Inventory signal
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Stock overview
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950 p-4 text-white">
                <p className="text-sm uppercase tracking-[0.14em] text-slate-300">
                  Products in stock
                </p>
                <p className="mt-3 text-3xl font-black">
                  {inStockProducts.length}
                </p>
              </div>
              <div className="rounded-3xl bg-red-50 p-4 text-red-700">
                <p className="text-sm uppercase tracking-[0.14em] text-red-500">
                  Out of stock
                </p>
                <p className="mt-3 text-3xl font-black">
                  {outOfStockProducts.length}
                </p>
              </div>
            </div>
            <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Low stock alert</p>
              <p className="mt-2">
                {lowStockProducts.length} product(s) are at or below 5 units.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Product catalogue
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Product stock details
            </h2>
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="rounded-3xl bg-slate-100 p-4">
                  <p className="font-semibold text-slate-900">Total products</p>
                  <p className="mt-2 text-2xl font-black">
                    {displayedProductsCount}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-4">
                  <p className="font-semibold text-slate-900">Tracked SKUs</p>
                  <p className="mt-2 text-2xl font-black">{products.length}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Latest stock updates
                </p>
                <ul className="mt-3 space-y-3">
                  {lowStockProducts.slice(0, 4).map((product) => (
                    <li
                      key={product._id}
                      className="rounded-2xl bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.category || "Uncategorized"} •{" "}
                            {product.sizes || "No sizes"} •{" "}
                            {product.colors || "No colors"}
                          </p>
                        </div>
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                          {getProductStockQuantity(product)} left
                        </span>
                      </div>
                    </li>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <li className="rounded-2xl bg-slate-50 p-3 text-slate-600">
                      All products have healthy stock levels.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-1">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                Order insights
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Recent orders
              </h2>
            </div>
            <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">
              Showing {currentOrders.length} of {orders.length}
            </span>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-3">
            <table className="table-auto w-full text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Items</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-slate-200 hover:bg-white"
                    >
                      <td className="px-4 py-3 text-slate-900">
                        {order.name || order.customerName || "Guest"}
                      </td>
                      <td className="px-4 py-3">
                        Rs{" "}
                        {Number(
                          order.totalAmount ?? order.amount ?? 0
                        ).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {order.cartItems?.length ?? 0}
                      </td>
                      <td className="px-4 py-3 uppercase text-xs tracking-[0.16em] text-slate-500">
                        {order.paymentMethod === "cod"
                          ? "COD"
                          : order.paymentMethod || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-500">
                      No recent orders available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-950 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-slate-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
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
    </div>
  );
}
