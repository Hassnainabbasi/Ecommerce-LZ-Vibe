import { useState, useEffect } from "react";
import { fetchAllProducts } from "../../api";
import ProductCard from "../ProductCard/ProductCard";
import './Search.css'

function Search({ setOpenSearch }) {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const products = await fetchAllProducts();
        setAllProducts(products);
      } catch (err) {
        console.error("Failed to load products for search", err);
      }
    })();
  }, []);

  function handleSearch(e) {
    const searchValue = e.target.value.toLowerCase();
    setQuery(searchValue);

    if (searchValue.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const results = allProducts.filter((item) =>
      item.name.toLowerCase().includes(searchValue)
    );

    setFilteredProducts(results);
  }

  return (
    <section
      id="search"
      className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-50/98 pt-6 pb-10 px-4 sm:px-6"
    >
      <div className="search-content container relative max-w-4xl">
        <button
          type="button"
          className="absolute right-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700"
          onClick={() => setOpenSearch(false)}
          aria-label="Close search"
        >
          <i className="fa-solid fa-xmark text-lg" />
        </button>

        <div className="mx-auto flex max-w-2xl border-b-2 border-slate-300 py-2 text-lg sm:text-xl">
          <input
            onChange={handleSearch}
            value={query}
            name="search"
            className="flex-1 bg-transparent py-2 text-gray-800 outline-none placeholder:text-gray-400"
            placeholder="Search products..."
            type="search"
            autoFocus
          />
          <span className="grid place-items-center p-2 text-slate-600" aria-hidden>
            <i className="fa-solid fa-magnifying-glass text-xl" />
          </span>
        </div>
      </div>

      <div className="container product-grid py-8 sm:py-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <ProductCard key={item._id || item.productId} product={item} />
          ))
        ) : query.length > 0 ? (
          <div className="col-span-full mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-md">
            <div className="mb-2 text-4xl" aria-hidden>🔍</div>
            <p className="font-semibold text-gray-800">
              No product found for &quot;{query}&quot;
            </p>
            <p className="mt-2 text-sm text-gray-600">Try different keywords</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Search;
