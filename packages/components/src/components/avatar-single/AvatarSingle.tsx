import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AvatarSingleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
export type AvatarSingleType = 'Image' | 'Initial'
export type AvatarSingleIndicatorType = 'Status' | 'Logo'

export interface AvatarSingleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maps to Figma "Size" property */
  size?: AvatarSingleSize
  /** Maps to Figma "Type" property — Image shows a photo, Initial shows text initials */
  type?: AvatarSingleType
  /** Maps to Figma "Indicator" boolean — shows/hides the indicator badge */
  indicator?: boolean
  /** Maps to Figma "Indicator Type" property — Status shows online/offline dot, Logo shows company icon */
  indicatorType?: AvatarSingleIndicatorType

  // Image type props
  /** Image source URL — used when type="Image" */
  src?: string
  /** Alt text for accessibility — used when type="Image" */
  alt?: string

  // Initial type props
  /** Initials text (e.g. "AZ") — used when type="Initial" */
  initials?: string

  // Status indicator props
  /** Whether the user is online — used when indicatorType="Status" */
  online?: boolean

  // Logo indicator props
  /** React node for company logo icon — used when indicatorType="Logo" */
  logoIcon?: React.ReactNode
}

// ---------------------------------------------------------------------------
// CVA — Wrapper
// ---------------------------------------------------------------------------

export const avatarWrapperVariants = cva(
  ['relative inline-flex shrink-0'],
  {
    variants: {
      size: {
        xs: 'size-[28px]',
        sm: 'size-[36px]',
        md: 'size-[44px]',
        lg: 'size-[52px]',
        xl: 'size-[60px]',
        '2xl': 'size-[68px]',
        '3xl': 'size-[84px]',
        '4xl': 'size-[100px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

// ---------------------------------------------------------------------------
// CVA — Inner circle
// ---------------------------------------------------------------------------

export const avatarInnerVariants = cva(
  [
    'absolute left-[2px] top-[2px]',
    'overflow-clip rounded-full',
    'border-solid border-[length:var(--eh-border-width-sm)] border-focus-inner',
    'group-hover:shadow-[0px_0px_0px_4px_var(--eh-colour-border-hover-ring)]',
    'group-focus-visible:shadow-[0px_0px_0px_2px_var(--eh-colour-border-focus-inner),0px_0px_0px_5px_var(--eh-colour-border-focus-outer)]',
  ],
  {
    variants: {
      size: {
        xs: 'size-[24px]',
        sm: 'size-[32px]',
        md: 'size-[40px]',
        lg: 'size-[48px]',
        xl: 'size-[56px]',
        '2xl': 'size-[64px]',
        '3xl': 'size-[80px]',
        '4xl': 'size-[96px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

// ---------------------------------------------------------------------------
// CVA — Initials typography
// ---------------------------------------------------------------------------

export const avatarInitialsVariants = cva(
  [
    'flex items-center justify-center',
    'size-full',
    'overflow-clip rounded-full',
    'bg-avatar text-default',
    'select-none',
  ],
  {
    variants: {
      size: {
        xs: 'text-body-xs font-weight-medium',
        sm: 'text-body-xs font-weight-medium',
        md: 'text-body-md',
        lg: 'text-body-lg font-weight-medium',
        xl: 'text-heading-6 font-weight-medium',
        '2xl': 'text-heading-5 font-weight-medium',
        '3xl': 'text-heading-5 font-weight-medium',
        '4xl': 'text-heading-4 font-weight-semibold',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

// ---------------------------------------------------------------------------
// CVA — Indicator
// ---------------------------------------------------------------------------

export const avatarIndicatorVariants = cva(
  [
    'absolute bottom-[2px] right-[2px]',
    'rounded-full',
    'border-solid border-[length:var(--eh-border-width-sm)] border-neutral-avatargroup',
  ],
  {
    variants: {
      size: {
        xs: 'size-[6px]',
        sm: 'size-[8px]',
        md: 'size-[10px]',
        lg: 'size-[12px]',
        xl: 'size-[14px]',
        '2xl': 'size-[16px]',
        '3xl': 'size-[16px]',
        '4xl': 'size-[16px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

// Company logo indicator uses different sizes than status dot
const companyIconSizes: Record<AvatarSingleSize, string> = {
  xs: 'size-[10px]',
  sm: 'size-[12px]',
  md: 'size-[14px]',
  lg: 'size-[16px]',
  xl: 'size-[18px]',
  '2xl': 'size-[20px]',
  '3xl': 'size-[22px]',
  '4xl': 'size-[24px]',
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

function StatusDot({ online }: { online: boolean }) {
  return (
    <div
      className={cn(
        'size-full rounded-full',
        online ? 'bg-success' : 'bg-neutral'
      )}
    />
  )
}

function CompanyLogo({
  size,
  logoIcon,
}: {
  size: AvatarSingleSize
  logoIcon: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'rounded-full bg-brand',
        companyIconSizes[size]
      )}
    >
      {logoIcon}
    </div>
  )
}

// ---------------------------------------------------------------------------
// AvatarSingle
// ---------------------------------------------------------------------------

const AvatarSingle = React.forwardRef<HTMLDivElement, AvatarSingleProps>(
  (
    {
      size = 'md',
      type = 'Image',
      indicator = false,
      indicatorType = 'Status',
      src,
      alt = '',
      initials,
      online = true,
      logoIcon,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        data-slot="avatar-single"
        ref={ref}
        className={cn('group', avatarWrapperVariants({ size }), className)}
        {...props}
      >
        {/* Inner circle */}
        <div
          data-slot="avatar-inner"
          className={cn(avatarInnerVariants({ size }))}
        >
          {type === 'Image' ? (
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 size-full object-cover pointer-events-none rounded-full"
            />
          ) : (
            <div className={cn(avatarInitialsVariants({ size }))}>
              <span>{initials}</span>
            </div>
          )}
        </div>

        {/* Indicator */}
        {indicator && (
          <div
            data-slot="avatar-indicator"
            className={cn(avatarIndicatorVariants({ size }))}
          >
            {indicatorType === 'Status' ? (
              <StatusDot online={online} />
            ) : (
              <CompanyLogo size={size} logoIcon={logoIcon} />
            )}
          </div>
        )}
      </div>
    )
  }
)
AvatarSingle.displayName = 'AvatarSingle'

export { AvatarSingle }
