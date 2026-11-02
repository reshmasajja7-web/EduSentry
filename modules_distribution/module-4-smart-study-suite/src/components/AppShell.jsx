import { useEffect, useState, useRef, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Sidebar from './Sidebar.jsx'

export default function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sidebarShrunk, setSidebarShrunk] = useState(false)
  const [manualOverride, setManualOverride] = useState(false)
  const mainRef = useRef(null)

  const { pathname } = useLocation()

  // Close mobile navigation on route change
  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  // Scroll listener for dynamic sidebar shrinking
  useEffect(() => {
    const handleScroll = () => {
      // If user hasn't explicitly locked the sidebar open, shrink it on scroll down
      const scrollPos = window.scrollY || document.documentElement.scrollTop || (mainRef.current ? mainRef.current.scrollTop : 0)

      if (scrollPos > 50) {
        if (!manualOverride) {
          setSidebarShrunk(true)
        }
      } else {
        setSidebarShrunk(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    const mainEl = mainRef.current
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (mainEl) mainEl.removeEventListener('scroll', handleScroll)
    }
  }, [manualOverride])

  const handleToggleShrunk = useCallback(() => {
    setSidebarShrunk((prev) => {
      const next = !prev
      setManualOverride(true)
      return next
    })
  }, [])

  return (
    <div className="flex min-h-screen w-full bg-transparent text-primary transition-colors duration-300">
      <Sidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        shrunk={sidebarShrunk}
        onToggleShrunk={handleToggleShrunk}
      />

      <div className="flex min-w-0 flex-1 flex-col bg-transparent">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 border-b border-theme bg-[#070d18]/90 backdrop-blur-md px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-theme text-primary transition-colors hover:border-accent hover:text-accent"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="font-display text-[1.05rem] font-semibold text-primary">
            Edu<span className="text-accent">Sentry</span>
          </span>
        </header>

        {/* Main application content */}
        <main ref={mainRef} className="min-w-0 flex-1 bg-transparent transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  )
}