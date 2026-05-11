import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { toast } from "react-hot-toast";

import getImageUrl from "../../utils/imageHelper";
import { getProductOffer } from "../../utils/offerHelpers";
export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: "",
    name: "",
    price: "",
    category: "",
    image: "",
    flavor: "",
    weight: "",
    compareAtPrice: "",
    discountPercent: "",
    isWeeklyOffer: false,
    offerLabel: "",
    offerEndsAt: "",
    isFeatured: false,
    imageFile: null,
  });


  const API_BASE = import.meta.env.VITE_API_BASE;



 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/getAllProducts`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setProducts(data.products);
      else toast.error("Failed to fetch products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openEditModal = (product) => {
    setCurrentProduct({
      _id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      flavor: Array.isArray(product.flavor) ? product.flavor.join(", ") : product.flavor || "",
      weight: product.weight || "",
      compareAtPrice: product.compareAtPrice || "",
      discountPercent: product.discountPercent || "",
      isWeeklyOffer: Boolean(product.isWeeklyOffer),
      offerLabel: product.offerLabel || "",
      offerEndsAt: product.offerEndsAt ? String(product.offerEndsAt).slice(0, 10) : "",
      isFeatured: Boolean(product.isFeatured),
      image: product.image || "",
      imageFile: null,
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", currentProduct.name);
      formData.append("price", Number(currentProduct.price));
      formData.append("category", currentProduct.category);
       formData.append("flavor", currentProduct.flavor);
       formData.append("weight", currentProduct.weight);
      formData.append("compareAtPrice", currentProduct.compareAtPrice || "");
      formData.append("discountPercent", currentProduct.discountPercent || "");
      formData.append("isWeeklyOffer", String(currentProduct.isWeeklyOffer));
      formData.append("offerLabel", currentProduct.offerLabel || "");
      formData.append("offerEndsAt", currentProduct.offerEndsAt || "");
      formData.append("isFeatured", String(currentProduct.isFeatured));
      if (currentProduct.imageFile) formData.append("image", currentProduct.imageFile);

      const res = await fetch(`${API_BASE}/products/${currentProduct._id}`, {
        method: "PUT",
        body: formData,
        credentials: "include", // ✅ Send HTTP-only cookie
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Product updated successfully!");
        fetchProducts();
        setIsModalOpen(false);
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        credentials: "include", // ✅ Send HTTP-only cookie
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-gray-800 p-4">Loading...</div>;

  return (
    <div className="p-4 lg:p-6">
      {/* Header & Search */}
      <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-slate-950 via-red-900 to-red-600 p-6 text-white shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300">Offer manager</p>
        <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight">All Products</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Edit prices, real discount badges, weekly offers, featured status, and catalogue data.
            </p>
          </div>
        <div className="bg-white/95 border border-white/20 rounded-full px-10 relative w-full sm:w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 py-2 rounded-full w-full text-gray-800 focus:outline-none "
          />
        </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const offer = getProductOffer(product);
            return (
              <div key={product._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-gray-800 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl">
                <div className="relative bg-slate-100">
                  {offer.hasOffer && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                      {offer.discountPercent ? `${offer.discountPercent}% OFF` : offer.label}
                    </span>
                  )}
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="mx-auto h-44 w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 min-h-[56px] text-lg font-black text-slate-950">{product.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-gray-500">Category: {product.category}</p>
                  <div className="my-3 flex flex-wrap items-baseline gap-2">
                    <p className="text-xl font-black text-red-600">Rs {Number(product.price || 0).toLocaleString()}</p>
                    {offer.hasOffer && offer.compareAtPrice > Number(product.price || 0) && (
                      <p className="text-sm font-bold text-slate-400 line-through">
                        Rs {offer.compareAtPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => openEditModal(product)}
                      className="bg-slate-950 hover:bg-red-700 text-white flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-800 col-span-full bg-white border-2 border-slate-200 rounded-lg p-6 text-center">No matching products found.</div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white">Edit Product</DialogTitle>
            <DialogDescription className="text-sm text-white/70">Update product details below</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <Input
              value={currentProduct.name}
              onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
              placeholder="Name"
            />
            <Input
              value={currentProduct.price}
              type="number"
              onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
              placeholder="Price"
            />
            <Input
              value={currentProduct.category}
              onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
              placeholder="Category"
            />
     {/* <Input
              value={currentProduct.flavor}
              onChange={(e) => setCurrentProduct({ ...currentProduct, flavor: e.target.value })}
              placeholder="flavor"
            />
              <Input
              value={currentProduct.weight}
              onChange={(e) => setCurrentProduct({ ...currentProduct, weight: e.target.value })}
              placeholder="weight"
            /> */}
            <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-red-600">
                Offer settings
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  value={currentProduct.compareAtPrice}
                  type="number"
                  onChange={(e) => setCurrentProduct({ ...currentProduct, compareAtPrice: e.target.value })}
                  placeholder="Compare at price"
                />
                <Input
                  value={currentProduct.discountPercent}
                  type="number"
                  onChange={(e) => setCurrentProduct({ ...currentProduct, discountPercent: e.target.value })}
                  placeholder="Discount %"
                />
                <Input
                  value={currentProduct.offerLabel}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, offerLabel: e.target.value })}
                  placeholder="Offer label"
                />
                <Input
                  value={currentProduct.offerEndsAt}
                  type="date"
                  onChange={(e) => setCurrentProduct({ ...currentProduct, offerEndsAt: e.target.value })}
                />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black">
                  <input
                    type="checkbox"
                    checked={currentProduct.isWeeklyOffer}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isWeeklyOffer: e.target.checked })}
                    className="h-4 w-4 accent-red-600"
                  />
                  Weekly offer
                </label>
                <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black">
                  <input
                    type="checkbox"
                    checked={currentProduct.isFeatured}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isFeatured: e.target.checked })}
                    className="h-4 w-4 accent-red-600"
                  />
                  Featured
                </label>
              </div>
            </div>
            <div>
              <label className="block text-white mb-1 text-sm font-semibold">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCurrentProduct({ ...currentProduct, imageFile: e.target.files[0] })}
                className="w-full text-black"
              />
              {currentProduct.imageFile ? (
                <img
                  src={URL.createObjectURL(currentProduct.imageFile)}
                  alt="Preview"
                  className="mt-2"
                  style={{ width: "150px", height: "150px", objectFit: "contain", borderRadius: "8px" }}
                />
              ) : currentProduct.image ? (
                <img
                  src={getImageUrl(currentProduct.image) + "?t=" + Date.now()}
                  alt="Current"
                  className="mt-2 w-[150px] h=[150px] object-contain rounded-[8px]"
                />
              ) : null}
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
