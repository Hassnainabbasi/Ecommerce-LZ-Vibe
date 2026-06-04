import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import axios from "axios";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

const BULK_PRODUCT_CHUNK = 500;

function normProductHeader(k) {
  return String(k).toLowerCase().replace(/\s+/g, "").replace(/_/g, "");
}

function findCellRaw(row, preferredHeaders) {
  if (!row || typeof row !== "object") return undefined;
  for (const want of preferredHeaders) {
    const w = normProductHeader(want);
    for (const [k, v] of Object.entries(row)) {
      if (normProductHeader(k) === w) {
        if (v === "" || v == null) continue;
        return v;
      }
    }
  }
  return undefined;
}

/** One product row for `POST /products/bulk-import` (Excel / CSV header row). */
function rowToBulkProduct(row) {
  const nameRaw = findCellRaw(row, [
    "name",
    "product name",
    "productname",
    "title",
  ]);
  const categoryRaw = findCellRaw(row, ["category"]);
  const priceRaw = findCellRaw(row, ["price", "amount"]);
  const weightRaw = findCellRaw(row, ["weight"]);
  const flavorRaw = findCellRaw(row, ["flavor", "flavours", "flavors"]);
  const sizeRaw = findCellRaw(row, [
    "size",
    "sizes",
    "available size",
    "available sizes",
  ]);
  const colorRaw = findCellRaw(row, [
    "color",
    "colors",
    "available color",
    "available colors",
  ]);
  const stockQtyRaw = findCellRaw(row, [
    "stockquantity",
    "stock quantity",
    "quantity",
    "qty",
    "stock",
    "available stock",
  ]);
  const imageRaw = findCellRaw(row, ["image", "image url", "imageurl"]);
  const productIdRaw = findCellRaw(row, ["productid", "product id", "sku"]);
  const compareAtPriceRaw = findCellRaw(row, [
    "compareatprice",
    "compare at price",
    "oldprice",
    "mrp",
  ]);
  const discountPercentRaw = findCellRaw(row, [
    "discountpercent",
    "discount percent",
    "discount",
  ]);
  const isWeeklyOfferRaw = findCellRaw(row, [
    "isweeklyoffer",
    "weekly offer",
    "weeklyoffer",
  ]);
  const offerLabelRaw = findCellRaw(row, [
    "offerlabel",
    "offer label",
    "badge",
  ]);
  const offerEndsAtRaw = findCellRaw(row, [
    "offerendsat",
    "offer ends at",
    "valid till",
  ]);
  const isFeaturedRaw = findCellRaw(row, ["isfeatured", "featured"]);

  const name = nameRaw != null ? String(nameRaw).trim() : "";
  const category = categoryRaw != null ? String(categoryRaw).trim() : "";
  let price;
  if (typeof priceRaw === "number" && Number.isFinite(priceRaw)) {
    price = priceRaw;
  } else {
    price = parseFloat(String(priceRaw ?? "").replace(/,/g, ""));
  }
  const weight = weightRaw != null ? String(weightRaw).trim() : "";
  let flavor = "";
  if (Array.isArray(flavorRaw)) {
    flavor = flavorRaw
      .map((x) => String(x).trim())
      .filter(Boolean)
      .join(", ");
  } else if (flavorRaw != null) {
    flavor = String(flavorRaw).trim();
  }
  let sizes = "";
  if (Array.isArray(sizeRaw)) {
    sizes = sizeRaw
      .map((x) => String(x).trim())
      .filter(Boolean)
      .join(", ");
  } else if (sizeRaw != null) {
    sizes = String(sizeRaw).trim();
  }
  let colors = "";
  if (Array.isArray(colorRaw)) {
    colors = colorRaw
      .map((x) => String(x).trim())
      .filter(Boolean)
      .join(", ");
  } else if (colorRaw != null) {
    colors = String(colorRaw).trim();
  }
  let stockQuantity = 0;
  if (stockQtyRaw != null && String(stockQtyRaw).trim() !== "") {
    const asNumber = Number(String(stockQtyRaw).replace(/,/g, ""));
    stockQuantity = Number.isFinite(asNumber) ? asNumber : 0;
  }
  const image = imageRaw != null ? String(imageRaw).trim() : "";
  const productId = productIdRaw != null ? String(productIdRaw).trim() : "";
  const compareAtPrice = parseFloat(
    String(compareAtPriceRaw ?? "").replace(/,/g, "")
  );
  const discountPercent = parseFloat(
    String(discountPercentRaw ?? "").replace(/,/g, "")
  );
  const isTruthy = (value) =>
    ["true", "1", "yes", "y"].includes(
      String(value ?? "")
        .trim()
        .toLowerCase()
    );
  const offerLabel = offerLabelRaw != null ? String(offerLabelRaw).trim() : "";
  const offerEndsAt =
    offerEndsAtRaw != null ? String(offerEndsAtRaw).trim() : "";

  if (!name || !category || !Number.isFinite(price) || price <= 0) return null;
  const p = { name, category, price, weight, flavor };
  if (sizes) p.sizes = sizes;
  if (colors) p.colors = colors;
  if (stockQtyRaw != null && String(stockQtyRaw).trim() !== "")
    p.stockQuantity = stockQuantity;
  if (image) p.image = image;
  if (productId) p.productId = productId;
  if (Number.isFinite(compareAtPrice) && compareAtPrice > 0)
    p.compareAtPrice = compareAtPrice;
  if (Number.isFinite(discountPercent) && discountPercent > 0)
    p.discountPercent = discountPercent;
  if (isWeeklyOfferRaw != null) p.isWeeklyOffer = isTruthy(isWeeklyOfferRaw);
  if (offerLabel) p.offerLabel = offerLabel;
  if (offerEndsAt) p.offerEndsAt = offerEndsAt;
  if (isFeaturedRaw != null) p.isFeatured = isTruthy(isFeaturedRaw);
  return p;
}

