import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export type ButtonVariant = 'Primary' | 'Secondary' | 'Tertiary' | 'Destructive'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'font-default font-weight-medium',
    'rounded-md',
    'transition-all duration-quick-3',
    'focus-visible:outline-none',
    'disabled:no-ring disabled:pointer-events-none disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        Primary: [
          'bg-brand',
          'text-all-white',
          'border-solid border-t-xs border-x-xs',
          'border-brand-strong',
          'default-ring-bezel',
          'hover:bg-brand-hover',
          'hover:hover-ring-bezel',
          'focus-visible:focus-ring-bezel',
          'active:bg-brand-active',
          'disabled:bg-brand-disabled',
          'disabled:border-brand-disabled',
        ],
        Secondary: [
          'bg-default',
          'text-strong',
          'border-solid border-t-xs border-x-xs',
          'border-default',
          'default-ring-bezel',
          'hover:bg-neutral',
          'hover:hover-ring-bezel',
          'focus-visible:focus-ring-bezel',
          'active:bg-neutral-hover',
          'disabled:bg-disabled',
          'disabled:text-inverted-disabled',
          'disabled:border-disabled',
        ],
        Tertiary: [
          'bg-transparent',
          'text-strong',
          'hover:bg-neutral',
          'active:bg-neutral-hover',
          'focus-visible:bg-default',
          'focus-visible:focus-ring',
          'disabled:text-disabled',
        ],
        Destructive: [
          'bg-error',
          'text-all-white',
          'border-solid border-t-xs border-x-xs',
          'border-error-strong',
          'default-ring-bezel',
          'hover:bg-error-hover',
          'hover:hover-ring-bezel',
          'focus-visible:focus-ring-bezel',
          'active:bg-error-active',
          'disabled:bg-error-disabled',
          'disabled:border-error-disabled',
        ],
      },
      size: {
        xs: 'border-b-xs p-1 text-body-xs',
        sm: 'border-b-sm',
        md: 'border-b-md p-6 text-body-sm',
        lg: 'border-b-lg px-6 py-7 text-body-md',
      },
    },
    compoundVariants: [
      {
        variant: 'Primary',
        size: 'sm',
        className: 'px-6 py-4 text-body-sm',
      },
      {
        variant: 'Secondary',
        size: 'sm',
        className: 'p-4 text-body-xs',
      },
      {
        variant: 'Tertiary',
        size: 'sm',
        className: 'p-4 text-body-sm',
      },
      {
        variant: 'Destructive',
        size: 'sm',
        className: 'px-6 py-4 text-body-xs',
      },
    ],
    defaultVariants: {
      variant: 'Primary',
      size: 'md',
    },
  }
)

const iconSizeClassBySize: Record<ButtonSize, string> = {
  xs: 'size-icon-sm',
  sm: 'size-icon-sm',
  md: 'size-icon-md',
  lg: 'size-icon-md',
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Maps to Figma "Type" property */
  variant?: ButtonVariant
  /** Maps to Figma "Size" property */
  size?: ButtonSize
  /** Maps to Figma "Content" = "Icon only". */
  iconOnly?: boolean
  /** Maps to Figma "Icon Leading" property. Shown when provided. */
  startIcon?: React.ReactNode
  /** Maps to Figma "Icon Trailing" property. Shown when provided. */
  endIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'Primary',
      size = 'md',
      iconOnly = false,
      startIcon,
      endIcon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const iconSizeClass = iconSizeClassBySize[size]

    return (
      <button
        data-slot="button"
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          iconOnly && 'aspect-square',
          !iconOnly && 'gap-2',
          className
        )}
        {...props}
      >
        {iconOnly ? (
          <span className={cn('shrink-0', iconSizeClass)}>{children}</span>
        ) : (
          <>
            {startIcon && (
              <span className={cn('shrink-0', iconSizeClass)}>
                {startIcon}
              </span>
            )}
            <span className="whitespace-nowrap">{children}</span>
            {endIcon && (
              <span className={cn('shrink-0', iconSizeClass)}>
                {endIcon}
              </span>
            )}
          </>
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
