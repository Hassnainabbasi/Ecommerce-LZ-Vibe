import { useEffect, useState } from "react";
import CategoryProducts from "../../Components/CategoryProducts/CategoryProducts";
import ProductToolbar from "../../Components/ProductToolbar/ProductToolbar";
import { fetchAllProducts } from "../../api";
import { useIsMobile } from "../../hooks/useIsMobile";

function Products() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridView, setGridView] = useState('grid');
  const isMobile = useIsMobile();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchAllProducts();

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
      <section className="page-section text-center">
        <div className="animate-spin rounded-full h-14 w-14 sm:h-16 sm:w-16 border-t-2 border-b-2 border-teal-600 mx-auto mb-4" />
        <p className="text-base sm:text-lg text-gray-600">Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-section text-center">
        <div className="page-card max-w-md mx-auto">
          <div className="text-4xl sm:text-5xl mb-4" aria-hidden>📦</div>
          <p className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">{error}</p>
          <p className="text-slate-600 mb-6 text-sm sm:text-base">We are updating our catalogue. Please try again shortly.</p>
          <button
            onClick={loadProducts}
            className="w-full sm:w-auto px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold shadow-sm transition-all"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (groups.length === 0) {
    return (
      <section className="page-section text-center">
        <div className="page-card max-w-md mx-auto">
          <div className="text-4xl sm:text-5xl mb-4" aria-hidden>📦</div>
          <p className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No products available</p>
          <p className="text-slate-600 text-sm sm:text-base">Check back soon for new arrivals.</p>
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
    <section id="products" className="bg-white py-4 sm:py-6 md:py-10">
      <div className="container mb-3 sm:mb-4 md:mb-6">
        <div className="rounded-xl border border-slate-100 bg-white p-4 sm:rounded-2xl sm:p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600 text-center sm:text-left">
            Fresh catalogue
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="collection-title text-2xl font-semibold text-slate-500 sm:text-3xl md:text-4xl">
                Our Products
                <span className="block sm:inline sm:before:content-['_']"> Collection</span>
              </h1>
              <p className="mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm mx-auto sm:mx-0">
                Category-wise sections — responsive grid on phone, tablet, and desktop.
              </p>
            </div>
            <span className="mx-auto inline-flex w-fit rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700 sm:mx-0">
              {sortedGroups.length} categories
            </span>
          </div>
        </div>
        {isMobile && <ProductToolbar view={gridView} onViewChange={setGridView} />}
      </div>
      {sortedGroups.map((group) => (
        <CategoryProducts
          key={group.catId}
          product={group}
          catId={group.catId}
          view={gridView}
        />
      ))}
    </section>
  );
}

export default Products;