export default function AddProducts() {
  const navigate = useNavigate(); // ✅ ADD THIS
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    weight: "",
    flavor: "",
    sizes: "",
    colors: "",
    stockQuantity: "",
    compareAtPrice: "",
    discountPercent: "",
    isWeeklyOffer: false,
    offerLabel: "",
    offerEndsAt: "",
    isFeatured: false,
    images: [],
  });
  const [loading, setLoading] = useState(false); // ✅ ADD LOADING STATE
  const [bulkImporting, setBulkImporting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const bulkFileRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.log("No token found, redirect to login");
      navigate("/admin/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then(() => {
        // verification succeeded; keep quiet in production
        console.debug("Admin verified");
      })
      .catch(() => {
        // show a single user-facing message and redirect to login
        toast.error("Admin verification failed — please login.");
        navigate("/admin/login");
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
          setCategories(data.categories.map((cat) => cat.name || cat));
          setLoadingCategories(false);
          return;
        }
      } catch {
        // the categories API is optional; fallback will use products list
        console.debug("Categories API not available, fetching from products");
      }

      // Fallback: Get categories from products
      const productsRes = await fetch(`${API_BASE}/products/getAllProducts`, {
        credentials: "include",
      });
      const productsData = await productsRes.json();
      if (productsData.success && productsData.products) {
        const uniqueCategories = [
          ...new Set(
            productsData.products.map((p) => p.category).filter(Boolean)
          ),
        ];
        setCategories(uniqueCategories.sort());
      } else if (Array.isArray(productsData)) {
        const uniqueCategories = [
          ...new Set(productsData.map((p) => p.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories.sort());
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
      // Set default categories as fallback
      setCategories([
        "protein",
        "creatine",
        "preworkout",
        "weightgainer",
        "vitamins and minerals",
        "amino acid",
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "images") {
      const files = Array.from(e.target.files || []);
      setFormData({ ...formData, images: files });
    } else if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
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
      navigate("/admin/login");
      return;
    }

    setLoading(true); // ✅ START LOADING

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      // data.append("weight", formData.weight || "");
      // data.append("flavor", formData.flavor || "");
      data.append("compareAtPrice", formData.compareAtPrice || "");
      data.append("discountPercent", formData.discountPercent || "");
      data.append("sizes", formData.sizes || "");
      data.append("colors", formData.colors || "");
      data.append("stockQuantity", formData.stockQuantity || "0");
      data.append("isWeeklyOffer", String(formData.isWeeklyOffer));
      data.append("offerLabel", formData.offerLabel || "");
      data.append("offerEndsAt", formData.offerEndsAt || "");
      data.append("isFeatured", String(formData.isFeatured));
      if (Array.isArray(formData.images) && formData.images.length) {
        // Backend usually supports multiple files via same field name (multer: upload.array("image"))
        for (const file of formData.images) {
          data.append("image", file);
        }
      }

      console.log("Sending data:", {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        imagesCount: formData.images?.length || 0,
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
        compareAtPrice: "",
        discountPercent: "",
        isWeeklyOffer: false,
        offerLabel: "",
        offerEndsAt: "",
        isFeatured: false,
        images: [],
      });

      // ✅ RESET FILE INPUT
      if (imageInputRef.current) imageInputRef.current.value = "";
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Error adding product";
      toast.error(errorMsg);
    } finally {
      setLoading(false); // ✅ STOP LOADING
    }
  };

  const downloadProductsBulkTemplate = () => {
    const header = [
      "name",
      "category",
      "price",
      "compareAtPrice",
      "discountPercent",
      "sizes",
      "colors",
      "stockQuantity",
      "isWeeklyOffer",
      "offerLabel",
      "offerEndsAt",
      "isFeatured",
      "image",
    ];
    const example = [
      "Whey Protein 2kg",
      "protein",
      5499,
      6999,
      21,
      "S, M, L",
      "Black, White",
      32,
      "yes",
      "Weekly Offer",
      "2026-06-01",
      "yes",
      "",
    ];
    const ws = XLSX.utils.aoa_to_sheet([header, example]);
    ws["!cols"] = [
      { wch: 22 },
      { wch: 14 },
      { wch: 10 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 16 },
      { wch: 12 },
      { wch: 14 },
      { wch: 18 },
      { wch: 14 },
      { wch: 12 },
      { wch: 10 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products-bulk-import-template.xlsx");
    toast.success(
      "Template downloaded. Row 1 = headers; category must exist in admin categories."
    );
  };

  const handleBulkProductsFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Admin token missing. Please login again.");
      navigate("/admin/login");
      return;
    }

    const API_BASE = import.meta.env.VITE_API_BASE;
    setBulkImporting(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) {
        toast.error("The file has no sheets.");
        return;
      }
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
        defval: "",
        raw: false,
      });
      const products = [];
      for (const row of rows) {
        const p = rowToBulkProduct(row);
        if (p) products.push(p);
      }
      const skippedRows = Math.max(0, rows.length - products.length);
      if (products.length === 0) {
        toast.error(
          "No valid rows. Required: name, category, price (> 0). See template headers."
        );
        return;
      }

      let inserted = 0;
      let errors = 0;
      const errorSamples = [];

      for (let i = 0; i < products.length; i += BULK_PRODUCT_CHUNK) {
        const chunk = products.slice(i, i + BULK_PRODUCT_CHUNK);
        const res = await axios.post(
          `${API_BASE}/products/bulk-import`,
          { products: chunk },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        const data = res.data;
        if (!data?.success) {
          toast.error(data?.message || "Bulk import failed");
          return;
        }
        if (data.summary) {
          inserted += data.summary.inserted ?? 0;
          errors += data.summary.errors ?? 0;
        } else if (Array.isArray(data.inserted)) {
          inserted += data.inserted.length;
        }
        if (Array.isArray(data.errors) && data.errors.length) {
          console.warn("Products bulk import errors:", data.errors);
          for (const err of data.errors.slice(0, 5)) {
            errorSamples.push(err);
          }
        }
      }

      const skipMsg = skippedRows
        ? `${skippedRows} invalid row(s) skipped in file.`
        : "";
      if (!inserted && errors) {
        toast.error(
          `No products saved. ${errors} API error(s). ${skipMsg}`.trim()
        );
      } else if (errors) {
        toast.success(
          `Saved ${inserted} product(s). ${errors} row(s) failed — see console for details. ${skipMsg}`.trim()
        );
      } else {
        toast.success(
          [`Saved ${inserted} product(s).`, skipMsg].filter(Boolean).join(" ")
        );
      }
      if (errorSamples.length) {
        console.info("Sample API errors:", errorSamples);
      }
    } catch (err) {
      console.error(
        "Bulk product import failed:",
        err.response?.data || err.message
      );
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Bulk import failed";
      toast.error(msg);
    } finally {
      setBulkImporting(false);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-slate-950 via-red-900 to-red-600 p-6 text-white shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300">
          Catalogue control
        </p>
        <h1 className="mt-2 text-3xl lg:text-4xl font-black tracking-tight">
          Add New Product
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Add product data, real offers, weekly deal flags, and bulk imports
          from one place.
        </p>
      </div>
      <div className="bg-white border border-slate-200 rounded-[2rem] p-4 lg:p-6 text-gray-800 shadow-sm max-w-3xl mx-auto">
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
                className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-gray-800"
              >
                <option value="">Select Category</option>
                {categories.length > 0 ? (
                  categories.map((category, index) => {
                    const categoryName =
                      typeof category === "string"
                        ? category
                        : category.name || category;
                    return (
                      <option key={index} value={categoryName}>
                        {categoryName.charAt(0).toUpperCase() +
                          categoryName.slice(1)}
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="protein">Protein</option>
                    <option value="creatine">Creatine</option>
                    <option value="preworkout">Pre Workout</option>
                    <option value="weightgainer">Weight Gainer</option>
                    <option value="vitamins and minerals">
                      Vitamin and Minerals
                    </option>
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

          {/* Price */}
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
                className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-gray-800"
                placeholder="Enter price"
              />
            </div>
            <div>
              <label className="block text-sm lg:text-base font-medium mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-gray-800"
                placeholder="Total stock available"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm lg:text-base font-medium mb-2">
                Available Sizes
              </label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-gray-800"
                placeholder="e.g., S, M, L"
              />
            </div>
            <div>
              <label className="block text-sm lg:text-base font-medium mb-2">
                Available Colors
              </label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-gray-800"
                placeholder="e.g., Black, White"
              />
            </div>
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

          {/* Real Offer / Discount Controls */}
          <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-yellow-50 p-4">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                Real storefront offer
              </p>
              <h2 className="mt-1 text-lg font-black text-slate-950">
                Deal, discount and featured settings
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Ye fields backend product mein save hon to frontend cards aur
                hero par real offers show honge.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Compare at / old price
                </label>
                <input
                  type="number"
                  name="compareAtPrice"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-white border border-red-100 rounded-md focus:outline-none focus:border-red-500 text-gray-800"
                  placeholder="e.g., 6999"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Discount %
                </label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="1"
                  className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-white border border-red-100 rounded-md focus:outline-none focus:border-red-500 text-gray-800"
                  placeholder="e.g., 20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Offer label
                </label>
                <input
                  type="text"
                  name="offerLabel"
                  value={formData.offerLabel}
                  onChange={handleChange}
                  className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-white border border-red-100 rounded-md focus:outline-none focus:border-red-500 text-gray-800"
                  placeholder="Weekly Offer / Mega Deal"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Offer ends at
                </label>
                <input
                  type="date"
                  name="offerEndsAt"
                  value={formData.offerEndsAt}
                  onChange={handleChange}
                  className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base bg-white border border-red-100 rounded-md focus:outline-none focus:border-red-500 text-gray-800"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-red-100 bg-white px-4 py-3 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="isWeeklyOffer"
                  checked={formData.isWeeklyOffer}
                  onChange={handleChange}
                  className="h-4 w-4 accent-red-600"
                />
                Show in weekly offers
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-red-100 bg-white px-4 py-3 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 accent-red-600"
                />
                Feature on homepage
              </label>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm lg:text-base font-medium mb-2">
              Product Images
            </label>
            <input
              type="file"
              ref={imageInputRef}
              name="images"
              onChange={handleChange}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="w-full px-3 lg:px-4 py-2 text-sm cursor-pointer lg:text-base bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-gray-800"
            />
            {Array.isArray(formData.images) && formData.images.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">
                  Selected: {formData.images.length} image(s)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.slice(0, 9).map((file, idx) => (
                    <img
                      key={`${file.name}-${idx}`}
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border-2 border-slate-200"
                    />
                  ))}
                </div>
                {formData.images.length > 9 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Showing first 9 previews.
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || bulkImporting}
            className="w-full bg-slate-950 text-white py-3 rounded-full font-black hover:bg-red-700 transition-colors text-sm lg:text-base disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-[2rem] p-4 lg:p-6 text-gray-800 shadow-sm max-w-3xl mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          {/* <div>
            <h2 className="text-lg font-semibold text-gray-900">Bulk import products</h2>
            <p className="text-sm text-gray-600 mt-1">
              Calls <span className="font-mono text-xs">POST /products/bulk-import</span> on your API base URL — up to{" "}
              {BULK_PRODUCT_CHUNK} rows per request (large files are split automatically).
            </p>
          </div> */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={downloadProductsBulkTemplate}
              disabled={bulkImporting}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 text-sm font-semibold disabled:opacity-50"
            >
              Download Excel template
            </button>
            <button
              type="button"
              onClick={() => bulkFileRef.current?.click()}
              disabled={bulkImporting}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-semibold disabled:opacity-50"
            >
              {bulkImporting ? "Importing…" : "Import from Excel"}
            </button>
            <input
              ref={bulkFileRef}
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              className="hidden"
              onChange={handleBulkProductsFile}
            />
          </div>
        </div>
        {/* <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-700 space-y-2">
          <p className="font-medium text-gray-800">File format</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Headers (row 1): <span className="font-mono">name</span>,{" "}
              <span className="font-mono">category</span>, <span className="font-mono">price</span> (required, number
              &gt; 0). Optional: <span className="font-mono">weight</span>, <span className="font-mono">flavor</span>{" "}
              (comma-separated), <span className="font-mono">image</span> (URL).
            </li>
            <li>
              <strong className="font-medium">Category</strong> must match an{" "}
              <strong className="font-medium">active</strong> category in the database (create categories first on the
              Categories page). Wrong category → API error for that row.
            </li>
            <li>Uses the same admin JWT as single product add (<span className="font-mono">Authorization: Bearer</span>).</li>
          </ul>
          <p className="text-xs text-gray-500 pt-1">
            Full API notes: <span className="font-mono">docs/FRONTEND_BULK_IMPORT_API.md</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}
  