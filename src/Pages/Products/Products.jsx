import React, { useEffect, useState } from "react";
import CategoryProducts from "../../Components/CategoryProducts/CategoryProducts";
import { fetchAllProducts } from "../../api";
function Products() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchAllProducts();

      // Handle different API response formats
      let productArray = [];
      if (Array.isArray(response)) {
        productArray = response;
      } else if (response?.data && Array.isArray(response.data)) {
        productArray = response.data;
      } else if (response?.products && Array.isArray(response.products)) {
        productArray = response.products;
      }


      if (productArray.length === 0) {
        setError("No products available");
        setLoading(false);
        return;
      }

      const categoryMap = {};
      productArray.forEach((product) => {
        const category = product.category || "Uncategorized";

        if (!categoryMap[category]) {
          categoryMap[category] = [];
        }

        categoryMap[category].push(product);
      });

      const groupedArray = Object.keys(categoryMap).map(
        (categoryName, index) => ({
          catId: index + 1,
          category: categoryName,
          products: categoryMap[categoryName],
        })
      );

      setGroups(groupedArray);
    } catch (err) {
      console.error(" Failed to load products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-10 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center bg-slate-50">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
          <div className="text-5xl mb-4" aria-hidden>📦</div>
          <p className="text-xl font-semibold text-slate-900 mb-2">{error}</p>
          <p className="text-slate-600 mb-6">We are updating our catalogue. Please try again shortly.</p>
          <button
            onClick={loadProducts}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition-all"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (groups.length === 0) {
    return (
      <section className="py-20 text-center bg-slate-50">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
          <div className="text-5xl mb-4" aria-hidden>📦</div>
          <p className="text-xl font-semibold text-slate-900 mb-2">No products available</p>
          <p className="text-slate-600">Check back soon for new arrivals.</p>
        </div>
      </section>
    );
  }

  const categoryOrder = ["protein", "creatine", "preworkout", "weightgainer"];
  const sortedGroups = [...groups].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(
      a.category.toLowerCase().replace(/\s+/g, "")
    );
    const bIndex = categoryOrder.indexOf(
      b.category.toLowerCase().replace(/\s+/g, "")
    );

    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <section id="products" className="bg-[#f8fafc] py-10">
      <div className="container mb-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">Fresh catalogue</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Products people are buying
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Category-wise product sections with clean product cards and fast checkout actions.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">
            {sortedGroups.length} categories
          </span>
        </div>
      </div>
      {sortedGroups.map((group) => (
        <CategoryProducts
          key={group.catId}
          product={group}
          catId={group.catId}
        />
      ))}
    </section>
  );
}

export default Products;
