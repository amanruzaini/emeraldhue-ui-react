import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import type { ButtonVariant, ButtonSize, ButtonContent } from './Button.types'
import { buttonVariants, iconStyle } from './button.variants'

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

export { Button }
