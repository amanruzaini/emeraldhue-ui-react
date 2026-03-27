import * as React from 'react'
import { Check, Minus } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export type CheckboxInputSize = 'sm' | 'md'

export const checkboxInputVariants = cva(
  [
    'shrink-0 appearance-none',
    'rounded-sm border border-solid',
    'transition-all duration-quick-3',
    'focus-visible:outline-none',
  ],
  {
    variants: {
      size: {
        sm: 'size-8',
        md: 'size-10',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
)

const iconSizeClassBySize: Record<CheckboxInputSize, string> = {
  sm: 'size-[10px]',
  md: 'size-[12px]',
}

export interface CheckboxInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof checkboxInputVariants> {
  /** Maps to Figma "Size" property */
  size?: CheckboxInputSize
  /** Maps to Figma "Indeterminate" property */
  indeterminate?: boolean
}

const CheckboxInput = React.forwardRef<HTMLInputElement, CheckboxInputProps>(
  (
    {
      size = 'sm',
      indeterminate = false,
      checked: checkedProp,
      defaultChecked,
      disabled = false,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const isControlled = checkedProp !== undefined
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
      Boolean(defaultChecked)
    )

    const checked = isControlled ? Boolean(checkedProp) : uncontrolledChecked
    const isSelected = checked || indeterminate
    const iconSizeClass = iconSizeClassBySize[size]

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node

        if (typeof ref === 'function') {
          ref(node)
          return
        }

        if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

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
        data-slot="checkbox-input"
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center p-1 align-middle',
          className
        )}
      >
        <input
          {...props}
          ref={setRefs}
          type="checkbox"
          checked={isControlled ? checked : undefined}
          defaultChecked={isControlled ? undefined : defaultChecked}
          disabled={disabled}
          aria-checked={indeterminate ? 'mixed' : checked}
          data-slot="checkbox-input-control"
          data-state={
            disabled
              ? 'disabled'
              : indeterminate
                ? 'indeterminate'
                : checked
                  ? 'checked'
                  : 'unchecked'
          }
          className={cn(
            checkboxInputVariants({ size }),
            disabled
              ? [
                  'cursor-not-allowed no-ring',
                  isSelected
                    ? 'bg-brand-disabled border-brand-disabled'
                    : 'bg-avatar border-disabled',
                ]
              : [
                  'cursor-pointer',
                  'default-ring-bezel',
                  'hover:hover-ring-bezel',
                  'focus-visible:focus-ring-bezel',
                  isSelected
                    ? 'bg-brand border-brand'
                    : 'bg-application-shell border-default',
                ]
          )}
          onChange={handleChange}
        />

        {indeterminate ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <Minus
              className={cn(iconSizeClass, 'icon-all-white')}
              strokeWidth={3}
            />
          </span>
        ) : checked ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <Check
              className={cn(iconSizeClass, 'icon-all-white')}
              strokeWidth={3}
            />
          </span>
        ) : null}
      </span>
    )
  }
)
CheckboxInput.displayName = 'CheckboxInput'

export { CheckboxInput }
