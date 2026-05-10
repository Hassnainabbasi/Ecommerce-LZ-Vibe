import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AddProducts() {
  const navigate = useNavigate(); // ✅ ADD THIS
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    weight: "",
    flavor: "",
    image: null,
  });
  const [loading, setLoading] = useState(false); // ✅ ADD LOADING STATE
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.log("No token found, redirect to login");
      navigate("/admin-login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        console.log("Admin verified:", res.data);
      })
      .catch((err) => {
        console.error("Verification failed:", err.response?.data);
        navigate("/admin-login");
      });

    // Fetch categories
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const API_BASE = import.meta.env.VITE_API_BASE;
      
      // Try to fetch from categories API
      try {
        const res = await fetch(`${API_BASE}/api/categories`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories.map(cat => cat.name || cat));
          setLoadingCategories(false);
          return;
        }
      } catch (err) {
        console.log("Categories API not available, fetching from products");
      }

      // Fallback: Get categories from products
      const productsRes = await fetch(`${API_BASE}/products/getAllProducts`, {
        credentials: "include",
      });
      const productsData = await productsRes.json();
      if (productsData.success && productsData.products) {
        const uniqueCategories = [...new Set(productsData.products.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories.sort());
      } else if (Array.isArray(productsData)) {
        const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories.sort());
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
      // Set default categories as fallback
      setCategories(["protein", "creatine", "preworkout", "weightgainer", "vitamins and minerals", "amino acid"]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ VALIDATION
    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Name, Category, and Price are required!");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Admin token missing. Please login again.");
      navigate("/admin-login");
      return;
    }

    setLoading(true); // ✅ START LOADING

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("weight", formData.weight || "");
      data.append("flavor", formData.flavor || "");
      if (formData.image) {
        data.append("image", formData.image);
      }

      console.log("Sending data:", {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        hasImage: !!formData.image,
      });

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/products`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Response:", res.data);
      toast.success("Product added successfully!");
      
      // ✅ RESET FORM
      setFormData({
        name: "",
        category: "",
        price: "",
        weight: "",
        flavor: "",
        image: null,
      });
      
      // ✅ RESET FILE INPUT
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Error adding product";
      toast.error(errorMsg);
    } finally {
      setLoading(false); // ✅ STOP LOADING
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-6">
        Add New Product
      </h1>
      <div className="bg-white border-2 border-slate-200 rounded-lg p-4 lg:p-6 text-gray-800 shadow-lg max-w-2xl mx-auto">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Product Name */}
          <div>
            <label className="block text-sm lg:text-base font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-800"
              placeholder="Enter product name"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm lg:text-base font-medium mb-2">
              Category *
            </label>
            {loadingCategories ? (
              <div className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md text-gray-600">
                Loading categories...
              </div>
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-800"
              >
                <option value="">Select Category</option>
                {categories.length > 0 ? (
                  categories.map((category, index) => {
                    const categoryName = typeof category === 'string' ? category : (category.name || category);
                    return (
                      <option key={index} value={categoryName}>
                        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="protein">Protein</option>
                    <option value="creatine">Creatine</option>
                    <option value="preworkout">Pre Workout</option>
                    <option value="weightgainer">Weight Gainer</option>
                    <option value="vitamins and minerals">Vitamin and Minerals</option>
                    <option value="amino acid">Amino Acid</option>
                  </>
                )}
              </select>
            )}
            {categories.length === 0 && !loadingCategories && (
              <p className="text-xs text-gray-500 mt-1">
                No categories found. Add categories from Categories page.
              </p>
            )}
          </div>

          {/* Price & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm lg:text-base font-medium mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-800"
                placeholder="Enter price"
              />
            </div>
            {/* <div>
              <label className="block text-sm lg:text-base font-medium mb-2">
                Weight
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-800"
                placeholder="e.g., 2kg, 500g"
              />
            </div> */}
          </div>

          {/* Flavor */}
          {/* <div>
            <label className="block text-sm lg:text-base font-medium mb-2">
              Flavor
            </label>
            <input
              type="text"
              name="flavor"
              value={formData.flavor}
              onChange={handleChange}
              className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-800"
              placeholder="Enter flavor"
            />
          </div> */}

          {/* Image */}
          <div>
            <label className="block text-sm lg:text-base font-medium mb-2">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="w-full px-3 lg:px-4 py-2 text-sm cursor-pointer lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-800"
            />
            {formData.image && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Selected: {formData.image.name}</p>
                <img 
                  src={URL.createObjectURL(formData.image)} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-slate-200"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors text-sm lg:text-base disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}