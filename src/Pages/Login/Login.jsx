import React, { useState } from 'react'
const backendApi = import.meta.env.VITE_API_BASE

import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
const Login = () => {
  const [userType, setUserType] = useState('customer') // 'customer' or 'worker'
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

      if (userType === 'customer') {
        // Customer/User Login
        const res = await fetch(`${backendApi}users/login`, {
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
        localStorage.setItem("user", JSON.stringify(data));
        navigate('/')
      } else {
        // Worker/Admin Login
        const res = await fetch(`${backendApi}api/admin/login`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
          toast.error(data.error || data.message || 'Invalid credentials')
          return
        }

        if (data.token) {
          localStorage.setItem("adminToken", data.token);
        }

        toast.success('Admin login successful')
        navigate('/admin', { replace: true })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Something went wrong while logging in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 sm:py-12 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 px-4">
      <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Welcome Back</h1>
        
        {/* User Type Selection */}
        <div className="mb-5 sm:mb-6">
          <p className="text-center text-gray-600 mb-3 text-xs sm:text-sm font-medium">Login as:</p>
          <div className="flex gap-2 sm:gap-3 justify-center">
            <button
              type="button"
              onClick={() => setUserType('customer')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                userType === 'customer'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-user mr-1 sm:mr-2"></i>
              Customer
            </button>
            <button
              type="button"
              onClick={() => setUserType('worker')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                userType === 'worker'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-user-tie mr-1 sm:mr-2"></i>
              Worker
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 mb-5 sm:mb-6 text-xs sm:text-sm">
          {userType === 'customer' 
            ? 'Sign in to continue shopping' 
            : 'Sign in to access admin panel'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2 text-xs sm:text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 transition"
              placeholder={userType === 'customer' ? 'customer@example.com' : 'admin@example.com'}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2 text-xs sm:text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 transition"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login as {userType === 'customer' ? 'Customer' : 'Worker'}
              </span>
            )}
          </button>
        </form>

        {userType === 'customer' && (
          <p className="text-center text-gray-600 mt-5 sm:mt-6 text-xs sm:text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-600 font-semibold">
              Register here
            </Link>
          </p>
        )}
        
        {userType === 'worker' && (
          <p className="text-center text-gray-600 mt-5 sm:mt-6 text-xs sm:text-sm">
            Need admin access? Contact your administrator
          </p>
        )}
      </div>
    </div>
  )
}

export default Login;