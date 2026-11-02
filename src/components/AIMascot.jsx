export default function AIMascot({ size = 80, className = '' }) {
  return (
    <div className={`relative animate-float-gentle ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full animate-spin-slow"
        style={{
          background: 'conic-gradient(from 0deg, transparent, var(--accent), transparent)',
          opacity: 0.2,
          filter: 'blur(4px)',
        }}
      />
      {/* Orbiting dot */}
      <div className="absolute inset-0 animate-ai-orbit">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }}
        />
      </div>
      {/* Main body */}
      <div
        className="absolute inset-2 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, var(--accent), var(--accent-dim))`,
          boxShadow: '0 0 20px var(--accent-glow), inset 0 2px 4px rgba(255,255,255,0.2)',
        }}
      >
        {/* Face */}
        <div className="relative flex flex-col items-center gap-1.5">
          {/* Eyes */}
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse-soft" />
            <div className="h-2 w-2 rounded-full bg-white animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
          </div>
          {/* Smile */}
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
            <path d="M3 2C5 5 11 5 13 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          </svg>
        </div>
      </div>
      {/* Neural network lines */}
      <svg className="absolute inset-0 w-full h-full animate-neural-pulse" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.3 }}>
        <circle cx="40" cy="40" r="38" stroke="var(--accent-dim)" strokeWidth="0.5" strokeDasharray="3 6" />
        <circle cx="40" cy="40" r="28" stroke="var(--accent-light)" strokeWidth="0.5" strokeDasharray="2 4" />
      </svg>
    </div>
  )
}
