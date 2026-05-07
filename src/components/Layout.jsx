import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Sidebar from './Sidebar.jsx'
import logoMain from '../assets/logo_main.jpeg'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { state } = useApp()
  const initials = state.profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'MI'

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* TMC ESS Logo */}
            <div className="flex items-center">
              <img src={logoMain} alt="TMC ESS" className="h-9 w-auto object-contain mix-blend-multiply" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Monitor icon */}
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Notification bell */}
            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
            </button>

            {/* User dropdown */}
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
              <div className="w-8 h-8 rounded-full bg-tmc-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{state.profile.name}</span>
              <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
