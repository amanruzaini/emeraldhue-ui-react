import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2]',
    'font-default font-weight-medium',
    'rounded-md',
    'border-solid',
    'border-t-xs',
    'border-l-xs',
    'border-r-xs',
    'border-b-sm',
    'default-ring-bezel',
    'transition-colors duration-quick-1',
    'focus-visible:outline-none focus-visible:focus-ring-bezel',
    'hover:hover-ring-bezel',
    'disabled:no-ring disabled:pointer-events-none disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        Primary: [
          'bg-brand',
          'text-all-white',
          'border-brand-strong',
          'hover:bg-brand-hover',
          'active:bg-brand-active',
          'disabled:bg-brand-disabled',
          'disabled:border-brand-disabled',
        ],
        Secondary: [
          'bg-default',
          'text-brand',
          'border-brand',
          'hover:bg-neutral',
          'active:bg-neutral-hover',
          'disabled:text-brand-disabled',
          'disabled:border-brand-disabled',
        ],
        Tertiary: [
          'bg-transparent',
          'text-brand',
          'border-transparent',
          'hover:bg-neutral',
          'active:bg-neutral-hover',
          'disabled:text-brand-disabled',
        ],
        Destructive: [
          'bg-error',
          'text-all-white',
          'border-error-strong',
          'hover:bg-error-hover',
          'active:bg-error-active',
          'disabled:bg-error-disabled',
          'disabled:border-error-disabled',
        ],
      },
      size: {
        xs: 'px-[var(--eh-spacing-4)] py-[var(--eh-spacing-2)] text-body-xs tracking-[var(--eh-font-letter-spacing-body-xs)] [--icon-size:var(--eh-icon-xs)]',
        sm: 'px-[var(--eh-spacing-6)] py-[var(--eh-spacing-4)] text-body-sm tracking-[var(--eh-font-letter-spacing-body-sm)] [--icon-size:var(--eh-icon-sm)]',
        md: 'px-[var(--eh-spacing-6)] py-[var(--eh-spacing-6)] text-body-sm tracking-[var(--eh-font-letter-spacing-body-sm)] [--icon-size:var(--eh-icon-md)]',
        lg: 'px-[var(--eh-spacing-6)] py-[var(--eh-spacing-7)] text-body-md tracking-[var(--eh-font-letter-spacing-body-md)] [--icon-size:var(--eh-icon-md)]',
      },
    },
    defaultVariants: {
      variant: 'Primary',
      size: 'md',
    },
  }
)

export const iconStyle = { width: 'var(--icon-size)', height: 'var(--icon-size)' }
