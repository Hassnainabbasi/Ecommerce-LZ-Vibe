import { Link } from 'react-router-dom'
import './Banner.css'

/** Bright retail store interior — replace with your own CDN/asset when branding is final */
const HERO_SRC =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2400&q=88'
const HERO_SRCSET = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=960&q=85 960w',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1440&q=85 1440w',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=88 1920w',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2400&q=88 2400w',
].join(', ')

function Banner() {
  return (
    <section
      id="banner"
      className="banner-hero relative w-full min-h-[220px] sm:min-h-[280px] md:min-h-[340px] overflow-hidden flex items-center justify-center"
      aria-label="Promotional banner"
    >
      <img
        className="banner-hero__img absolute inset-0 w-full h-full object-cover object-center"
        src={HERO_SRC}
        srcSet={HERO_SRCSET}
        sizes="100vw"
        alt="Modern retail store with clothing and shelves"
        decoding="async"
        fetchPriority="high"
      />
      <div
        className="banner-hero__overlay absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/55 to-slate-900/35"
        aria-hidden
      />

      <div className="banner-hero__content relative z-10 w-full max-w-3xl mx-auto px-5 py-10 sm:py-12 text-center md:text-left md:mx-0 md:pl-[8%]">
        <p className="text-blue-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2">
          Online store
        </p>
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-3">
          Everything you need,
          <span className="block sm:inline sm:ms-2 text-blue-200">delivered fast</span>
        </h1>
        <p className="text-slate-200 text-sm sm:text-base max-w-md mx-auto md:mx-0 mb-6 leading-relaxed">
          Browse categories, compare prices, and checkout securely—simple shopping from home.
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            Shop now
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-md border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Banner
