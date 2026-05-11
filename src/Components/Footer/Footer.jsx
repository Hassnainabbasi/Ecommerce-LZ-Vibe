import React from 'react'
import logo from '../../assets/logo.png'
import { Link, NavLink } from 'react-router-dom'
import { Mail, MapPin, Phone, ShieldCheck, Truck } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer id="footer" className='bg-slate-950 text-white'>
      <div className="border-b border-white/10 bg-gradient-to-r from-red-700 via-red-600 to-yellow-500">
        <div className="container grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6" aria-hidden />
            <span className="text-sm font-black">Fast dispatch across Pakistan</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6" aria-hidden />
            <span className="text-sm font-black">Secure checkout and support</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6" aria-hidden />
            <span className="text-sm font-black">Order help on WhatsApp</span>
          </div>
        </div>
      </div>

      <div className='container grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]'>
        <div>
          <Link to='/' className='flex items-center gap-3'>
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white">
              <img className='h-14 w-14 rounded-xl object-cover' src={logo} alt="Store logo" />
            </span>
            <span>
              <span className='block text-xl font-black tracking-tight'>LZ Vibe</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">Daily deals</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
            Bizmart inspired online shopping UI for bold offers, fast categories,
            and a clean product buying experience.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-yellow-300">Company</h3>
          <ul className='space-y-3 text-sm text-slate-300'>
            <li><NavLink to='/about'>About</NavLink></li>
            <li><NavLink to='/contact'>Need Help</NavLink></li>
            <li><NavLink to='/return-policy'>Return Policy</NavLink></li>
            <li><NavLink to='/terms-and-conditions'>Terms & Conditions</NavLink></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-yellow-300">Shop</h3>
          <ul className='space-y-3 text-sm text-slate-300'>
            <li><NavLink to='/products'>All Products</NavLink></li>
            <li><NavLink to='/wishlist'>Wishlist</NavLink></li>
            <li><NavLink to='/cart'>Cart</NavLink></li>
            <li><NavLink to='/settings'>Account</NavLink></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-yellow-300">Contact</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-yellow-300" aria-hidden />Add your business address here.</li>
            <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-yellow-300" aria-hidden /><a href="mailto:support@example.com">support@example.com</a></li>
            <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-yellow-300" aria-hidden /><a href="tel:+923226350143">+92 322 6350143</a></li>
          </ul>
        </div>
      </div>

      <div className='border-t border-white/10'>
        <p className='container py-5 text-sm leading-relaxed text-slate-400'>
          Copyright © 2026 LZ Vibe. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer