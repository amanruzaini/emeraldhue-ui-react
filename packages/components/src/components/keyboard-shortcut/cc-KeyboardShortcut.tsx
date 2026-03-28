import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// ============================================================================
// KeyboardShortcut — Types
// ============================================================================

export type KeyboardShortcutSize = 'sm' | 'md' | 'lg'
export type KeyboardShortcutColour = 'neutral' | 'brand' | 'destructive'

export interface KeyboardShortcutProps
  extends React.HTMLAttributes<HTMLElement> {
  /** The text displayed on the primary key cap. Maps to Figma "Label" */
  children: React.ReactNode

  /**
   * Number of key caps to display.
   * - 1: single key cap showing children
   * - 2: two key caps — modifierKey + children
   * Maps to Figma "Key" property
   */
  keys?: 1 | 2

  /**
   * Text for the modifier/secondary key cap (only rendered when keys={2}).
   * e.g. "Ctrl", "Shift", "Alt", "⌘"
   */
  modifierKey?: string

  /** Maps to Figma "Size" */
  size?: KeyboardShortcutSize

  /** Maps to Figma "Colour" */
  colour?: KeyboardShortcutColour

  /** Renders the disabled visual state. Maps to Figma "State: Disabled" */
  disabled?: boolean
}

// ============================================================================
// KeyboardShortcut — Variants (CVA)
// ============================================================================

export const keyCapVariants = cva(
  [
    'inline-flex items-center justify-center',
    'border-solid border-xs',
    'overflow-hidden',
    'font-default',
    'text-[length:var(--eh-font-size-body-sm)]',
    'leading-[var(--eh-font-line-height-body-xs)]',
    'tracking-[var(--eh-font-letter-spacing-body-sm)]',
  ],
  {
    variants: {
      size: {
        sm: 'min-w-[20px] px-2 py-0 rounded-sm',
        md: 'min-w-[24px] px-2 py-1 rounded-md',
        lg: 'min-w-[28px] min-h-[28px] px-2 py-1 rounded-md',
      },
      colour: {
        neutral: '',
        brand: '',
        destructive: '',
      },
      disabled: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Neutral + Default
      {
        colour: 'neutral',
        disabled: false,
        className: 'bg-application-shell border-weak',
      },
      // Neutral + Disabled
      {
        colour: 'neutral',
        disabled: true,
        className: 'bg-neutral-inverted border-disabled',
      },
      // Brand + Default
      {
        colour: 'brand',
        disabled: false,
        className: 'bg-brand-hover border-brand',
      },
      // Brand + Disabled
      {
        colour: 'brand',
        disabled: true,
        className: 'bg-brand-disabled border-brand-disabled',
      },
      // Destructive + Default
      {
        colour: 'destructive',
        disabled: false,
        className: 'bg-error-hover border-error',
      },
      // Destructive + Disabled
      {
        colour: 'destructive',
        disabled: true,
        className: 'bg-error-disabled border-error-disabled',
      },
    ],
    defaultVariants: {
      size: 'sm',
      colour: 'neutral',
      disabled: false,
    },
  }
)

// ============================================================================
// KeyboardShortcut — Text colour map
// ============================================================================

const textColourMap: Record<KeyboardShortcutColour, Record<'default' | 'disabled', string>> = {
  neutral: {
    default: 'text-weak',
    disabled: 'text-disabled',
  },
  brand: {
    default: 'text-all-white',
    disabled: 'text-all-white',
  },
  destructive: {
    default: 'text-all-white',
    disabled: 'text-all-white',
  },
}

const fontFeatureStyle = {
  fontFeatureSettings:
    "'ss02' 1, 'cv02' 1, 'cv01' 1, 'cv03' 1, 'cv04' 1, 'cv05' 1, 'cv07' 1, 'cv09' 1, 'cv10' 1, 'zero' 1, 'lnum' 1, 'tnum' 1",
} as const

// ============================================================================
// KeyboardShortcut — Component
// ============================================================================

const KeyboardShortcut = React.forwardRef<HTMLElement, KeyboardShortcutProps>(
  (
    {
      children,
      keys = 1,
      modifierKey,
      size = 'sm',
      colour = 'neutral',
      disabled = false,
      className,
      ...rest
    },
    ref
  ) => {
    const keyCapClasses = keyCapVariants({ size, colour, disabled })
    const textColour = textColourMap[colour][disabled ? 'disabled' : 'default']

    if (keys === 2) {
      return (
        <span
          data-slot="keyboard-shortcut"
          ref={ref}
          className={cn('inline-flex items-center gap-1', className)}
          {...rest}
        >
          <kbd className={keyCapClasses}>
            <span className={textColour} style={fontFeatureStyle}>
              {modifierKey}
            </span>
          </kbd>
          <kbd className={keyCapClasses}>
            <span className={textColour} style={fontFeatureStyle}>
              {children}
            </span>
          </kbd>
        </span>
      )
    }

    return (
      <kbd
        data-slot="keyboard-shortcut"
        ref={ref as React.Ref<HTMLElement>}
        className={cn(keyCapClasses, className)}
        {...rest}
      >
        <span className={textColour} style={fontFeatureStyle}>
          {children}
        </span>
      </kbd>
    )
  }
)
KeyboardShortcut.displayName = 'KeyboardShortcut'

export { KeyboardShortcut }
