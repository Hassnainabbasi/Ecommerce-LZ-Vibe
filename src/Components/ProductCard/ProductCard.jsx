import "./ProductCard.css";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import AddToCart from "../AddToCart/AddToCart";
import { getImageUrl } from "../../utils/imageHelper";
import { getProductOffer, toNumber } from "../../utils/offerHelpers";
import toast from "react-hot-toast";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE || "";

function ProductCard({ product, refreshWishlist }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWishlistStatus();
  }, [product]);

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

      const response = await axios.post(`${apiBase}api/users/wishlist`, {
        email,
        productId: product._id,
        action,
      });

      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        const res = await axios.get(`${apiBase}api/users/wishlist/${email}`);
        currentUser.wishlist = res.data.wishlist;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }

      setIsInWishlist(!isInWishlist);

      if (typeof refreshWishlist === "function") {
        refreshWishlist();
      }

      toast.success(
        isInWishlist
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    } catch (err) {
      console.error("Wishlist update failed:", err);
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
  const sellingPrice = toNumber(product?.price);
  const priceFormatted = sellingPrice.toLocaleString();
  const offer = getProductOffer(product);
  const compareAt = offer.compareAtPrice || toNumber(product?.compareAtPrice);
  const showCompare = compareAt > sellingPrice;

  return (
    <article className="product-card-container">
      <div className="product-card group">
        <div className="product-card__media relative overflow-hidden rounded-xl bg-[#f3f4f6] sm:rounded-2xl">
          {offer.hasOffer && (
            <span className="absolute right-2 top-2 z-10 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white sm:px-2.5 sm:py-1 sm:text-[11px]">
              {offer.discountPercent > 0 ? `${offer.discountPercent}% OFF` : offer.label}
            </span>
          )}
          <button
            className="wishlist-btn absolute left-2 top-2 z-10 sm:left-3 sm:top-3"
            onClick={handleWishlist}
            disabled={loading}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist ? "fill-teal-600 text-teal-600" : ""}`} aria-hidden />
          </button>
          <img
            className="product-card-image w-full object-contain p-3 transition duration-500 group-hover:scale-[1.03]"
            src={productImage}
            alt={productName}
            onError={(e) => {
              e.target.src = "/images/placeholder.png";
            }}
          />
        </div>

        <div className="content px-0.5 pt-3 sm:px-1 sm:pt-4">
          <h4 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-slate-900 sm:min-h-[44px] sm:text-[15px]" title={productName}>
            {productName}
          </h4>

          <div className="my-2 sm:my-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">Price Rs.</p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              {showCompare && (
                <span className="text-sm text-slate-400 line-through sm:text-base">
                  {compareAt.toLocaleString()}
                </span>
              )}
              <span className={`font-black text-slate-900 ${showCompare ? "text-lg sm:text-xl" : "text-lg sm:text-2xl"}`}>
                {priceFormatted}
              </span>
            </div>
          </div>

          <AddToCart product={product} />
        </div>
        </div>
    </article>
  );
}

export default ProductCard;
