'use client';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center animate-fade-in">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-text-muted)] text-2xl">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-[var(--color-text-primary)]">{title}</p>
        {description && (
          <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
