import Link from 'next/link'

interface BackButtonProps {
  href: string
  className?: string
  'aria-label'?: string
}

export function BackButton({
  href,
  className = '',
  'aria-label': ariaLabel = 'Voltar',
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10 hover:border-white/20 ${className}`}
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4 text-white/70"
        aria-hidden
      >
        <path
          d="M19 12H5M12 19l-7-7 7-7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
