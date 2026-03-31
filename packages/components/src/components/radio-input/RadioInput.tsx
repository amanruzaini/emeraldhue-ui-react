import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export type RadioInputSize = 'sm' | 'md' | 'lg'

export const radioInputVariants = cva(
  [
    'shrink-0 appearance-none',
    'rounded-full border border-solid',
    'transition-all duration-quick-3',
    'focus-visible:outline-none',
  ],
  {
    variants: {
      size: {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const dotSizeClassBySize: Record<RadioInputSize, string> = {
  sm: 'size-[6px]',
  md: 'size-[8px]',
  lg: 'size-[10px]',
}

export interface RadioInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof radioInputVariants> {
  /** Maps to Figma "Size" property */
  size?: RadioInputSize
}

const RadioInput = React.forwardRef<HTMLInputElement, RadioInputProps>(
  (
    {
      size = 'md',
      checked: checkedProp,
      defaultChecked,
      disabled = false,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = checkedProp !== undefined
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
      Boolean(defaultChecked)
    )

    const checked = isControlled ? Boolean(checkedProp) : uncontrolledChecked
    const dotSizeClass = dotSizeClassBySize[size]

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setUncontrolledChecked(event.target.checked)
        }

        onChange?.(event)
      },
      [isControlled, onChange]
    )

    return (
      <span
        data-slot="radio-input"
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center p-1 align-middle',
          className
        )}
      >
        <input
          {...props}
          ref={ref}
          type="radio"
          checked={isControlled ? checked : undefined}
          defaultChecked={isControlled ? undefined : defaultChecked}
          disabled={disabled}
          aria-checked={checked}
          data-slot="radio-input-control"
          data-state={
            disabled
              ? 'disabled'
              : checked
                ? 'checked'
                : 'unchecked'
          }
          className={cn(
            radioInputVariants({ size }),
            disabled
              ? [
                  'cursor-not-allowed no-ring',
                  checked
                    ? 'bg-brand-disabled border-brand-disabled'
                    : 'bg-avatar border-disabled',
                ]
              : [
                  'cursor-pointer',
                  'default-ring-bezel',
                  'hover:hover-ring-bezel',
                  'focus-visible:focus-ring-bezel',
                  checked
                    ? 'bg-brand border-brand'
                    : 'bg-application-shell border-default',
                ]
          )}
          onChange={handleChange}
        />

        {checked && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className={cn(dotSizeClass, 'rounded-full bg-all-white')} />
          </span>
        )}
      </span>
    )
  }
)
RadioInput.displayName = 'RadioInput'

export { RadioInput }
