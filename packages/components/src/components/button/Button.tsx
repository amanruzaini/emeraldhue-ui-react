import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export type ButtonVariant = 'Primary' | 'Secondary' | 'Tertiary' | 'Destructive'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type ButtonContent = 'Label + icon' | 'Icon only'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'font-default font-weight-medium',
    'rounded-md',
    'transition-colors duration-quick-1',
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
    const buttonLabel = label ?? children
    const iconSizeClass = iconSizeClassBySize[size]

    return (
      <button
        data-slot="button"
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          isIconOnly && 'aspect-square',
          !isIconOnly && 'gap-2',
          className
        )}
        {...props}
      >
        {isIconOnly ? (
          <span className={cn('shrink-0', iconSizeClass)}>{icon}</span>
        ) : (
          <>
            {iconLeading && leadIcon && (
              <span className={cn('shrink-0', iconSizeClass)}>
                {leadIcon}
              </span>
            )}
            <span className="whitespace-nowrap">{buttonLabel}</span>
            {iconTrailing && trailIcon && (
              <span className={cn('shrink-0', iconSizeClass)}>
                {trailIcon}
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
