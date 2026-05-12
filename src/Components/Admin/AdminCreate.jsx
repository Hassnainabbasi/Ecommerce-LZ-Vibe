import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminCreate() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}api/admin/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Admin created successfully!");
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        toast.error(data.message || data.error || "Failed to create admin");
      }
    } catch (err) {
      console.error("Failed to create admin", err);
      toast.error("Failed to create admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
        Create New Admin
      </h1>

      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 lg:p-8 shadow-lg max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
              Admin Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 transition"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 transition"
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 transition"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Creating Admin..." : "Create Admin"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> The new admin will be able to access the admin panel and manage products, categories, and users.
          </p>
        </div>
      </div>
    </div>
  );
}

