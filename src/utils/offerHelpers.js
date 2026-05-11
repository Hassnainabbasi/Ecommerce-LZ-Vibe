export function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function isOfferActive(product = {}) {
  if (!product.offerEndsAt) return true;
  const endsAt = new Date(product.offerEndsAt).getTime();
  if (!Number.isFinite(endsAt)) return true;
  return endsAt >= Date.now();
}

export function getProductOffer(product = {}) {
  const price = toNumber(product.price);
  const compareAtPrice = toNumber(product.compareAtPrice || product.oldPrice || product.mrp);
  const manualDiscount = toNumber(product.discountPercent);
  const derivedDiscount =
    compareAtPrice > price && price > 0
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;
  const discountPercent = Math.max(manualDiscount, derivedDiscount);
  const hasOffer =
    isOfferActive(product) &&
    (Boolean(product.isWeeklyOffer) ||
      Boolean(product.isFeatured) ||
      Boolean(product.offerLabel) ||
      discountPercent > 0);

  return {
    hasOffer,
    compareAtPrice,
    discountPercent,
    label:
      product.offerLabel ||
      (product.isWeeklyOffer ? 'Weekly Offer' : discountPercent > 0 ? 'Deal' : 'Featured'),
  };
}
