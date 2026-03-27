import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The ButtonGroupItem children */
  children: React.ReactNode
  /** Optional className override */
  className?: string
}

export interface ButtonGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Maps to Figma "Icon Leading" — icon shown when provided */
  startIcon?: React.ReactNode
  /** Maps to Figma "Icon Trailing" — icon shown when provided */
  endIcon?: React.ReactNode
  /** Maps to Figma "View only" state — non-interactive read-only appearance */
  viewOnly?: boolean
  /** Optional className override */
  className?: string
  /** Text content */
  children: React.ReactNode
}

// ---------------------------------------------------------------------------
// CVA — ButtonGroupItem
// ---------------------------------------------------------------------------

export const buttonGroupItemVariants = cva([
  // Layout
  'inline-flex items-center justify-center shrink-0 gap-2 relative overflow-clip',
  // Sizing
  'h-[36px] max-h-[36px] px-6 py-4',
  // Typography
  'text-body-xs font-medium text-strong text-center whitespace-nowrap',
  // Border
  'border-solid border-xs border-weak',
  // Transitions
  'transition-colors duration-quick-2 ease-in-out',
  // Cursor
  'cursor-pointer',
])

// ---------------------------------------------------------------------------
// ButtonGroup
// ---------------------------------------------------------------------------

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        data-slot="button-group"
        role="group"
        ref={ref}
        className={cn(
          'inline-flex items-center overflow-visible rounded-md',
          '[&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md',
          'bg-default',
          'border-solid border-t-xs border-l-xs border-r-xs border-b-sm border-default',
          'default-ring-bezel',
          '[&>*]:mr-[-1px] [&>*:last-child]:mr-0',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ButtonGroup.displayName = 'ButtonGroup'

// ---------------------------------------------------------------------------
// ButtonGroupItem
// ---------------------------------------------------------------------------

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  (
    {
      startIcon,
      endIcon,
      viewOnly = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        data-slot="button-group-item"
        ref={ref}
        className={cn(
          buttonGroupItemVariants(),
          viewOnly
            ? 'bg-avatar border-xs border-weak text-default cursor-default pointer-events-none'
            : [
                'hover:bg-neutral-inverted-hover hover:border-transparent',
                'active:bg-neutral-inverted-hover active:border-default',
                'focus-visible:outline-none focus-visible:focus-ring focus-visible:border-transparent focus-visible:z-10',
                'disabled:bg-disabled disabled:text-inverted-disabled disabled:border-transparent disabled:cursor-not-allowed disabled:pointer-events-none',
              ],
          className,
        )}
        {...props}
      >
        {startIcon && (
          <span className="size-icon-xs shrink-0" aria-hidden="true">
            {startIcon}
          </span>
        )}
        <span data-slot="label">{children}</span>
        {endIcon && (
          <span className="size-icon-xs shrink-0" aria-hidden="true">
            {endIcon}
          </span>
        )}
      </button>
    )
  }
)
ButtonGroupItem.displayName = 'ButtonGroupItem'

export { ButtonGroup, ButtonGroupItem }
