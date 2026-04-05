import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function Login() {
  const { dispatch } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (email !== 'employee@tmc.com' || password !== '123456') {
      setError('Invalid email or password. Please try again.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      dispatch({ type: 'LOGIN', payload: { email } })
      navigate('/')
    }, 800)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col justify-center px-10 py-12 bg-white max-w-lg">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-10 h-10">
              <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                <rect x="8" y="4" width="10" height="32" rx="2" fill="#4b5563"/>
                <rect x="22" y="10" width="10" height="26" rx="2" fill="#6b7280"/>
                <rect x="8" y="4" width="10" height="10" rx="2" fill="#374151"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">TMC</span>
            <span className="text-gray-300 text-2xl font-light">|</span>
            <span className="text-2xl font-bold text-tmc-500">ESS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 leading-tight">
            Welcome to TMC Employee Self Service Portal
          </h1>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            Your personalized Employee Self-Service portal making it simple to manage
            your work life. Access your records, apply for leave, and stay updated,
            all in one secure place.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-tmc-400 focus:ring-2 focus:ring-tmc-100 transition-all"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-tmc-400 focus:ring-2 focus:ring-tmc-100 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm text-tmc-600 hover:text-tmc-700 font-medium">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tmc-500 hover:bg-tmc-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </>
            ) : 'Log In'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-gray-400 text-sm">Or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <div className="space-y-3">
          <button className="w-full bg-sidebar hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-200">
            Sign in with TMC ID
          </button>
          <button className="w-full bg-sidebar hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-200">
            Sign in with TMC AI ID
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          Demo: <span className="font-mono text-gray-600">employee@tmc.com</span> / <span className="font-mono text-gray-600">123456</span>
        </p>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden md:flex flex-1 bg-gray-600 items-center justify-center">
        <img
          src="/login-illustration.jpeg"
          alt="TMC ESS Portal"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
