import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, LayoutGrid, UserRound, ShoppingCart } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../Context/CartContext'
import './MobileBottomNav.css'

function MobileBottomNav({ onSearch }) {
  const { cartData } = useContext(CartContext)
  const location = useLocation()
  const [accountPath, setAccountPath] = useState('/login')

  useEffect(() => {
    const user = localStorage.getItem('user')
    setAccountPath(user ? '/settings' : '/login')
  }, [location.pathname])

  const cartCount = cartData?.length || 0

  const items = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { type: 'button', label: 'Search', icon: Search, onClick: onSearch },
    { to: '/products', label: 'Collection', icon: LayoutGrid },
    { to: accountPath, label: 'Account', icon: UserRound },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
  ]

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {items.map((item) => {
        const Icon = item.icon
        if (item.type === 'button') {
          return (
            <button
              key={item.label}
              type="button"
              className="mobile-bottom-nav__item"
              onClick={item.onClick}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span>{item.label}</span>
            </button>
          )
        }
        return (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `mobile-bottom-nav__item${isActive ? ' mobile-bottom-nav__item--active' : ''}`
            }
          >
            <span className="relative inline-flex">
              <Icon className="h-5 w-5" aria-hidden />
              {item.badge !== undefined && (
                <span className="mobile-bottom-nav__badge">{item.badge}</span>
              )}
            </span>
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default MobileBottomNav
