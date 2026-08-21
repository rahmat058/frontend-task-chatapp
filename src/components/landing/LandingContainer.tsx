import { cn } from '@/lib/utils/cn'

export function LandingContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('mx-auto max-w-[1200px] px-6 md:px-10', className)}>{children}</div>
}
