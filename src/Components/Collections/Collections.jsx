import { Link } from 'react-router-dom'
import { useStoreCategories, formatCategoryLabel } from '../../hooks/useStoreCategories'
import { getImageUrl } from '../../utils/imageHelper'
import './Collections.css'

function Collections() {
  const { categories, loading } = useStoreCategories()

  if (loading) {
    return (
      <section className="collections-section">
        <div className="container">
          <p className="collections-loading">Loading collections...</p>
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  return (
    <section id="collections" className="collections-section">
      <div className="container">
        <header className="collections-header">
          <h2 className="collections-title">
            Collections
          </h2>
          <p className="collections-subtitle">Shop by category</p>
        </header>

        <div className="collections-grid">
          {categories.map((item) => (
            <Link
              key={item.slug}
              to={`/products#${item.slug}`}
              className="collection-tile"
            >
              <div className="collection-tile__media">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.category}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.png'
                  }}
                />
              </div>
              <div className="collection-tile__label">
                <span>{formatCategoryLabel(item.category)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Collections
