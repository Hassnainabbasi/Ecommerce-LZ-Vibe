import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function AllAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editData, setEditData] = useState({ email: '', password: '' });

  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/all`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmins(data.admins || []);
      } else {
        toast.error(data.message || "Failed to fetch admins");
      }
    } catch (err) {
      console.error("Failed to fetch admins", err);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin._id);
    setEditData({
      email: admin.email || admin.username || '',
      password: '',
    });
  };

  const handleUpdate = async (adminId) => {
    if (!editData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      const updateData = {
        email: editData.email.trim(),
      };

      // Only include password if it's provided
      if (editData.password.trim()) {
        if (editData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
        updateData.password = editData.password.trim();
      }

      const res = await fetch(`${API_BASE}/api/admin/${adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Admin updated successfully!");
        setEditingAdmin(null);
        setEditData({ email: '', password: '' });
        fetchAdmins();
      } else {
        toast.error(data.message || "Failed to update admin");
      }
    } catch (err) {
      console.error("Failed to update admin", err);
      toast.error("Failed to update admin");
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/${adminId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Admin deleted successfully!");
        fetchAdmins();
      } else {
        toast.error(data.message || "Failed to delete admin");
      }
    } catch (err) {
      console.error("Failed to delete admin", err);
      toast.error("Failed to delete admin");
    }
  };

  if (loading) {
    return <div className="text-gray-800 p-4">Loading admins...</div>;
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          All Admins ({admins.length})
        </h1>
      </div>

      {admins.length > 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Created At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => {
                  const isEditing = editingAdmin === admin._id;
                  return (
                    <tr
                      key={admin._id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-800">{index + 1}</td>
                      <td className="px-6 py-4 text-gray-800">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-blue-500 w-full"
                          />
                        ) : (
                          admin.email || admin.username || 'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {admin.createdAt
                          ? new Date(admin.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <input
                              type="password"
                              value={editData.password}
                              onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                              placeholder="New password (optional)"
                              className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-blue-500 text-sm"
                            />
                            <button
                              onClick={() => handleUpdate(admin._id)}
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                            >
                              ✓ Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingAdmin(null);
                                setEditData({ email: '', password: '' });
                              }}
                              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(admin)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(admin._id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-200 rounded-lg p-8 text-center shadow-lg">
          <div className="text-4xl mb-4">👤</div>
          <p className="text-gray-600 text-lg">No admins found</p>
        </div>
      )}
    </div>
  );
}

