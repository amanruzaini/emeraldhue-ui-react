import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Button } from '../button'

export type AlertStatus = 'warning' | 'neutral' | 'error' | 'success' | 'info'

export const alertVariants = cva(
  [
    'flex',
    'flex-col',
    'w-full',
    'rounded-lg',
    'border-xs',
    'border-solid',
    'font-default',
    'text-body-sm',
  ],
  {
    variants: {
      status: {
        warning: 'bg-warning-inverted border-warning',
        neutral: 'bg-default border-default',
        error: 'bg-error-inverted border-error',
        success: 'bg-success-inverted border-success',
        info: 'bg-info-inverted border-info',
      },
    },
    defaultVariants: {
      status: 'warning',
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Maps to Figma "Status" property. Controls background, border, and icon. */
  status?: AlertStatus
  /** The bold alert message displayed in the header row. */
  title: string
  /** Optional callback when the "Details" action button is clicked. Button only renders when provided. */
  onDetails?: () => void
  /** Optional callback when the "Close" action button is clicked. Button only renders when provided. */
  onClose?: () => void
}

const AlertTriangleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8.57465 3.21665L1.51632 14.1667C1.37079 14.4187 1.29379 14.7044 1.29298 14.9954C1.29216 15.2864 1.36756 15.5726 1.51167 15.8254C1.65578 16.0783 1.86359 16.2891 2.11437 16.4368C2.36515 16.5845 2.65007 16.6639 2.94098 16.6667H17.0577C17.3486 16.6639 17.6335 16.5845 17.8843 16.4368C18.1351 16.2891 18.3429 16.0783 18.487 15.8254C18.6311 15.5726 18.7065 15.2864 18.7057 14.9954C18.7049 14.7044 18.6279 14.4187 18.4823 14.1667L11.424 3.21665C11.2755 2.97174 11.0664 2.76925 10.8167 2.62874C10.567 2.48824 10.2849 2.41431 9.99798 2.41431C9.71107 2.41431 9.42899 2.48824 9.17929 2.62874C8.92959 2.76925 8.72044 2.97174 8.57198 3.21665H8.57465Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 7.5V10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14.1667H10.0083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 6.66667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 13.3333H10.0083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckCircleFilledIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" fill="currentColor"/>
    <path d="M7.5 10L9.16667 11.6667L12.5 8.33333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const InfoCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 13.3333V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 6.66667H10.0083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const statusIconMap: Record<AlertStatus, { icon: React.ReactNode; className: string }> = {
  warning: {
    icon: <AlertTriangleIcon />,
    className: 'icon-warning',
  },
  error: {
    icon: <AlertCircleIcon />,
    className: 'icon-error',
  },
  success: {
    icon: <CheckCircleFilledIcon />,
    className: 'icon-success',
  },
  info: {
    icon: <InfoCircleIcon />,
    className: 'icon-info',
  },
  neutral: {
    icon: <InfoCircleIcon />,
    className: 'icon-default',
  },
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ status = 'warning', title, children, onDetails, onClose, className, ...props }, ref) => {
    const iconConfig = statusIconMap[status]
    const hasActions = onDetails || onClose

    return (
      <div
        ref={ref}
        role="alert"
        data-slot="alert"
        className={cn(alertVariants({ status }), className)}
        {...props}
      >
        {/* Header row */}
        <div className="flex items-center gap-4 px-8 py-6 min-h-[60px]">
          <span className={cn('shrink-0 size-icon-md', iconConfig.className)}>
            {iconConfig.icon}
          </span>

          <p
            data-slot="alert-title"
            className="flex-1 font-default text-body-sm font-weight-semibold text-default"
          >
            {title}
          </p>

          {hasActions && (
            <div className="flex items-center gap-2 shrink-0">
              {onDetails && (
                <Button variant="Tertiary" size="sm" onClick={onDetails}>
                  Details
                </Button>
              )}
              {onClose && (
                <Button variant="Tertiary" size="sm" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Description body (optional) */}
        {children && (
          <div
            data-slot="alert-description"
            className="px-8 pb-8 text-body-sm font-weight-regular text-default"
          >
            {children}
          </div>
        )}
      </div>
    )
  }
)
Alert.displayName = 'Alert'

export { Alert }
