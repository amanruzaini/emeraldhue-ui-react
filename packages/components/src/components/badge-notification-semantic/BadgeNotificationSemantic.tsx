import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BadgeNotificationSemanticSize = 'xs' | 'sm' | 'md' | 'lg'
export type BadgeNotificationSemanticShape = 'Solid' | 'Inverted'
export type BadgeNotificationSemanticStatus = 'Info' | 'Alert'

export interface BadgeNotificationSemanticProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Maps to Figma "Size" property */
  size?: BadgeNotificationSemanticSize
  /** Maps to Figma "Shape" property — Solid is filled bg, Inverted is light bg */
  shape?: BadgeNotificationSemanticShape
  /** Maps to Figma "Status" property — Alert uses error tokens, Info uses info tokens */
  status?: BadgeNotificationSemanticStatus
  /** Notification count number. When provided (and size !== 'xs'), the number is shown.
   *  When undefined, shows a dot. Maps to Figma "Number" boolean — true when count is provided. */
  count?: number
}

// ---------------------------------------------------------------------------
// CVA — Badge variants
// ---------------------------------------------------------------------------

export const badgeNotificationSemanticVariants = cva(
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
      status: {
        Alert: 'border-error',
        Info: 'border-info',
      },
    },
    compoundVariants: [
      // Backgrounds
      { shape: 'Solid', status: 'Alert', className: 'bg-error' },
      { shape: 'Solid', status: 'Info', className: 'bg-info' },
      { shape: 'Inverted', status: 'Alert', className: 'bg-error-inverted' },
      { shape: 'Inverted', status: 'Info', className: 'bg-info-inverted' },
    ],
    defaultVariants: {
      shape: 'Solid',
      status: 'Alert',
    },
  }
)

// ---------------------------------------------------------------------------
// Size and colour maps
// ---------------------------------------------------------------------------

const numberSizeClasses: Record<Exclude<BadgeNotificationSemanticSize, 'xs'>, string> = {
  sm: 'min-h-[20px] min-w-[20px] h-[20px] p-1',
  md: 'min-h-[24px] min-w-[24px] p-1',
  lg: 'min-h-[32px] min-w-[32px] p-3',
}

const textColourClasses: Record<BadgeNotificationSemanticShape, string> = {
  Solid: 'text-black-on-dark-hc',
  Inverted: 'text-inverted-black-white',
}

// ---------------------------------------------------------------------------
// BadgeNotificationSemantic
// ---------------------------------------------------------------------------

const BadgeNotificationSemantic = React.forwardRef<HTMLSpanElement, BadgeNotificationSemanticProps>(
  (
    {
      size = 'xs',
      shape = 'Solid',
      status = 'Alert',
      count,
      className,
      ...props
    },
    ref
  ) => {
    const showNumber = count !== undefined && size !== 'xs'

    return (
      <span
        data-slot="badge-notification-semantic"
        ref={ref}
        className={cn(
          badgeNotificationSemanticVariants({ shape, status }),
          showNumber
            ? [
                'inline-flex items-center justify-center',
                numberSizeClasses[size as Exclude<BadgeNotificationSemanticSize, 'xs'>],
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
              textColourClasses[shape],
            )}
          >
            {count}
          </span>
        )}
      </span>
    )
  }
)
BadgeNotificationSemantic.displayName = 'BadgeNotificationSemantic'

export { BadgeNotificationSemantic }
