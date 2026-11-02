export default function GlassCard({ children, className = '', hover = true, glow = false, onClick = null }) {
  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-300 ${
        hover ? 'hover:translate-y-[-2px]' : ''
      } ${glow ? 'glow-border' : ''} ${className}`}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        border: '1px solid var(--glass-border)',
        boxShadow: hover ? '0 8px 32px var(--shadow-color)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
