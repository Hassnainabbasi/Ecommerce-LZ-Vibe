import { Filter, ChevronDown, LayoutGrid, List } from 'lucide-react'
import { useState } from 'react'
import './ProductToolbar.css'

function ProductToolbar({ view, onViewChange }) {
  const [sortOpen, setSortOpen] = useState(false)

  return (
    <div className="product-toolbar container" role="toolbar">
      <button type="button" className="product-toolbar__btn" aria-label="Filter products">
        <Filter className="h-4 w-4" aria-hidden />
        <span>Filter</span>
      </button>

      <div className="product-toolbar__views" role="group" aria-label="Grid view">
        <button
          type="button"
          className={`product-toolbar__view-btn${view === 'grid' ? ' is-active' : ''}`}
          onClick={() => onViewChange?.('grid')}
          aria-label="Grid view"
          aria-pressed={view === 'grid'}
        >
          <LayoutGrid className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className={`product-toolbar__view-btn${view === 'list' ? ' is-active' : ''}`}
          onClick={() => onViewChange?.('list')}
          aria-label="List view"
          aria-pressed={view === 'list'}
        >
          <List className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <button
        type="button"
        className="product-toolbar__btn"
        onClick={() => setSortOpen((v) => !v)}
        aria-expanded={sortOpen}
        aria-label="Sort products"
      >
        <span>Sort</span>
        <ChevronDown className={`h-4 w-4 transition ${sortOpen ? 'rotate-180' : ''}`} aria-hidden />
      </button>
    </div>
  )
}

export default ProductToolbar
