import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AvatarGroupSize = 'xs' | 'sm' | 'md'

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maps to Figma "Size" property — controls size of all avatars in the group */
  size?: AvatarGroupSize
  /** Maximum number of avatars to display before showing overflow count.
   *  When total children exceed this, the last slot shows "+N".
   *  Maps to Figma "Overflow" boolean — overflow is shown when children > max. */
  max?: number
}

// ---------------------------------------------------------------------------
// CVA — Group container
// ---------------------------------------------------------------------------

export const avatarGroupVariants = cva(
  [
    'flex items-center',
    'relative',
  ],
  {
    variants: {
      size: {
        xs: 'pr-[4px]',
        sm: 'pr-[6px]',
        md: 'pr-[8px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

// ---------------------------------------------------------------------------
// Size maps
// ---------------------------------------------------------------------------

const overlapMargins: Record<AvatarGroupSize, string> = {
  xs: 'mr-[-4px]',
  sm: 'mr-[-6px]',
  md: 'mr-[-8px]',
}

const overflowWrapperSizes: Record<AvatarGroupSize, string> = {
  xs: 'size-[28px]',
  sm: 'size-[36px]',
  md: 'size-[44px]',
}

const overflowInnerSizes: Record<AvatarGroupSize, string> = {
  xs: 'size-[24px]',
  sm: 'size-[32px]',
  md: 'size-[40px]',
}

// ---------------------------------------------------------------------------
// AvatarGroup
// ---------------------------------------------------------------------------

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ size = 'md', max = 5, className, children, ...props }, ref) => {
    const childArray = React.Children.toArray(children)
    const totalCount = childArray.length
    const hasOverflow = totalCount > max
    const visibleCount = hasOverflow ? max - 1 : totalCount
    const overflowCount = totalCount - visibleCount

    const visibleChildren = childArray.slice(0, visibleCount)

    return (
      <div
        data-slot="avatar-group"
        ref={ref}
        className={cn(avatarGroupVariants({ size }), className)}
        {...props}
      >
        {visibleChildren.map((child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              key: index,
              size,
              indicator: false,
              className: cn('shrink-0', overlapMargins[size], child.props.className),
            } as any)
          }
          return child
        })}

        {hasOverflow && (
          <div
            data-slot="avatar-overflow"
            className={cn(
              'relative shrink-0',
              overlapMargins[size],
              overflowWrapperSizes[size],
            )}
          >
            <div
              className={cn(
                'absolute left-[2px] top-[2px]',
                'flex items-center justify-center',
                'overflow-clip rounded-full',
                'border-solid border-[length:var(--eh-border-width-sm)] border-focus-inner',
                'bg-avatar text-default',
                'select-none',
                overflowInnerSizes[size],
                size === 'md' ? 'text-body-md' : 'text-body-xs font-weight-medium',
              )}
            >
              <span className="whitespace-nowrap text-center">
                +{overflowCount}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = 'AvatarGroup'

export { AvatarGroup }
