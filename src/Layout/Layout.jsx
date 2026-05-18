import { useState } from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import MobileBottomNav from '../Components/MobileBottomNav/MobileBottomNav'
import { Outlet, useLocation } from 'react-router-dom'
import Search from '../Components/Search/Search'
import { useIsMobile } from '../hooks/useIsMobile'
import whatsapp from '../assets/whatsapp.png'
import './Layout.css'

function Layout() {
    const [openSearch, setOpenSearch] = useState(false)
    const location = useLocation().pathname
    const isAdmin = location?.includes('admin')
    const isMobile = useIsMobile()
    const showMobileTabs = !isAdmin && isMobile

    return (
        <div className="store-shell">
            <Navbar setOpenSearch={setOpenSearch} isMobile={isMobile} />
            {openSearch && <Search setOpenSearch={setOpenSearch} />}
            <main
                id="layout"
                className={`site-main min-h-[70.5vh]${showMobileTabs ? ' has-mobile-nav' : ''}`}
            >
                <Outlet />
            </main>
            <Footer isMobile={isMobile} />
            {showMobileTabs && (
                <MobileBottomNav onSearch={() => setOpenSearch(true)} />
            )}
            {!isAdmin && (
                <a
                    href="https://wa.me/923226350143"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`whatsapp fixed z-[100] rounded-full bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)] ring-1 ring-slate-200 transition hover:-translate-y-1${showMobileTabs ? ' whatsapp--above-tabs' : ''}`}
                >
                    <img src={whatsapp} alt="Chat on WhatsApp" className="h-12 w-12 sm:h-14 sm:w-14" />
                </a>
            )}
        </div>
    )
}

export default Layout
