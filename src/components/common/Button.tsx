'use client'

import { forwardRef } from 'react'
import { Spinner } from './Spinner'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonStyles'

export type { ButtonSize, ButtonVariant }

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={buttonClassName({ variant, size, className })}
        {...props}>
        {isLoading ? <Spinner size="sm" /> : leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'
