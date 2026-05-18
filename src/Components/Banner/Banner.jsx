import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgePercent } from 'lucide-react'
import { fetchAllProducts } from '../../api'
import { getProductOffer } from '../../utils/offerHelpers'
import { getImageUrl } from '../../utils/imageHelper'
import './Banner.css'

function Banner() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchAllProducts()
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error('Failed to load hero products:', err))
    return () => {
      cancelled = true
    }
  }, [])

  const offerProducts = useMemo(() => {
    return products
      .map((product) => ({ product, offer: getProductOffer(product) }))
      .filter((item) => item.offer.hasOffer)
      .slice(0, 6)
  }, [products])

  return (
    <section id="banner" className="chase-banner" aria-label="Store highlights">
      <div className="container py-8 md:py-12 lg:py-14">
        <div className="chase-banner__inner">
          <div className="chase-banner__intro text-center lg:text-left">
            <h1 className="collection-title text-2xl font-semibold text-slate-500 sm:text-3xl lg:text-4xl xl:text-5xl">
              Shop Quality Products
              <span className="block font-normal">Online</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base lg:mx-0">
              Clean categories, clear prices, and fast checkout — on every screen size.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700"
              >
                Browse collection
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
              >
                Categories
              </a>
            </div>
          </div>

          {offerProducts.length > 0 && (
            <div className="chase-banner__offers">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-teal-700">
                  <BadgePercent className="h-5 w-5" aria-hidden />
                  <span className="text-sm font-bold">Live offers from store</span>
                </div>
                <Link to="/products" className="text-xs font-bold text-slate-500 hover:text-teal-700">
                  View all
                </Link>
              </div>
              <div className="chase-banner__offer-scroll flex gap-3 overflow-x-auto pb-2 lg:flex-wrap lg:justify-end lg:overflow-visible">
                {offerProducts.map(({ product, offer }) => (
                  <Link
                    key={product._id || product.name}
                    to="/products"
                    className="chase-banner__offer-card shrink-0"
                  >
                    <div className="chase-banner__offer-image">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="h-full w-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.png'
                        }}
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs font-bold text-slate-900">{product.name}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-orange-600">
                      {offer.discountPercent > 0 ? `${offer.discountPercent}% OFF` : offer.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Banner
