import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '../../lib/utils'
import { BadgeNonSemantic } from '../badge-non-semantic'

// ────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────

type AccordionSingleProps = {
  type: 'single'
  collapsible?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

type AccordionMultipleProps = {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

type AccordionBaseProps = {
  children: React.ReactNode
  className?: string
}

type AccordionProps = AccordionBaseProps & (AccordionSingleProps | AccordionMultipleProps)

interface AccordionItemProps {
  /** Unique value for Radix state management. Required by Radix Accordion.Item. */
  value: string
  /** Title text. Maps to Figma "Accordion Title". Paragraph/Small/Medium typography. */
  title: string
  /** Subtitle text. Maps to Figma "Show Subtitle" + "Subtitle". Shown when provided. Paragraph/Small/Regular. */
  subtitle?: string
  /** Leading icon. Maps to Figma "Icon" boolean. 20×20 size. Shown when provided. */
  startIcon?: React.ReactNode
  /** Shows internal BadgeNonSemantic (sm, Inverted, Blue Grey). Maps to Figma "Badge" boolean. */
  showBadge?: boolean
  /** Label text for the internal badge. Defaults to "New". */
  badgeLabel?: string
  /** Disables the accordion item trigger. Maps to Figma "Disabled" state. */
  disabled?: boolean
  /** Content revealed on expand. Rendered as Paragraph/Small/Regular. */
  children: React.ReactNode
  /** Additional class names for the outer item wrapper. */
  className?: string
}

// ────────────────────────────────────────────────────────
// Icons
// ────────────────────────────────────────────────────────

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-icon-xs', className)}
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  )
}

// ────────────────────────────────────────────────────────
// Accordion
// ────────────────────────────────────────────────────────

const Accordion = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ children, className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Root
      ref={ref}
      data-slot="accordion"
      className={cn('flex flex-col gap-2 py-4 rounded-lg', className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Root>
  )
})
Accordion.displayName = 'Accordion'

// ────────────────────────────────────────────────────────
// AccordionItem
// ────────────────────────────────────────────────────────

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(
  (
    {
      value,
      title,
      subtitle,
      startIcon,
      showBadge = false,
      badgeLabel = 'New',
      disabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <AccordionPrimitive.Item
        ref={ref}
        value={value}
        disabled={disabled}
        data-slot="accordion-item"
        {...props}
        className={cn(
          'flex flex-col overflow-clip rounded-md data-[state=open]:rounded-lg data-[state=open]:pb-4',
          className
        )}
      >
        <AccordionPrimitive.Header asChild>
          <div>
            <AccordionPrimitive.Trigger
              data-slot="accordion-trigger"
              disabled={disabled}
              className={cn(
                'flex w-full items-center gap-6 p-3 rounded-md',
                'cursor-pointer text-left',
                'hover:bg-avatar hover:hover-ring',
                'focus-visible:outline-none focus-visible:focus-ring',
                'disabled:pointer-events-none disabled:cursor-default disabled:hover:bg-transparent disabled:hover:shadow-none',
                'transition-shadow duration-quick-2 ease-in-out',
                '[&[data-state=open]_[data-slot=accordion-chevron]]:rotate-180',
                '[&:hover_[data-slot=accordion-title-text]]:underline'
              )}
            >
              <div className="flex flex-1 items-center gap-6 px-3 py-1">
                <div className="flex flex-1 items-start gap-4">
                  {startIcon ? (
                    <span
                      data-slot="accordion-start-icon"
                      className={cn(
                        'shrink-0 size-icon-md',
                        disabled ? 'icon-disabled' : 'icon-default'
                      )}
                    >
                      {startIcon}
                    </span>
                  ) : null}

                  <div className="flex flex-1 flex-col gap-[2px]">
                    <span
                      data-slot="accordion-title-text"
                      className={cn(
                        'text-body-sm font-weight-medium',
                        disabled ? 'text-disabled' : 'text-strong'
                      )}
                    >
                      {title}
                    </span>

                    {subtitle ? (
                      <span
                        data-slot="accordion-subtitle-text"
                        className={cn(
                          'text-body-sm font-weight-regular',
                          disabled ? 'text-disabled' : 'text-default'
                        )}
                      >
                        {subtitle}
                      </span>
                    ) : null}
                  </div>
                </div>

                {showBadge ? (
                  <BadgeNonSemantic
                    size="sm"
                    appearance="Inverted"
                    colour="Blue Grey"
                    label={badgeLabel}
                  />
                ) : null}

                <div
                  data-slot="accordion-chevron"
                  className={cn(
                    'flex shrink-0 items-center justify-center',
                    'rounded-md border-xs border-solid p-3',
                    'transition-transform duration-quick-2 ease-in-out',
                    disabled
                      ? 'border-disabled bg-default icon-disabled no-ring'
                      : 'border-default bg-default icon-default default-ring'
                  )}
                >
                  <ChevronDownIcon />
                </div>
              </div>
            </AccordionPrimitive.Trigger>
          </div>
        </AccordionPrimitive.Header>

        <AccordionPrimitive.Content
          data-slot="accordion-content"
          className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
        >
          <div className="px-11 py-4 text-body-sm font-weight-regular text-default">
            {children}
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    )
  }
)
AccordionItem.displayName = 'AccordionItem'

// ────────────────────────────────────────────────────────
// Exports
// ────────────────────────────────────────────────────────

export { Accordion, AccordionItem }
export type { AccordionProps, AccordionItemProps }
