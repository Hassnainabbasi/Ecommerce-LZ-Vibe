import { useState, useCallback } from 'react'
import Collections from '../../Components/Collections/Collections'
import Products from '../Products/Products'
import Banner from '../../Components/Banner/Banner'
import WhyChoose from '../../Components/WhyChoose/WhyChoose'
import SplashScreen from '../../Components/SplashScreen/SplashScreen'
import './Home.css'

const SPLASH_KEY = 'lz-splash-seen'

function Home() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false
    return !sessionStorage.getItem(SPLASH_KEY)
  })

  const finishSplash = useCallback(() => {
    sessionStorage.setItem(SPLASH_KEY, '1')
    setShowSplash(false)
  }, [])

  return (
    <>
      {showSplash && <SplashScreen onComplete={finishSplash} />}

      <div className={`home-page${showSplash ? ' home-page--splash-active' : ''}`}>
        <Collections />
        <Banner />
        <Products />
        <WhyChoose />
      </div>
    </>
  )
}

export default Home
