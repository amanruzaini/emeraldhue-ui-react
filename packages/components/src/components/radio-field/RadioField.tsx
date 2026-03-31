import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  RadioInput,
  type RadioInputProps,
  type RadioInputSize,
} from '../radio-input'
import { cn } from '../../lib/utils'

export type RadioFieldSize = RadioInputSize

export const radioFieldVariants = cva(
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
        lg: 'gap-4',
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer hover:bg-avatar hover:hover-ring',
      },
    },
    defaultVariants: {
      size: 'md',
      disabled: false,
    },
  }
)

const labelTextVariants = cva(['font-default font-weight-medium text-strong'], {
  variants: {
    size: {
      sm: 'text-body-sm',
      md: 'text-body-md',
      lg: 'text-body-md',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const descriptionTextVariants = cva(['font-default text-default'], {
  variants: {
    size: {
      sm: 'text-body-sm',
      md: 'text-body-md',
      lg: 'text-body-md',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface RadioFieldProps
  extends Omit<RadioInputProps, 'className'>,
    VariantProps<typeof radioFieldVariants> {
  /** Maps to Figma "Size" property */
  size?: RadioFieldSize
  /** Maps to the radio field label text in Figma */
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
  /** Class applied to the nested radio primitive wrapper */
  controlClassName?: string
}

const RadioField = React.forwardRef<HTMLInputElement, RadioFieldProps>(
  (
    {
      size = 'md',
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
        data-slot="radio-field"
        className={cn(radioFieldVariants({ size, disabled }), className)}
      >
        <RadioInput
          {...props}
          ref={ref}
          size={size}
          disabled={disabled}
          aria-describedby={describedBy}
          className={cn('shrink-0', controlClassName)}
        />

        <span
          data-slot="radio-field-content"
          className={cn('flex min-w-0 flex-1 flex-col items-start justify-center', contentClassName)}
        >
          <span
            data-slot="radio-field-label"
            className={cn(labelTextVariants({ size }), labelClassName)}
          >
            {children}
          </span>

          {description ? (
            <span
              id={`${descriptionId}-description`}
              data-slot="radio-field-description"
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
RadioField.displayName = 'RadioField'

export { RadioField }
