import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import './../Navbar/Navbar.css'

export default function AdminNavbar() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header id="header" className="sticky top-0 z-[1000]">
      <div className="nav-main">
        <div className="container nav-header-row">
          <div className="logo nav-logo-center">
            <span className="logo-ring">
              <img className="h-11 w-11 rounded-full object-cover" src={logo} alt="LZ Vibe" />
            </span>
            {!isMobile && (
              <span className="logo-text">
                <span className="block text-lg font-bold tracking-tight text-slate-950">LZ Vibe</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">Admin Panel</span>
              </span>
            )}
          </div>

          <div />

          <div className="buttons-container">
            <Link to="/admin" className="nav-account">
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
