import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BadgeSemanticSize = 'sm' | 'md' | 'lg'
export type BadgeSemanticAppearance = 'Inverted' | 'Solid'
export type BadgeSemanticStatus = 'Error' | 'Success' | 'Info' | 'Warning'

export interface BadgeSemanticProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Maps to Figma "Size" property */
  size?: BadgeSemanticSize
  /** Maps to Figma "Appearance" property — Inverted is light bg, Solid is dark bg */
  appearance?: BadgeSemanticAppearance
  /** Maps to Figma "Status" property */
  status?: BadgeSemanticStatus
  /** Maps to Figma "Label" text */
  label?: string
  /** Maps to Figma "Icon Leading" boolean — shows/hides leading icon */
  iconLeading?: boolean
  /** Maps to Figma "Icon Leading" icon selection — React node for the leading icon */
  icon?: React.ReactNode
}

// ---------------------------------------------------------------------------
// CVA — Badge variants
// ---------------------------------------------------------------------------

export const badgeSemanticVariants = cva(
  [
    // Base: layout
    'inline-flex items-center',
    'gap-2',
    'overflow-clip',
    'rounded-md',
    // Base: border
    'border-solid border-xs',
    // Base: typography (non-standard composite — body-sm size with body-xs line height)
    'text-[length:var(--eh-font-size-body-sm)]',
    'leading-[var(--eh-font-line-height-body-xs)]',
    'tracking-[var(--eh-font-letter-spacing-body-sm)]',
    'font-default',
    // Base: behaviour
    'select-none',
  ],
  {
    variants: {
      size: {
        sm: 'px-3 py-1',
        md: 'px-3 py-2',
        lg: 'p-3',
      },
      appearance: {
        Inverted: 'text-strong',
        Solid: 'text-all-white',
      },
      status: {
        Error: '',
        Success: '',
        Info: '',
        Warning: '',
      },
    },
    compoundVariants: [
      // Inverted backgrounds + borders
      { appearance: 'Inverted', status: 'Error', className: 'bg-error-inverted border-error' },
      { appearance: 'Inverted', status: 'Success', className: 'bg-success-inverted border-success-weak' },
      { appearance: 'Inverted', status: 'Info', className: 'bg-info-inverted border-info' },
      { appearance: 'Inverted', status: 'Warning', className: 'bg-warning-inverted border-[var(--eh-colour-border-warning-weak)]' },
      // Solid backgrounds + borders
      { appearance: 'Solid', status: 'Error', className: 'bg-error border-error' },
      { appearance: 'Solid', status: 'Success', className: 'bg-success border-success' },
      { appearance: 'Solid', status: 'Info', className: 'bg-info border-info' },
      { appearance: 'Solid', status: 'Warning', className: 'bg-warning border-warning' },
    ],
    defaultVariants: {
      size: 'sm',
      appearance: 'Inverted',
      status: 'Success',
    },
  }
)

// ---------------------------------------------------------------------------
// BadgeSemantic
// ---------------------------------------------------------------------------

const BadgeSemantic = React.forwardRef<HTMLSpanElement, BadgeSemanticProps>(
  (
    {
      size = 'sm',
      appearance = 'Inverted',
      status = 'Success',
      label = 'Badge',
      iconLeading = false,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <span
        data-slot="badge-semantic"
        ref={ref}
        className={cn(
          badgeSemanticVariants({ size, appearance, status }),
          className,
        )}
        {...props}
      >
        {iconLeading && icon && (
          <span data-slot="badge-icon" className="shrink-0 size-icon-sm">
            {icon}
          </span>
        )}
        <span data-slot="badge-label" className="whitespace-nowrap">
          {label}
        </span>
      </span>
    )
  }
)
BadgeSemantic.displayName = 'BadgeSemantic'

export { BadgeSemantic }
