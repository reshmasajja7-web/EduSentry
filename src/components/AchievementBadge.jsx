import { useState, useEffect } from 'react'

export default function AchievementBadge({ icon, title, description, unlocked = false, xp = 0, className = '' }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (unlocked) {
      const timer = setTimeout(() => setRevealed(true), 300)
      return () => clearTimeout(timer)
    }
  }, [unlocked])

  return (
    <div
      className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer ${
        unlocked ? 'hover:scale-105 hover:shadow-elevated' : 'opacity-50 grayscale'
      } ${className}`}
      style={{
        background: unlocked ? 'var(--bg-card)' : 'var(--bg-tertiary)',
        border: `1px solid ${unlocked ? 'var(--accent-dim)' : 'var(--border-primary)'}`,
      }}
    >
      {unlocked && (
        <div
          className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-[8px]"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          ✓
        </div>
      )}
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-all duration-300 ${
            unlocked ? 'animate-bounce-subtle' : ''
          }`}
          style={{ background: unlocked ? 'var(--accent-bg)' : 'var(--bg-secondary)' }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[0.85rem] font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</div>
          <div className="text-[0.72rem] mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</div>
          {xp > 0 && unlocked && (
            <div className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.62rem] font-bold"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
              +{xp} XP
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
