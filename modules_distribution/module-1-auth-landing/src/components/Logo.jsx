export default function Logo({
  className = '',
  tagline = 'Learning, watched over',
  compact = false,
  size = 32,
}) {
  return (
    <div
      className={`
        flex items-center ${compact ? 'justify-center' : 'gap-3'}
        ${className}
      `}
    >
      {/* EduSentry Crest Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1b263b" />
            <stop offset="60%" stopColor="#0b1020" />
            <stop offset="100%" stopColor="#070b14" />
          </linearGradient>
          <linearGradient id="goldBorder" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="capGrad" x1="13" y1="13" x2="35" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="24" cy="33" r="7" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Guardian Shield Body */}
        <path
          d="M24 4L40 10V22C40 32.5 33 40.5 24 44C15 40.5 8 32.5 8 22V10L24 4Z"
          fill="url(#shieldGrad)"
          stroke="url(#goldBorder)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Inner Shield Accent Contour */}
        <path
          d="M24 8L36 13V22C36 30 30.5 36.5 24 39.5C17.5 36.5 12 30 12 22V13L24 8Z"
          stroke="rgba(245, 158, 11, 0.3)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Educational Mortarboard Diamond */}
        <polygon
          points="24,13 35,18.5 24,24 13,18.5"
          fill="url(#capGrad)"
          stroke="#FDE68A"
          strokeWidth="1"
        />
        {/* Mortarboard Under-arch & Tassel */}
        <path
          d="M17 21V24.5C17 26.8 20.1 28.2 24 28.2C27.9 28.2 31 26.8 31 24.5V21"
          stroke="#F59E0B"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M33 19V25"
          stroke="#FDE68A"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="33" cy="25.5" r="1.1" fill="#FDE68A" />

        {/* Central Radiant Guardian Beacon (AI Sentinel Core) */}
        <circle cx="24" cy="34" r="5" fill="url(#coreGlow)" />
        <path
          d="M24 30.5L25.2 33.2L28 34L25.2 34.8L24 37.5L22.8 34.8L20 34L22.8 33.2Z"
          fill="#FFFFFF"
        />
      </svg>

      {!compact && (
        <div className="leading-tight">
          <div className="font-display text-[1.12rem] font-bold tracking-tight text-white">
            Edu<span className="text-gold">Sentry</span>
          </div>

          {tagline && (
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-gold">
              {tagline}
            </div>
          )}
        </div>
      )}
    </div>
  )
}