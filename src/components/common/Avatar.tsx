'use client';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isGroup?: boolean;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

/** Deterministic color from name */
function getColor(name: string): string {
  const colors = [
    'from-violet-500 to-indigo-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-fuchsia-500 to-purple-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string, isGroup?: boolean): string {
  if (isGroup) return name.slice(0, 1).toUpperCase();
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function Avatar({ name, size = 'md', className = '', isGroup }: AvatarProps) {
  const initials = getInitials(name, isGroup);
  const gradient = getColor(name);

  return (
    <div
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center
        bg-gradient-to-br ${gradient}
        text-white font-semibold shrink-0 select-none
        ${className}
      `}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
}
