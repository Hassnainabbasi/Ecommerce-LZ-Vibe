import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/categories`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      } else {
        // If API doesn't exist, get categories from products
        const productsRes = await fetch(`${API_BASE}/products/getAllProducts`, {
          credentials: "include",
        });
        const productsData = await productsRes.json();
        if (productsData.success) {
          const uniqueCategories = [...new Set(productsData.products.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories.map(cat => ({ name: cat })));
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Category added successfully!");
        setNewCategory('');
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to add category");
      }
    } catch (err) {
      console.error("Failed to add category", err);
      toast.error("Failed to add category");
    }
  };

  const handleEditCategory = async (categoryId, newName) => {
    if (!newName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Category updated successfully!");
        setEditingCategory(null);
        setEditName('');
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (err) {
      console.error("Failed to update category", err);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/categories/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Category deleted successfully!");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Failed to delete category", err);
      toast.error("Failed to delete category");
    }
  };

  if (loading) {
    return <div className="text-gray-800 p-4">Loading categories...</div>;
  }

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
        Manage Categories
      </h1>

      {/* Add Category Form */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Categories</h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const categoryId = category._id || category.id || index;
              const categoryName = category.name || category;
              const isEditing = editingCategory === categoryId;

              return (
                <div
                  key={categoryId}
                  className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditCategory(categoryId, editName)}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setEditName('');
                        }}
                        className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{categoryName}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(categoryId);
                            setEditName(categoryName);
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(categoryId)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No categories found. Add your first category above!</p>
        )}
      </div>
    </div>
  );
}

