import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import type { ButtonVariant, ButtonSize, ButtonContent } from './Button.types'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-[var(--eh-spacing-2)]',
    'font-[family-name:var(--eh-font-type-default)] font-[var(--eh-font-weight-medium)]',
    'rounded-[var(--eh-border-radius-md)]',
    'border-solid',
    'border-t-[length:var(--eh-border-width-xs)]',
    'border-l-[length:var(--eh-border-width-xs)]',
    'border-r-[length:var(--eh-border-width-xs)]',
    'border-b-[length:var(--eh-border-width-md)]',
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
          'bg-[var(--eh-colour-bg-brand)]',
          'text-[var(--eh-colour-text-all-white)]',
          'border-[var(--eh-colour-border-brand-strong)]',
          'hover:bg-[var(--eh-colour-bg-brand-hover)]',
          'active:bg-[var(--eh-colour-bg-brand-active)]',
          'disabled:bg-[var(--eh-colour-bg-brand-disabled)]',
          'disabled:border-[var(--eh-colour-border-brand-disabled)]',
        ],
        Secondary: [
          'bg-[var(--eh-colour-bg-default)]',
          'text-[var(--eh-colour-text-brand)]',
          'border-[var(--eh-colour-border-brand)]',
          'hover:bg-[var(--eh-colour-bg-neutral)]',
          'active:bg-[var(--eh-colour-bg-neutral-hover)]',
          'disabled:text-[var(--eh-colour-text-brand-disabled)]',
          'disabled:border-[var(--eh-colour-border-brand-disabled)]',
        ],
        Tertiary: [
          'bg-transparent',
          'text-[var(--eh-colour-text-brand)]',
          'border-transparent',
          'hover:bg-[var(--eh-colour-bg-neutral)]',
          'active:bg-[var(--eh-colour-bg-neutral-hover)]',
          'disabled:text-[var(--eh-colour-text-brand-disabled)]',
        ],
        Destructive: [
          'bg-[var(--eh-colour-bg-error)]',
          'text-[var(--eh-colour-text-all-white)]',
          'border-[var(--eh-colour-border-error-strong)]',
          'hover:bg-[var(--eh-colour-bg-error-hover)]',
          'active:bg-[var(--eh-colour-bg-error-active)]',
          'disabled:bg-[var(--eh-colour-bg-error-disabled)]',
          'disabled:border-[var(--eh-colour-border-error-disabled)]',
        ],
      },
      size: {
        xs: 'px-[var(--eh-spacing-4)] py-[var(--eh-spacing-2)] text-[length:var(--eh-font-size-body-xs)] [--icon-size:12px]',
        sm: 'px-[var(--eh-spacing-6)] py-[var(--eh-spacing-4)] text-[length:var(--eh-font-size-body-sm)] [--icon-size:16px]',
        md: 'p-[var(--eh-spacing-6)] text-[length:var(--eh-font-size-body-sm)] [--icon-size:20px]',
        lg: 'px-[var(--eh-spacing-8)] py-[var(--eh-spacing-5)] text-[length:var(--eh-font-size-body-md)] [--icon-size:20px]',
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
