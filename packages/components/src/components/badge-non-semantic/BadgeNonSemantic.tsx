import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BadgeNonSemanticSize = 'sm' | 'md' | 'lg'
export type BadgeNonSemanticAppearance = 'Inverted' | 'Solid'
export type BadgeNonSemanticColour = 'Brand' | 'Accent' | 'Blue Grey'

export interface BadgeNonSemanticProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Maps to Figma "Size" property */
  size?: BadgeNonSemanticSize
  /** Maps to Figma "Appearance" property — Inverted is light bg, Solid is dark bg */
  appearance?: BadgeNonSemanticAppearance
  /** Maps to Figma "Colour" property */
  colour?: BadgeNonSemanticColour
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

export const badgeNonSemanticVariants = cva(
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
      colour: {
        Brand: '',
        Accent: '',
        'Blue Grey': '',
      },
    },
    compoundVariants: [
      // Inverted backgrounds
      { appearance: 'Inverted', colour: 'Brand', className: 'bg-brand-inverted border-brand-weak' },
      { appearance: 'Inverted', colour: 'Accent', className: 'bg-accent-inverted border-accent-weak' },
      { appearance: 'Inverted', colour: 'Blue Grey', className: 'bg-neutral-inverted border-weak' },
      // Solid backgrounds
      { appearance: 'Solid', colour: 'Brand', className: 'bg-brand border-brand-weak' },
      { appearance: 'Solid', colour: 'Accent', className: 'bg-accent border-accent-weak' },
      { appearance: 'Solid', colour: 'Blue Grey', className: 'bg-neutral border-weak' },
    ],
    defaultVariants: {
      size: 'sm',
      appearance: 'Inverted',
      colour: 'Brand',
    },
  }
)

// ---------------------------------------------------------------------------
// BadgeNonSemantic
// ---------------------------------------------------------------------------

const BadgeNonSemantic = React.forwardRef<HTMLSpanElement, BadgeNonSemanticProps>(
  (
    {
      size = 'sm',
      appearance = 'Inverted',
      colour = 'Brand',
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
        data-slot="badge-non-semantic"
        ref={ref}
        className={cn(
          badgeNonSemanticVariants({ size, appearance, colour }),
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
BadgeNonSemantic.displayName = 'BadgeNonSemantic'

export { BadgeNonSemantic }
