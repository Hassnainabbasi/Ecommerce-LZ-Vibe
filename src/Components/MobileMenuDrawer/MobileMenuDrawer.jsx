import { Link } from 'react-router-dom'
import { ChevronRight, UserRound, X } from 'lucide-react'
import { formatCategoryLabel } from '../../hooks/useStoreCategories'
import './MobileMenuDrawer.css'

function MobileMenuDrawer({ open, onClose, categories = [], currentUser }) {
  if (!open) return null

  const accountPath = currentUser ? '/settings' : '/login'

  return (
    <div className="mobile-menu-root" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        className="mobile-menu-overlay"
        onClick={onClose}
        aria-label="Close menu"
      />
      <aside className="mobile-menu-drawer">
        <div className="mobile-menu-header">
          <h2 className="mobile-menu-title">Menu</h2>
          <button
            type="button"
            className="mobile-menu-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <nav className="mobile-menu-nav">
          <ul className="mobile-menu-list">
            {categories.map((item) => (
              <li key={item.slug} className="mobile-menu-item">
                <Link
                  to={`/products#${item.slug}`}
                  className="mobile-menu-link"
                  onClick={onClose}
                >
                  <span>{formatCategoryLabel(item.category)}</span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={1.75} aria-hidden />
                </Link>
              </li>
            ))}
            <li className="mobile-menu-item mobile-menu-item--offer">
              <Link to="/products" className="mobile-menu-link mobile-menu-link--offer" onClick={onClose}>
                <span>Offer of the Week</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mobile-menu-footer">
          <Link to={accountPath} className="mobile-menu-signin" onClick={onClose}>
            <UserRound className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            <span>{currentUser ? 'My Account' : 'Sign In'}</span>
          </Link>
        </div>
      </aside>
    </div>
  )
}

export default MobileMenuDrawer
