import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgePercent, ShoppingBag, Sparkles, Truck } from 'lucide-react'
import gsap from 'gsap'
import * as THREE from 'three'
import { fetchAllProducts } from '../../api'
import { getProductOffer } from '../../utils/offerHelpers'
import { getImageUrl } from '../../utils/imageHelper'
import './Banner.css'

function Banner() {
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchAllProducts()
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error('Failed to load hero products:', err))
    return () => {
      cancelled = true
    }
  }, [])

  const offerProducts = useMemo(() => {
    return products
      .map((product) => ({ product, offer: getProductOffer(product) }))
      .filter((item) => item.offer.hasOffer)
      .slice(0, 4)
  }, [products])

  const categoryCount = useMemo(() => {
    return new Set(products.map((product) => product.category).filter(Boolean)).size
  }, [products])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-kicker, .hero-title, .hero-copy, .hero-actions, .hero-stat', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.09,
        ease: 'power3.out',
      })
      gsap.to('.hero-float-card', {
        y: -14,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.25,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 6

    const group = new THREE.Group()
    scene.add(group)

    const red = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.45, metalness: 0.12 })
    const amber = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.55, metalness: 0.05 })
    const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.08 })

    const shapes = [
      new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 1.15), red),
      new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), amber),
      new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.18, 16, 42), white),
    ]
    shapes[0].position.set(-1.25, 0.1, 0)
    shapes[1].position.set(0.72, 0.75, -0.3)
    shapes[2].position.set(1.25, -0.85, 0.15)
    shapes.forEach((shape) => group.add(shape))

    scene.add(new THREE.AmbientLight(0xffffff, 1.1))
    const light = new THREE.DirectionalLight(0xffffff, 2.6)
    light.position.set(3, 4, 5)
    scene.add(light)

    let frameId = 0
    const resize = () => {
      const { clientWidth, clientHeight } = canvas
      renderer.setSize(clientWidth, clientHeight, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      camera.aspect = clientWidth / Math.max(clientHeight, 1)
      camera.updateProjectionMatrix()
    }

    const animate = () => {
      group.rotation.y += 0.006
      group.rotation.x = Math.sin(Date.now() * 0.0008) * 0.14
      shapes[0].rotation.x += 0.01
      shapes[1].position.y = 0.78 + Math.sin(Date.now() * 0.0015) * 0.08
      shapes[2].rotation.z += 0.012
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      shapes.forEach((shape) => {
        shape.geometry.dispose()
      })
      red.dispose()
      amber.dispose()
      white.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <section ref={heroRef} id="banner" className="chase-hero relative overflow-hidden" aria-label="Promotional banner">
      <div className="chase-hero__mesh" aria-hidden />
      <div className="container relative z-10 grid min-h-[560px] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="max-w-3xl">
          <p className="hero-kicker mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-yellow-200 backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden />
            {offerProducts.length ? `${offerProducts.length} Live Offer${offerProducts.length > 1 ? 's' : ''}` : 'Online Catalogue'}
          </p>

          <h1 className="hero-title text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-7xl">
            Shop quality products,
            <span className="block text-yellow-300">smoothly online.</span>
          </h1>

          <p className="hero-copy mt-5 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
            Bizmart inspired shopping experience: quick categories, clear prices,
            and smooth browsing for everyday essentials.
          </p>

          <div className="hero-actions mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-300 px-6 py-3 text-sm font-black text-slate-950 shadow-[0_18px_45px_rgba(250,204,21,0.28)] transition hover:-translate-y-0.5 hover:bg-yellow-200"
            >
              Shop products
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18"
            >
              Browse categories
            </a>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[
              [products.length ? `${products.length}+` : 'Live', 'Products'],
              ['Fast', 'Delivery'],
              [offerProducts.length ? offerProducts.length : categoryCount || 'Easy', offerProducts.length ? 'Offers' : 'Categories'],
            ].map(([value, label]) => (
              <div key={label} className="hero-stat rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
                <p className="text-xl font-black sm:text-2xl">{value}</p>
                <p className="mt-1 text-xs font-medium text-white/65">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px]">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

          {offerProducts.length > 0 && (
            <div className="hero-float-card absolute left-2 top-8 rounded-3xl border border-white/20 bg-white/90 p-4 shadow-2xl backdrop-blur sm:left-8">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-600 text-white">
                  <BadgePercent className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-black text-slate-950">
                    {offerProducts[0].offer.label}
                  </p>
                  <p className="text-xs text-slate-500">Live from admin panel</p>
                </div>
              </div>
            </div>
          )}

          <div className="hero-float-card absolute bottom-10 right-2 rounded-3xl border border-white/20 bg-white/90 p-4 shadow-2xl backdrop-blur sm:right-8">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-300 text-slate-950">
                <Truck className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-black text-slate-950">Quick Dispatch</p>
                <p className="text-xs text-slate-500">Fresh stock, packed fast</p>
              </div>
            </div>
          </div>

          {offerProducts.length > 0 && (
            <div className="absolute left-1/2 top-1/2 w-[min(86vw,430px)] -translate-x-1/2 -translate-y-1/2 rounded-[2.2rem] border border-white/20 bg-white/12 p-5 shadow-[0_35px_90px_rgba(15,23,42,0.28)] backdrop-blur-md">
              <div className="rounded-[1.7rem] bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Live from admin</p>
                    <h3 className="text-2xl font-black text-slate-950">Current offers</h3>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-red-600" aria-hidden />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {offerProducts.map(({ product, offer }) => (
                    <Link key={product._id || product.name} to="/products" className="rounded-2xl bg-slate-100 p-3 transition hover:bg-red-50">
                      <div className="mb-3 h-20 overflow-hidden rounded-2xl bg-white">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder.png'
                          }}
                        />
                      </div>
                      <p className="line-clamp-1 text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="mt-0.5 text-xs font-black text-red-600">
                        {offer.discountPercent ? `${offer.discountPercent}% OFF` : offer.label}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Banner
