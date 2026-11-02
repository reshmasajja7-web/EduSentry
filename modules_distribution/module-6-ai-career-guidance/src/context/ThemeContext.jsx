import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

export const THEME_OPTIONS = [
  {
    id: 'dark',
    name: 'Midnight Dark',
    icon: '🌙',
    badge: 'Standard Theme',
    description: 'EduSentry official midnight ambient dark theme with radiant gold accents. High-contrast and eye-strain reduced.',
    previewBg: '#070b14',
    previewCard: '#0d1626',
    previewBorder: '#1c2b44',
    previewText: '#FFFFFF',
    previewAccent: '#F59E0B',
  },
]

export function ThemeProvider({ children }) {
  // EduSentry is locked to the official dark theme
  const themeMode = 'dark'
  const resolvedTheme = 'dark'

  // Apply dark theme attributes to document root
  useEffect(() => {
    const root = document.documentElement

    root.setAttribute('data-theme', 'dark')
    root.classList.remove('theme-light')
    root.classList.add('theme-dark')

    root.style.setProperty('--bg-app', '#070b14')
    root.style.setProperty('--bg-sidebar', '#05080f')
    root.style.setProperty('--bg-card', '#0d1626')
    root.style.setProperty('--bg-surface', '#0f182a')
    root.style.setProperty('--text-primary', '#FFFFFF')
    root.style.setProperty('--text-secondary', '#F1F5F9')
    root.style.setProperty('--text-muted', '#CBD5E1')
    root.style.setProperty('--border-primary', '#1c2b44')
    root.style.setProperty('--border-secondary', '#162236')
    root.style.setProperty('--accent', '#F59E0B')
    root.style.setProperty('--accent-light', '#FBBF24')
    root.style.setProperty('--accent-dim', '#D97706')
    root.style.setProperty('--accent-bg', '#211f18')
    root.style.setProperty('--accent-glow', 'rgba(245, 158, 11, 0.25)')
    root.style.setProperty('--glass-bg', 'rgba(13, 22, 38, 0.78)')
    root.style.setProperty('--glass-border', 'rgba(28, 43, 68, 0.85)')
    root.style.colorScheme = 'dark'

    try {
      localStorage.setItem('edusentry-theme-mode', 'dark')
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo(
    () => ({
      themeMode: 'dark',
      setThemeMode: () => {},
      resolvedTheme: 'dark',
      isDark: true,
      isLight: false,
      themeOptions: THEME_OPTIONS,
    }),
    []
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }
  return context
}