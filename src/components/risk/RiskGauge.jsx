export default function RiskGauge({
  score = 0,
  level = 'Low Risk',
  size = 200,
  label = 'Risk Score',
}) {
  const radius = 72
  const circumference = 2 * Math.PI * radius

  const progress = Math.max(0, Math.min(100, score))
  const dashOffset =
    circumference - (progress / 100) * circumference

  const getColor = () => {
    if (score >= 70) return '#C1573F'
    if (score >= 40) return '#E8A33D'
    return '#4ADE80'
  }

  const getLevelClass = () => {
    if (score >= 70) {
      return 'border-[#C1573F] text-[#C1573F] bg-[#C1573F]/10'
    }

    if (score >= 40) {
      return 'border-[#E8A33D] text-[#E8A33D] bg-[#E8A33D]/10'
    }

    return 'border-[#4ADE80] text-[#4ADE80] bg-[#4ADE80]/10'
  }

  const color = getColor()

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ width: size }}
    >
      {/* Gauge */}
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          className="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#1E2B46"
            strokeWidth="18"
          />

          {/* Progress ring */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="font-display font-semibold leading-none text-white"
            style={{
              fontSize: size * 0.19,
            }}
          >
            {score}%
          </div>

          <div
            className="mt-1 font-mono uppercase tracking-[0.08em] text-slate-400"
            style={{
              fontSize: size * 0.045,
            }}
          >
            {label}
          </div>
        </div>
      </div>

      {/* Risk level */}
      <div
        className={`mt-3 rounded-full border px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-wide ${getLevelClass()}`}
      >
        {level}
      </div>
    </div>
  )
}