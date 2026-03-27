import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BadgeNotificationNonSemanticSize = 'xs' | 'sm' | 'md' | 'lg'
export type BadgeNotificationNonSemanticShape = 'Solid' | 'Inverted'
export type BadgeNotificationNonSemanticColour = 'Brand' | 'Neutral'

export interface BadgeNotificationNonSemanticProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Maps to Figma "Size" property */
  size?: BadgeNotificationNonSemanticSize
  /** Maps to Figma "Shape" property — Solid is filled bg, Inverted is light bg */
  shape?: BadgeNotificationNonSemanticShape
  /** Maps to Figma "Colour" property */
  colour?: BadgeNotificationNonSemanticColour
  /** Notification count number. When provided (and size !== 'xs'), the number is shown.
   *  When undefined, shows a dot. Maps to Figma "Number" boolean — true when count is provided. */
  count?: number
}

// ---------------------------------------------------------------------------
// CVA — Badge variants
// ---------------------------------------------------------------------------

export const badgeNotificationNonSemanticVariants = cva(
  [
    // Base: shape
    'overflow-clip rounded-full',
    // Base: border
    'border-solid border-xs',
  ],
  {
    variants: {
      shape: {
        Solid: '',
        Inverted: '',
      },
      colour: {
        Brand: 'border-brand',
        Neutral: 'border-default',
      },
    },
    compoundVariants: [
      // Backgrounds
      { shape: 'Solid', colour: 'Brand', className: 'bg-brand' },
      { shape: 'Solid', colour: 'Neutral', className: 'bg-neutral' },
      { shape: 'Inverted', colour: 'Brand', className: 'bg-brand-inverted' },
      { shape: 'Inverted', colour: 'Neutral', className: 'bg-neutral-inverted' },
    ],
    defaultVariants: {
      shape: 'Solid',
      colour: 'Brand',
    },
  }
)

// ---------------------------------------------------------------------------
// Size and colour maps
// ---------------------------------------------------------------------------

const numberSizeClasses: Record<Exclude<BadgeNotificationNonSemanticSize, 'xs'>, string> = {
  sm: 'min-h-[20px] min-w-[20px] h-[20px] p-1',
  md: 'min-h-[24px] min-w-[24px] p-1',
  lg: 'min-h-[32px] min-w-[32px] p-3',
}

const textColourClasses: Record<BadgeNotificationNonSemanticShape, Record<BadgeNotificationNonSemanticColour, string>> = {
  Solid: {
    Brand: 'text-all-white',
    Neutral: 'text-black-on-dark-hc',
  },
  Inverted: {
    Brand: 'text-inverted-black-white',
    Neutral: 'text-inverted-black-white',
  },
}

// ---------------------------------------------------------------------------
// BadgeNotificationNonSemantic
// ---------------------------------------------------------------------------

const BadgeNotificationNonSemantic = React.forwardRef<HTMLSpanElement, BadgeNotificationNonSemanticProps>(
  (
    {
      size = 'xs',
      shape = 'Solid',
      colour = 'Brand',
      count,
      className,
      ...props
    },
    ref
  ) => {
    const showNumber = count !== undefined && size !== 'xs'

    return (
      <span
        data-slot="badge-notification-non-semantic"
        ref={ref}
        className={cn(
          badgeNotificationNonSemanticVariants({ shape, colour }),
          showNumber
            ? [
                'inline-flex items-center justify-center',
                numberSizeClasses[size as Exclude<BadgeNotificationNonSemanticSize, 'xs'>],
              ]
            : 'size-[8px]',
          className,
        )}
        {...props}
      >
        {showNumber && (
          <span
            data-slot="badge-notification-count"
            className={cn(
              'whitespace-nowrap text-center',
              // Typography
              'text-[length:var(--eh-font-size-body-sm)]',
              'leading-[var(--eh-font-line-height-body-sm)]',
              'tracking-[var(--eh-font-letter-spacing-body-sm)]',
              'font-default',
              'font-ui',
              // Text colour
              textColourClasses[shape][colour],
            )}
          >
            {count}
          </span>
        )}
      </span>
    )
  }
)
BadgeNotificationNonSemantic.displayName = 'BadgeNotificationNonSemantic'

export { BadgeNotificationNonSemantic }
