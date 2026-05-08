import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Survey() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl font-extrabold text-gray-200 select-none">404</div>
      <h2 className="text-xl font-bold text-gray-700 mt-2">Page Not Found</h2>
      <p className="text-gray-400 text-sm mt-2 max-w-xs">
        This page is currently unavailable or under construction.
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn-primary mt-6 px-6"
      >
        Back to Home
      </button>
    </div>
  )
}
