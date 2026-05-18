import React from 'react'
import logo from '../../assets/logo.png'
import { Link, NavLink } from 'react-router-dom'
import { Mail, MapPin, Phone, ShieldCheck, Truck } from 'lucide-react'
import './Footer.css'

function Footer({ isMobile = false }) {
  return (
    <footer
      id="footer"
      className={`bg-white text-slate-800 border-t border-slate-200${isMobile ? ' footer--with-tabs' : ''}`}
    >
      <div className="hidden border-b border-slate-100 bg-slate-50 sm:block">
        <div className="container grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3 text-teal-700">
            <Truck className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-sm font-semibold">Fast dispatch across Pakistan</span>
          </div>
          <div className="flex items-center gap-3 text-teal-700">
            <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-sm font-semibold">Secure checkout and support</span>
          </div>
          <div className="flex items-center gap-3 text-teal-700 sm:col-span-2 lg:col-span-1">
            <Phone className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-sm font-semibold">Order help on WhatsApp</span>
          </div>
        </div>
      </div>

      <div className="container grid grid-cols-2 gap-6 py-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10 md:py-12">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-[#f3f4f6]">
              <img className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" src={logo} alt="Store logo" />
            </span>
            <span>
              <span className="block text-lg sm:text-xl font-bold tracking-tight text-slate-900">LZ Vibe</span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">Online store</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-500">
            Light, clean shopping — browse categories, compare prices, and checkout with confidence.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-slate-900">Company</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Need Help</NavLink></li>
            <li><NavLink to="/return-policy">Return Policy</NavLink></li>
            <li><NavLink to="/terms-and-conditions">Terms & Conditions</NavLink></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-slate-900">Shop</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            <li><NavLink to="/products">All Products</NavLink></li>
            <li><NavLink to="/wishlist">Wishlist</NavLink></li>
            <li><NavLink to="/cart">Cart</NavLink></li>
            <li><NavLink to="/settings">Account</NavLink></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h3 className="mb-3 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-slate-900">Contact</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            <li className="flex gap-2 sm:gap-3"><MapPin className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-teal-600" aria-hidden />Add your business address here.</li>
            <li className="flex gap-2 sm:gap-3"><Mail className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-teal-600" aria-hidden /><a href="mailto:support@example.com">support@example.com</a></li>
            <li className="flex gap-2 sm:gap-3"><Phone className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-teal-600" aria-hidden /><a href="tel:+923226350143">+92 322 6350143</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <p className="container py-3 sm:py-5 text-center text-[11px] sm:text-sm text-slate-500 md:text-left">
          Copyright © 2026 LZ Vibe. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
