import { ChevronLeft } from 'lucide-react'
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
      <ChevronLeft className="h-4 w-4 text-white/70" aria-hidden />
    </Link>
  )
}
