import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'

const links = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/app/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/app/learning-workspace', label: 'Learning Workspace', icon: 'book' },
  { to: '/app/risk-prediction', label: 'Risk Prediction', icon: 'pulse' },
  { to: '/app/career-guidance', label: 'Career Guidance', icon: 'compass' },
  { to: '/app/profile', label: 'Profile', icon: 'user' },
]

function Icon({ name, className }) {
  const paths = {
    home: 'M4 11l8-7 8 7M6 9.5V20h5v-6h2v6h5V9.5',
    grid: 'M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z',
    book: 'M4 5.5A2.5 2.5 0 016.5 3H20v15.5a1 1 0 01-1 1H6.5A2.5 2.5 0 014 17V5.5zM6.5 3v15.5',
    pulse: 'M3 12h4l2 7 4-14 2 7h6',
    compass: 'M12 2a10 10 0 100 20 10 10 0 000-20zM15 9l-2.5 6L9 17l2.5-6z',
    user: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0',
    close: 'M6 6l12 12M18 6L6 18',
    logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    chevronLeft: 'M15 19l-7-7 7-7',
    chevronRight: 'M9 5l7 7-7 7',
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}

export default function Sidebar({
  open = false,
  onClose = () => {},
  shrunk = false,
  onToggleShrunk,
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  // Effectively shrunk on desktop if prop is true AND user is not actively hovering
  const isMini = shrunk && !hovered

  function handleLogout() {
    onClose()
    logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Sidebar Container: Dynamic width on desktop, sliding drawer on mobile */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed left-0 top-0 z-50 flex h-screen shrink-0 flex-col overflow-y-auto border-r border-[#263653] bg-[#0b1020] text-primary transition-all duration-300 ease-in-out md:sticky md:left-auto md:top-0 md:z-auto md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${isMini ? 'md:w-[72px]' : 'md:w-[248px]'} w-[260px]`}
      >
        {/* Brand / Logo Area */}
        <div
          className={`flex items-center border-b border-[#263653] py-4 transition-all duration-300 ${
            isMini ? 'justify-center px-2' : 'justify-between px-5'
          }`}
        >
          <Logo compact={isMini} tagline="AI Learning Platform" />

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="shrink-0 rounded-lg p-1 text-secondary transition-colors hover:text-accent md:hidden"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-5">
          {links.map((link) => (
            <div key={link.to} className="relative group">
              <NavLink
                to={link.to}
                end={link.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center rounded-xl border font-medium transition-all duration-200 ${
                    isMini ? 'justify-center px-0 py-2.5' : 'gap-3 px-3.5 py-2.5 text-[0.88rem]'
                  } ${
                    isActive
                      ? 'border-[#E8A33D] bg-[#1b263b] text-white shadow-sm font-semibold'
                      : 'border-transparent text-slate-300 hover:border-[#263653] hover:bg-[#111a2b] hover:text-white'
                  }`
                }
              >
                {/* Icon: Always visible with constant accent color */}
                <Icon
                  name={link.icon}
                  className="h-4 w-4 shrink-0 text-[#E8A33D]"
                />

                {/* Text Label: Hidden only when sidebar is dynamically shrunk on desktop */}
                {!isMini && <span className="truncate">{link.label}</span>}
              </NavLink>

              {/* Floating Tooltip when dynamically shrunk on desktop */}
              {isMini && (
                <div className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 z-50 hidden whitespace-nowrap rounded-lg border border-[#263653] bg-[#0b1020] px-3 py-1.5 font-mono text-[0.75rem] font-medium text-white opacity-0 shadow-xl transition-all duration-150 group-hover:flex group-hover:opacity-100">
                  {link.label}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Footer Profile & Dynamic Collapse Toggle */}
        <div className="border-t border-[#263653] p-3">
          <div className="flex flex-col gap-3">
            <div
              className={`flex items-center ${
                isMini ? 'justify-center' : 'gap-3 px-1'
              }`}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold font-display text-[0.88rem] font-bold text-[#0b1020] shadow-sm"
                title={user?.name || 'Student'}
              >
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>

              {!isMini && (
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.86rem] font-semibold text-white">
                    {user?.name || 'Student'}
                  </div>
                  <div className="truncate font-mono text-[0.7rem] text-muted">
                    {user?.email || 'student@edusentry.edu'}
                  </div>
                </div>
              )}
            </div>

            <div
              className={`flex items-center pt-1 ${
                isMini ? 'flex-col gap-2' : 'justify-between'
              }`}
            >
              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                className={`flex items-center gap-2 rounded-lg text-[0.8rem] font-medium text-slate-400 transition-colors hover:bg-[#162238] hover:text-rust ${
                  isMini ? 'p-2' : 'px-2.5 py-1.5'
                }`}
              >
                <Icon name="logout" className="h-4 w-4 shrink-0 text-[#E8A33D]" />
                {!isMini && <span>Log out</span>}
              </button>

              {/* Manual Shrunk / Expand Toggle button for Desktop */}
              {onToggleShrunk && (
                <button
                  type="button"
                  onClick={onToggleShrunk}
                  title={shrunk ? 'Expand sidebar' : 'Shrink sidebar'}
                  className="hidden rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#162238] hover:text-gold md:flex"
                >
                  <Icon
                    name={isMini ? 'chevronRight' : 'chevronLeft'}
                    className="h-4 w-4"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}