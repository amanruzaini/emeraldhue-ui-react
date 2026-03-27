import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  CheckboxInput,
  type CheckboxInputProps,
  type CheckboxInputSize,
} from '../checkbox-input'
import { cn } from '../../lib/utils'

export type CheckboxFieldSize = CheckboxInputSize

export const checkboxFieldVariants = cva(
  [
    'inline-flex max-w-full items-start overflow-clip',
    'rounded-lg p-2',
    'transition-all duration-quick-3',
    'focus-within:bg-application-shell',
  ],
  {
    variants: {
      size: {
        sm: 'gap-4',
        md: 'gap-4',
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer hover:bg-avatar hover:hover-ring',
      },
    },
    defaultVariants: {
      size: 'sm',
      disabled: false,
    },
  }
)

const labelTextVariants = cva(['font-default font-weight-medium text-strong'], {
  variants: {
    size: {
      sm: 'text-body-sm',
      md: 'text-body-md',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

const descriptionTextVariants = cva(['font-default text-default'], {
  variants: {
    size: {
      sm: 'text-body-sm',
      md: 'text-body-md',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

export interface CheckboxFieldProps
  extends Omit<CheckboxInputProps, 'className' | 'disabled'>,
    Omit<VariantProps<typeof checkboxFieldVariants>, 'disabled'> {
  /** Maps to Figma "Size" property */
  size?: CheckboxFieldSize
  /** Matches the disabled state for both the field chrome and nested input */
  disabled?: boolean
  /** Maps to the checkbox field label text in Figma */
  children: React.ReactNode
  /** Maps to the supporting description text in Figma */
  description?: React.ReactNode
  /** Class applied to the outer field wrapper */
  className?: string
  /** Class applied to the text content wrapper */
  contentClassName?: string
  /** Class applied to the label text */
  labelClassName?: string
  /** Class applied to the description text */
  descriptionClassName?: string
  /** Class applied to the nested checkbox primitive wrapper */
  controlClassName?: string
}

const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    {
      size = 'sm',
      children,
      description,
      disabled = false,
      className,
      contentClassName,
      labelClassName,
      descriptionClassName,
      controlClassName,
      ...props
    },
    ref
  ) => {
    const descriptionId = React.useId()
    const describedBy = [
      props['aria-describedby'],
      description ? `${descriptionId}-description` : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <label
        data-slot="checkbox-field"
        className={cn(checkboxFieldVariants({ size, disabled }), className)}
      >
        <CheckboxInput
          {...props}
          ref={ref}
          size={size}
          disabled={disabled}
          aria-describedby={describedBy}
          className={cn('shrink-0', controlClassName)}
        />

        <span
          data-slot="checkbox-field-content"
          className={cn('flex min-w-0 flex-1 flex-col items-start justify-center', contentClassName)}
        >
          <span
            data-slot="checkbox-field-label"
            className={cn(labelTextVariants({ size }), labelClassName)}
          >
            {children}
          </span>

          {description ? (
            <span
              id={`${descriptionId}-description`}
              data-slot="checkbox-field-description"
              className={cn(descriptionTextVariants({ size }), descriptionClassName)}
            >
              {description}
            </span>
          ) : null}
        </span>
      </label>
    )
  }
)
CheckboxField.displayName = 'CheckboxField'

export { CheckboxField }
