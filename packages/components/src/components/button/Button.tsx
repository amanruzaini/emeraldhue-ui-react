import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import type { ButtonVariant, ButtonSize, ButtonContent } from './Button.types'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-[var(--eh-spacing-2)]',
    'font-default font-weight-medium',
    'rounded-md',
    'border-solid',
    'border-t-xs',
    'border-l-xs',
    'border-r-xs',
    'border-b-sm',
    'default-ring',
    'transition-colors duration-quick-1',
    'focus-visible:outline-none focus-visible:focus-ring',
    'hover:hover-ring',
    'disabled:no-ring disabled:pointer-events-none disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        Primary: [
          'bg-brand',
          'text-all-white',
          'border-brand-strong',
          'hover:bg-brand-hover',
          'active:bg-brand-active',
          'disabled:bg-brand-disabled',
          'disabled:border-brand-disabled',
        ],
        Secondary: [
          'bg-default',
          'text-brand',
          'border-brand',
          'hover:bg-neutral',
          'active:bg-neutral-hover',
          'disabled:text-brand-disabled',
          'disabled:border-brand-disabled',
        ],
        Tertiary: [
          'bg-transparent',
          'text-brand',
          'border-transparent',
          'hover:bg-neutral',
          'active:bg-neutral-hover',
          'disabled:text-brand-disabled',
        ],
        Destructive: [
          'bg-error',
          'text-all-white',
          'border-error-strong',
          'hover:bg-error-hover',
          'active:bg-error-active',
          'disabled:bg-error-disabled',
          'disabled:border-error-disabled',
        ],
      },
      size: {
        xs: 'px-4 py-2 text-body-xs [--icon-size:var(--eh-icon-xs)]',
        sm: 'px-6 py-4 text-body-sm [--icon-size:var(--eh-icon-sm)]',
        md: 'p-6 text-body-sm [--icon-size:var(--eh-icon-md)]',
        lg: 'px-8 py-5 text-body-md [--icon-size:var(--eh-icon-md)]',
      },
    },
    defaultVariants: {
      variant: 'Primary',
      size: 'md',
    },
  }
)

const iconStyle = { width: 'var(--icon-size)', height: 'var(--icon-size)' }

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Maps to Figma "Type" property */
  variant?: ButtonVariant
  /** Maps to Figma "Size" property */
  size?: ButtonSize
  /** Maps to Figma "Content" property — controls label vs icon-only mode */
  content?: ButtonContent
  /** Maps to Figma "Icon Leading" boolean — only visible when content is "Label + icon" */
  iconLeading?: boolean
  /** Maps to Figma "Icon Trailing" boolean — only visible when content is "Label + icon" */
  iconTrailing?: boolean
  /** Icon node rendered in the leading position */
  leadIcon?: React.ReactNode
  /** Icon node rendered in the trailing position */
  trailIcon?: React.ReactNode
  /** Icon rendered in icon-only mode — only visible when content is "Icon only" */
  icon?: React.ReactNode
  /** Button label text — only visible when content is "Label + icon" */
  label?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'Primary',
      size = 'md',
      content = 'Label + icon',
      iconLeading = false,
      iconTrailing = false,
      leadIcon,
      trailIcon,
      icon,
      label,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isIconOnly = content === 'Icon only'

    return (
      <button
        data-slot="button"
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          isIconOnly && 'aspect-square',
          className
        )}
        {...props}
      >
        {isIconOnly ? (
          <span style={iconStyle}>{icon}</span>
        ) : (
          <>
            {iconLeading && leadIcon && (
              <span style={iconStyle}>{leadIcon}</span>
            )}
            {label ?? children}
            {iconTrailing && trailIcon && (
              <span style={iconStyle}>{trailIcon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
