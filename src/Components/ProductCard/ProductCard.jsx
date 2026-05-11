import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useState, useEffect, useRef } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import gsap from "gsap";
import AddToCart from "../AddToCart/AddToCart";
import { api } from "../../api";
import { getImageUrl } from "../../utils/imageHelper";
import toast from "react-hot-toast"; // ✅ added

function ProductCard({ product, refreshWishlist }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    checkWishlistStatus();
  }, [product]);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  // ✅ check if product already exists in wishlist
  function checkWishlistStatus() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const currentUser = JSON.parse(userStr);
      const wishlist = currentUser?.wishlist || [];

      const exists = wishlist.some(
        (item) => item?.productId?._id === product?._id
      );

      setIsInWishlist(exists);
    } catch (err) {
      console.error("Error checking wishlist:", err);
    }
  }

  // ✅ handle add/remove wishlist
  async function handleWishlist() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Please log in to manage your wishlist!");
        return;
      }

      const currentUser = JSON.parse(userStr);
      const email = currentUser?.email;
      if (!email) {
        toast.error("User session invalid. Please log in again!");
        return;
      }

      setLoading(true);
      const action = isInWishlist ? "remove" : "add";

      const response = await api.post("/api/users/wishlist", {
        email,
        productId: product._id,
        action,
      });

      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        const res = await api.get(`/api/users/wishlist/${email}`);
        currentUser.wishlist = res.data.wishlist;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }

      setIsInWishlist(!isInWishlist);

      if (typeof refreshWishlist === "function") {
        refreshWishlist();
      }

      toast.success(
        isInWishlist
          ? "Removed from wishlist ❤️"
          : "Added to wishlist ❤️"
      );
    } catch (err) {
      console.error("❌ Wishlist update failed:", err);
      toast.error(
        err.response?.data?.message ||
        "Failed to update wishlist. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const productImage = getImageUrl(product?.image);
  const productName = product?.name || "Unnamed Product";
  const price = Number(product?.price || 0).toLocaleString();

  return (
    <article ref={cardRef} className="product-card-container">
      <div className="product-card group">
        <div className="relative overflow-hidden rounded-[1.35rem] bg-slate-100">
          <Link to="/products" aria-label={`View ${productName}`}>
            <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-lg">
              Deal
            </span>
          </Link>
          <button
            className="wishlist-btn absolute right-3 top-3 z-10"
            onClick={handleWishlist}
            disabled={loading}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} aria-hidden />
          </button>
          <img
            className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
            src={productImage}
            alt={productName}
            onError={(e) => {
              e.target.src = "/images/placeholder.png";
            }}
          />
        </div>

        <div className="content px-1 pt-4">
          <div className="mb-2 flex items-center gap-1 text-yellow-500">
            {[0, 1, 2, 3, 4].map((x) => (
              <Star key={x} className="h-3.5 w-3.5 fill-current" aria-hidden />
            ))}
            <span className="ml-1 text-xs font-semibold text-slate-400">Value pick</span>
          </div>

          <h4 className="line-clamp-2 min-h-[48px] text-base font-black leading-6 text-slate-950" title={productName}>
            {productName}
          </h4>

          <div className="my-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Price</p>
              <p className="text-2xl font-black text-red-600">Rs {price}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-black text-yellow-800">
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
              Stock
            </span>
          </div>

          {(product?.flavor?.length > 0 || product?.weight) && (
            <div className="flavor-weight mb-3 flex items-center justify-between gap-2">
              {product?.flavor?.filter(f => f.trim() !== "").length > 0 && (
                <div className="line-clamp-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                  {product.flavor.filter(f => f.trim() !== "").join(", ")}
                </div>
              )}
              {product?.flavor?.filter(f => f.trim() !== "").length === 0 && (
                <div className="text-xs p-1 rounded-md">
                </div>
              )}
              {product?.weight && (
                <p className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-700">
                  {product.weight}
                </p>
              )}
            </div>
          )}

          <AddToCart product={product} />
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
