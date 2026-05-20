import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import './SplashScreen.css'

const SPLASH_MS = 2400
const FADE_MS = 500

function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('show')

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('hide'), SPLASH_MS)
    const doneTimer = setTimeout(() => onComplete?.(), SPLASH_MS + FADE_MS)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`splash-screen${phase === 'hide' ? ' splash-screen--hide' : ''}`}
      role="presentation"
      aria-hidden={phase === 'hide'}
    >
      <div className="splash-screen__content">
        <div className="splash-screen__logo-wrap">
          <img src={logo} alt="LZ Vibe" className="splash-screen__logo" />
        </div>
        <p className="splash-screen__tagline">
          <span className="text-teal-600">Har Sale Se </span>
          <span className="text-orange-500">Behter</span>
        </p>
        <div className="splash-screen__loader" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
