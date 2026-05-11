import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingCart, UserRound, X } from 'lucide-react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import { CartContext } from '../../Context/CartContext'

function Navbar({ setOpenSearch }) {
  const { cartData } = useContext(CartContext)
  const [showMenu, setShowMenu] = useState(false)

  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, [location]);

  const cartCount = cartData?.length || 0

  return (
    <header id='header' className='sticky top-0 z-[1000]'>
      <div className="nav-offer-bar">
        <div className="container flex flex-wrap items-center justify-between gap-2 py-2 text-xs font-semibold">
          <span>Wholesale prices rozana · New deals every week</span>
          <span className="hidden sm:inline">Need help? WhatsApp support available</span>
        </div>
      </div>

      <div className="nav-main">
        <div className="container flex h-[82px] items-center justify-between gap-5">
          <Link to='/' className='logo flex items-center gap-3'>
            <span className="logo-ring">
              <img className='h-14 w-14 rounded-full object-cover' src={logo} alt="Store logo" />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-lg font-black tracking-tight text-slate-950">LZ Vibe</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-red-600">Daily deals</span>
            </span>
          </Link>

          <nav className={`${showMenu ? 'showMenu' : ''} flex-1`}>
            <ul className='flex items-center justify-center gap-2'>
              {[
                ['/', 'Home'],
                ['/products', 'Products'],
                ['/about', 'About'],
                ['/contact', 'Contact'],
              ].map(([to, label]) => (
                <li key={to}>
                  <NavLink to={to} onClick={() => setShowMenu(false)}>
                    {label}
                  </NavLink>
                </li>
              ))}
              <li className="add-me hidden">
                {!currentUser ? (
                  <NavLink to="/login" onClick={() => setShowMenu(false)}>Login / Register</NavLink>
                ) : (
                  <NavLink to="/settings" onClick={() => setShowMenu(false)}>Settings</NavLink>
                )}
              </li>
              <li className='add-me hidden'>
                <NavLink to="/wishlist" onClick={() => setShowMenu(false)}>Wishlist</NavLink>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setShowMenu(false)}
              className='mobile-close hidden'
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </nav>

          <div className='buttons-container flex items-center gap-2'>
            <button onClick={() => setOpenSearch(true)} className='nav-icon-btn' aria-label="Open search">
              <Search className="h-5 w-5" aria-hidden />
            </button>
            {!currentUser ? (
              <NavLink to="/login" className='remove-me nav-account'>
                <UserRound className="h-4 w-4" aria-hidden />
                Login
              </NavLink>
            ) : (
              <NavLink to="/settings" className='remove-me nav-account'>
                <UserRound className="h-4 w-4" aria-hidden />
                Settings
              </NavLink>
            )}

            <NavLink to="/wishlist" className='remove-me nav-icon-btn' aria-label="Wishlist">
              <Heart className="h-5 w-5" aria-hidden />
            </NavLink>
            <NavLink to='/cart' className="nav-icon-btn relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" aria-hidden />
              <span className="cart-count absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-black text-white">
                {cartCount}
              </span>
            </NavLink>

            <button onClick={() => setShowMenu(true)} className='menu-btn nav-icon-btn hidden' aria-label="Open menu">
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
      {showMenu && <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowMenu(false)}></div>}
    </header>
  )
}

export default Navbar;