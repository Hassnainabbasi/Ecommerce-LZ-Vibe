import React, { useState } from 'react'
const backendApi = import.meta.env.VITE_API_BASE

import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill all fields')
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${backendApi}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Login failed')
        return
      }

      toast.success('Login successful')
      localStorage.setItem('user', JSON.stringify(data))
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Something went wrong while logging in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page bg-slate-50">
      <div className="auth-card page-card w-full max-w-md border-slate-200 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-teal-700">
          Welcome Back
        </h1>

        <p className="text-center text-slate-500 mb-5 sm:mb-6 text-xs sm:text-sm">
          Sign in to continue shopping
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="email" className="block text-slate-700 mb-2 text-xs sm:text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-slate-700 mb-2 text-xs sm:text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm sm:text-base transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-5 sm:mt-6 text-xs sm:text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
