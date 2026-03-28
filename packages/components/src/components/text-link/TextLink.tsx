import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// ============================================================================
// TextLink Component
// Emerald HUE Design System
// ============================================================================

// -- Types -------------------------------------------------------------------

export type TextLinkVariant = 'Primary' | 'Destructive'
export type TextLinkSize = 'sm' | 'md' | 'lg'

type TextLinkBaseProps = {
  /** Maps to Figma "Type" property */
  variant?: TextLinkVariant
  /** Maps to Figma "Size" property */
  size?: TextLinkSize
  /** Maps to Figma "Icon Leading" — icon shown when provided */
  startIcon?: React.ReactNode
  /** Maps to Figma "Icon Trailing" — icon shown when provided */
  endIcon?: React.ReactNode
  /** When true, renders icon-only mode. Maps to Figma "Content" = "Icon only" */
  iconOnly?: boolean
  /** The icon to render in icon-only mode */
  icon?: React.ReactNode
  /** Disables the text link */
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

type TextLinkAsAnchor = TextLinkBaseProps &
  Omit<React.ComponentPropsWithoutRef<'a'>, keyof TextLinkBaseProps> & { href: string }

type TextLinkAsButton = TextLinkBaseProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof TextLinkBaseProps> & { href?: never }

export type TextLinkProps = TextLinkAsAnchor | TextLinkAsButton

// -- CVA Variants ------------------------------------------------------------

export const textLinkVariants = cva(
  [
    // Layout
    'inline-flex items-center justify-center',
    'gap-[var(--eh-spacing-2)]',
    'rounded-lg',
    // Typography
    'font-default font-weight-medium underline',
    // Transitions
    'transition-colors duration-quick-2 ease-in-out',
    // Focus
    'focus-visible:focus-ring focus-visible:bg-default focus-visible:no-underline',
    // Cursor
    'cursor-pointer disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        Primary: [
          'text-brand',
          'hover:bg-[var(--eh-colour-bg-brand-inverted-button)]',
          'active:bg-brand-inverted-active',
          'disabled:text-disabled disabled:bg-transparent disabled:no-underline',
        ],
        Destructive: [
          'text-error',
          'hover:bg-[var(--eh-colour-bg-error-inverted)]',
          'active:bg-[var(--eh-colour-bg-error-inverted)]',
          'disabled:text-disabled disabled:bg-transparent disabled:no-underline',
        ],
      },
      size: {
        sm: [
          // Non-standard typography composite: body-sm font size, body-xs line height
          'text-[length:var(--eh-font-size-body-sm)] leading-[var(--eh-font-line-height-body-xs)] tracking-[var(--eh-font-letter-spacing-body-sm)]',
          // Spacing
          'px-[var(--eh-spacing-1)] py-[var(--eh-spacing-0)]',
          // Icon size CSS custom property
          '[--icon-size:var(--eh-icon-sm)]',
        ],
        md: [
          'text-body-md',
          'px-[var(--eh-spacing-1)] py-[var(--eh-spacing-0)]',
          '[--icon-size:var(--eh-icon-md)]',
        ],
        lg: [
          'text-body-lg',
          'px-[var(--eh-spacing-1)] py-[var(--eh-spacing-0)]',
          '[--icon-size:var(--eh-icon-lg)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'Primary',
      size: 'md',
    },
  }
)

// -- Component ---------------------------------------------------------------

const TextLink = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, TextLinkProps>(
  (
    {
      variant = 'Primary',
      size = 'md',
      iconOnly = false,
      icon,
      startIcon,
      endIcon,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (process.env.NODE_ENV === 'development') {
      if (iconOnly && !props['aria-label'] && !props['aria-labelledby']) {
        console.warn(
          'EH TextLink: icon-only text links require an aria-label or aria-labelledby for accessibility.',
        )
      }
    }

    const classes = cn(
      textLinkVariants({ variant, size }),
      iconOnly && 'p-[var(--eh-spacing-1)] px-[unset] py-[unset] gap-0',
      className,
    )

    const iconWrapper = (node: React.ReactNode) => (
      <span
        className="shrink-0 [width:var(--icon-size)] [height:var(--icon-size)]"
        aria-hidden="true"
      >
        {node}
      </span>
    )

    const content = iconOnly ? (
      iconWrapper(icon)
    ) : (
      <>
        {startIcon && iconWrapper(startIcon)}
        {children}
        {endIcon && iconWrapper(endIcon)}
      </>
    )

    if ('href' in props && props.href) {
      const { href, ...anchorProps } = props as TextLinkAsAnchor

      if (disabled) {
        return (
          <a
            data-slot="text-link"
            ref={ref as React.Ref<HTMLAnchorElement>}
            role="link"
            aria-disabled="true"
            tabIndex={-1}
            className={classes}
            {...anchorProps}
          >
            {content}
          </a>
        )
      }

      return (
        <a
          data-slot="text-link"
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...anchorProps}
        >
          {content}
        </a>
      )
    }

    const buttonProps = props as TextLinkAsButton

    return (
      <button
        data-slot="text-link"
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        className={classes}
        {...buttonProps}
      >
        {content}
      </button>
    )
  }
)
TextLink.displayName = 'TextLink'

export { TextLink }
