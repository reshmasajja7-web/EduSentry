// Shared header used at the top of each application module.

export default function ModuleHeader({ kicker, title, description }) {
  return (
    <div className="mb-10 border-b border-[#263653] pb-6">
      {/* Gold section label */}
      <div className="flex items-center gap-2.5 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-gold font-semibold">
        <span className="inline-block h-px w-[22px] bg-gold" />
        {kicker}
      </div>

      {/* Main module heading with high-visibility white text */}
      <h2 className="mt-3 mb-2 font-display text-[clamp(1.9rem,3.4vw,2.5rem)] font-bold tracking-tight text-white">
        {title}
      </h2>

      {/* High-contrast legible description */}
      {description && (
        <p className="max-w-[650px] text-[0.96rem] leading-relaxed text-[#CBD5E1]">
          {description}
        </p>
      )}
    </div>
  )
}