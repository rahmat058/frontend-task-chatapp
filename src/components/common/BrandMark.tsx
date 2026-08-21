import { cn } from '@/lib/utils/cn'

export function BrandMark({ size = 'md', className }: { size?: 'sm' | 'md'; className?: string }) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'

  return (
    // Decorative when paired with the ChatApp wordmark; parent supplies the name.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/nav-logo.svg"
      alt=""
      width={32}
      height={32}
      className={cn('shrink-0', box, className)}
      aria-hidden="true"
    />
  )
}
