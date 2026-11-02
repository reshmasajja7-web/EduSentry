// Shared dark-theme panel used throughout the application.

export default function Block({
  idx,
  title,
  hint,
  children,
  className = '',
}) {
  return (
    <div
      className={`relative mb-6 rounded-2xl border border-[#263653] bg-[#111a2b]/95 backdrop-blur-md px-8 py-8 sm:px-6 sm:py-6 shadow-xl ${className}`}
    >
      {(idx || title) && (
        <div className="mb-4 flex items-center gap-3">
          {idx && (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#211f18] text-xs font-bold text-gold border border-gold/30">
              {idx}
            </span>
          )}

          {title && (
            <h3 className="font-display text-[1.2rem] font-bold text-white tracking-tight">
              {title}
            </h3>
          )}
        </div>
      )}

      {hint && (
        <p className="mb-5 text-[0.88rem] leading-relaxed text-[#CBD5E1]">
          {hint}
        </p>
      )}

      {children}
    </div>
  )
}