export default function Btn({
  children,
  variant = 'solid',
  className = '',
  ...props
}) {
  const base =
    'rounded-xl px-6 py-3 text-[0.89rem] font-semibold tracking-wide transition-all duration-200 disabled:cursor-not-allowed'

  const styles =
    variant === 'solid'
      ? 'border border-[#d4a72c] bg-[#d4a72c] text-[#070d18] hover:bg-[#e0b83f] hover:border-[#e0b83f] disabled:border-[#263653] disabled:bg-transparent disabled:text-[#777f8f]'
      : 'border border-[#263653] bg-transparent text-[#f5f1e8] hover:border-[#d4a72c] hover:text-[#d4a72c] disabled:text-[#777f8f] disabled:opacity-60'

  return (
    <button
      className={`${base} ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}