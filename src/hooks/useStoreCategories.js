import { useEffect, useState } from 'react'
import { fetchAllProducts } from '../api'

export function slugifyCategory(name = '') {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export function formatCategoryLabel(name = '') {
  return name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export function useStoreCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchAllProducts()
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data) ? data : []
        const map = {}

        list.forEach((product) => {
          const category = product.category || 'Uncategorized'
          if (!map[category]) {
            map[category] = {
              category,
              slug: slugifyCategory(category),
              image: product.image || '',
              productCount: 0,
            }
          }
          map[category].productCount += 1
          if (!map[category].image && product.image) {
            map[category].image = product.image
          }
        })

        setCategories(Object.values(map))
      })
      .catch((err) => console.error('Failed to load categories:', err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { categories, loading }
}
