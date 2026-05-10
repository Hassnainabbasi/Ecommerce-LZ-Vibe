import React from 'react'
import logo from '../../assets/logo.png'
import { Link, NavLink } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer id="footer" className='min-h-[80px] shadow-[0_0_2px_#fff]'>
      <div className='container flex justify-between items-center gap-15'>
        <div className="logo">
          <Link to='/' className='flex items-center'>
            <img className='w-25' src={logo} alt="" />
            <h1 className='font-semibold text-lg tracking-tight text-slate-900'>Shop</h1>
          </Link>
        </div>
        <nav className='flex-1'>
          <ul className='flex justify-center flex-wrap gap-10 text-xl items-center'>
            <li>
              <NavLink to='/about'>About</NavLink>
            </li>
            <li>
              <NavLink to='/contact'>Need Help</NavLink>
            </li>
            <li>
              <NavLink to='/return-policy'>Return Policy</NavLink>
            </li>
            <li>
              <NavLink to='/terms-and-conditions'>Terms & Conditions</NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className='shadow-[0_0_2px_#fff]'>
        <p className='container text-slate-500 py-5 text-sm leading-relaxed'>
          Copyright © 2026 Your Store Name. All rights reserved. <br />
          Add your business address here. <br />
          <a href="#" className="text-blue-600 hover:text-blue-700">Facebook</a>
          <span className="mx-2 text-slate-300">|</span>
          <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700">Email</a>
        </p>
      </div>
    </footer>
  )
}

export default Footer