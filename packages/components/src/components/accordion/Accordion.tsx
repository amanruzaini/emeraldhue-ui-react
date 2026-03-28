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
  /** Unique value for Radix state management (required) */
  value: string
  /** Maps to Figma "Accordion Title" text. Paragraph/Small/Medium typography. */
  title: string
  /** Maps to Figma "Show Subtitle" + "Subtitle". Shown when provided. Paragraph/Small/Regular typography. */
  subtitle?: string
  /** Maps to Figma "Icon" boolean. Leading icon, shown when provided. */
  startIcon?: React.ReactNode
  /** Maps to Figma "Badge" boolean. Shows internal BadgeNonSemantic (sm, Inverted, Blue Grey). */
  showBadge?: boolean
  /** Label text for the internal badge. Defaults to "New". */
  badgeLabel?: string
  /** Maps to Figma "Disabled" state. Disables the item trigger. */
  disabled?: boolean
  /** Accordion content — revealed on expand. Paragraph/Small/Regular typography. */
  children: React.ReactNode
  /** Additional class names for the outer item wrapper. */
  className?: string
}

// ────────────────────────────────────────────────────────
// Accordion (Root)
// ────────────────────────────────────────────────────────

const Accordion = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    data-slot="accordion"
    className={cn(
      'flex flex-col gap-2 py-4 rounded-lg',
      className
    )}
    {...props}
  >
    {children}
  </AccordionPrimitive.Root>
))
Accordion.displayName = 'Accordion'

// ────────────────────────────────────────────────────────
// AccordionItem
// ────────────────────────────────────────────────────────

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({
  className,
  title,
  subtitle,
  startIcon,
  showBadge = false,
  badgeLabel = 'New',
  disabled = false,
  children,
  value,
  ...props
}, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    value={value}
    disabled={disabled}
    data-slot="accordion-item"
    className={cn(
      // Base item styles
      'flex flex-col overflow-clip rounded-md',
      // Expanded state gets outer container styling
      'data-[state=open]:rounded-lg data-[state=open]:pb-4',
      className
    )}
    {...props}
  >
    {/* Trigger (header row) */}
    <AccordionPrimitive.Header asChild>
      <div>
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            // Layout
            'flex w-full items-center gap-6 p-3 rounded-md',
            // Reset button styles
            'cursor-pointer text-left',
            // Hover state — bg-avatar + hover-ring
            'hover:bg-avatar hover:hover-ring',
            // Focus state — focus-ring
            'focus-visible:outline-none focus-visible:focus-ring',
            // Disabled state
            'disabled:pointer-events-none disabled:cursor-default',
            // Transition
            'transition-shadow duration-quick-2 ease-in-out',
            // Chevron rotation
            '[&[data-state=open]>div:last-child]:rotate-180',
            // Hover underline on title
            '[&:hover_[data-slot=accordion-title-text]]:underline',
          )}
        >
          {/* Inner header content wrapper */}
          <div className="flex flex-1 items-center gap-6 px-3 py-1">
            {/* Title container (icon + text block) */}
            <div className="flex flex-1 items-start gap-4">
              {/* Leading icon */}
              {startIcon && (
                <span
                  data-slot="accordion-icon"
                  className={cn(
                    'shrink-0 size-icon-md',
                    disabled ? 'icon-disabled' : 'icon-default'
                  )}
                >
                  {startIcon}
                </span>
              )}

              {/* Title text block */}
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
                {subtitle && (
                  <span
                    data-slot="accordion-subtitle-text"
                    className={cn(
                      'text-body-sm font-weight-regular',
                      disabled ? 'text-disabled' : 'text-default'
                    )}
                  >
                    {subtitle}
                  </span>
                )}
              </div>
            </div>

            {/* Badge (optional) */}
            {showBadge && (
              <BadgeNonSemantic
                size="sm"
                appearance="Inverted"
                colour="Blue Grey"
                label={badgeLabel}
              />
            )}
          </div>

          {/* Chevron — styled to match EH Button (Secondary, xs, Icon only) */}
          <div
            data-slot="accordion-chevron"
            className={cn(
              // Container: matches Button Secondary xs Icon-only visual
              'flex shrink-0 items-center justify-center',
              'rounded-md border-xs border-solid p-3',
              'default-ring',
              'transition-transform duration-quick-2 ease-in-out',
              disabled
                ? 'border-disabled bg-default icon-disabled no-ring'
                : 'border-default bg-default icon-default'
            )}
          >
            {/* Inline chevron SVG — size matches icon-xs (16px at 100% text-resize) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-icon-xs"
              aria-hidden="true"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </AccordionPrimitive.Trigger>
      </div>
    </AccordionPrimitive.Header>

    {/* Content panel */}
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        'overflow-hidden',
        'data-[state=open]:animate-accordion-down',
        'data-[state=closed]:animate-accordion-up'
      )}
    >
      <div className="px-11 py-4 text-body-sm font-weight-regular text-default">
        {children}
      </div>
    </AccordionPrimitive.Content>
  </AccordionPrimitive.Item>
))
AccordionItem.displayName = 'AccordionItem'

// ────────────────────────────────────────────────────────
// Exports
// ────────────────────────────────────────────────────────

export { Accordion, AccordionItem }
export type { AccordionProps, AccordionItemProps }
