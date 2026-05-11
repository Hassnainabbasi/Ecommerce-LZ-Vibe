import React, { useState } from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import Search from '../Components/Search/Search'
import whatsapp from '../assets/whatsapp.png'
import './Layout.css'

function Layout() {
    const [openSearch, setOpenSearch] = useState(false)
    const location = useLocation().pathname
    return (
        <>
            <Navbar setOpenSearch={setOpenSearch} />
            {openSearch && <Search setOpenSearch={setOpenSearch} />}
            <main id='layout' className='min-h-[70.5vh]'>
                {<Outlet />}
            </main>
            <Footer />
            {/* Whatsapp Button */}
            {
                !location?.includes('admin') &&
                <a
                    href="https://wa.me/923226350143"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp fixed z-[100000] bottom-[5%] right-[3%] rounded-full bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)] ring-1 ring-slate-200 transition hover:-translate-y-1"
                >
                    <img src={whatsapp} alt="go to whatsapp" className='h-14 w-14 sm:h-16 sm:w-16' />
                </a>
            }
        </>
    )
}

export default Layout