import { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingCart, UserRound, X } from 'lucide-react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import { CartContext } from '../../Context/CartContext'

const AUTH_PATHS = ['/login', '/register']

function Navbar({ setOpenSearch, isMobile = true }) {
  const { cartData } = useContext(CartContext)
  const [showMenu, setShowMenu] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const location = useLocation()
  const isAuthPage = AUTH_PATHS.includes(location.pathname)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      setCurrentUser(raw ? JSON.parse(raw) : null)
    } catch {
      setCurrentUser(null)
    }
  }, [location])

  useEffect(() => {
    setShowMenu(false)
  }, [location.pathname, isMobile])

  useEffect(() => {
    if (!showMenu) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [showMenu])

  const cartCount = cartData?.length || 0

  const navLinks = [
    ['/', 'Home'],
    ['/products', 'Products'],
    ['/about', 'About'],
    ['/contact', 'Contact'],
  ]

  return (
    <header id="header" className="sticky top-0 z-[1000]">
      <div className="nav-offer-bar">
        <div className="container flex items-center justify-center py-2 text-center text-xs font-bold">
          <span>
            <span className="text-teal-600">Har Sale Se </span>
            <span className="text-orange-600">Behter</span>
            <span className="text-slate-600"> — LZ Vibe</span>
          </span>
          {!isMobile && (
            <span className="ml-4 text-slate-500">Fast delivery · Secure checkout</span>
          )}
        </div>
      </div>

      <div className="nav-main">
        <div className="container nav-header-row">
          {isMobile && !isAuthPage && (
            <button
              type="button"
              onClick={() => setShowMenu(true)}
              className="nav-icon-btn menu-btn-mobile"
              aria-label="Open menu"
              aria-expanded={showMenu}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          )}

          {isMobile && isAuthPage && <span className="w-11" aria-hidden />}

          <Link to="/" className="logo nav-logo-center" onClick={() => setShowMenu(false)}>
            <span className="logo-ring">
              <img className="h-11 w-11 rounded-full object-cover" src={logo} alt="LZ Vibe" />
            </span>
            {!isMobile && (
              <span className="logo-text">
                <span className="block text-lg font-bold tracking-tight text-slate-950">LZ Vibe</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">Online store</span>
              </span>
            )}
          </Link>

          {!isMobile && (
            <nav className="desktop-nav desktop-nav--inline" aria-label="Main navigation">
              <ul className="flex items-center justify-center gap-1">
                {navLinks.map(([to, label]) => (
                  <li key={to}>
                    <NavLink to={to}>{label}</NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="buttons-container">
            <button
              type="button"
              onClick={() => setOpenSearch(true)}
              className="nav-icon-btn"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" aria-hidden />
            </button>

            {!isMobile && (
              <>
                {!currentUser ? (
                  <NavLink to="/login" className="nav-account">
                    <UserRound className="h-4 w-4" aria-hidden />
                    <span>Login</span>
                  </NavLink>
                ) : (
                  <NavLink to="/settings" className="nav-account">
                    <UserRound className="h-4 w-4" aria-hidden />
                    <span>Account</span>
                  </NavLink>
                )}
                <NavLink to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
                  <Heart className="h-5 w-5" aria-hidden />
                </NavLink>
                <NavLink to="/cart" className="nav-icon-btn relative" aria-label="Cart">
                  <ShoppingCart className="h-5 w-5" aria-hidden />
                  <span className="cart-count absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black text-white">
                    {cartCount}
                  </span>
                </NavLink>
              </>
            )}

            {isMobile && (
              <NavLink
                to={currentUser ? '/settings' : '/login'}
                className="nav-icon-btn"
                aria-label="Account"
                onClick={() => setShowMenu(false)}
              >
                <UserRound className="h-5 w-5" aria-hidden />
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {isMobile && showMenu && (
        <>
          <div
            className="nav-overlay"
            onClick={() => setShowMenu(false)}
            aria-hidden
          />
          <nav className="desktop-nav desktop-nav--drawer showMenu" aria-label="Menu">
            <button
              type="button"
              onClick={() => setShowMenu(false)}
              className="mobile-close"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <ul>
              {navLinks.map(([to, label]) => (
                <li key={to}>
                  <NavLink to={to} onClick={() => setShowMenu(false)}>
                    {label}
                  </NavLink>
                </li>
              ))}
              <li>
                {!currentUser ? (
                  <NavLink to="/login" onClick={() => setShowMenu(false)}>Login / Register</NavLink>
                ) : (
                  <NavLink to="/settings" onClick={() => setShowMenu(false)}>Settings</NavLink>
                )}
              </li>
              <li>
                <NavLink to="/wishlist" onClick={() => setShowMenu(false)}>Wishlist</NavLink>
              </li>
              <li>
                <NavLink to="/cart" onClick={() => setShowMenu(false)}>Cart</NavLink>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  )
}

export default Navbar
