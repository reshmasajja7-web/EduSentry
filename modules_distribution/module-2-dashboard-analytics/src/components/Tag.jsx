export default function Tag({
  active,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={`select-none rounded-xl border px-4 py-2 text-[0.87rem] font-medium transition-all duration-200 ${
        active
          ? 'border-[#d4a72c] bg-[#211f18] text-[#d4a72c]'
          : 'border-[#263653] bg-[#111a2b] text-[#aaa49a] hover:border-[#d4a72c] hover:text-[#d4a72c]'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}