import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'border-w': [
        'border-none',
        'border-xs',
        'border-sm',
        'border-md',
        'border-lg',
        'border-xl',
      ],
      'border-w-t': [
        'border-t-none',
        'border-t-xs',
        'border-t-sm',
        'border-t-md',
        'border-t-lg',
        'border-t-xl',
      ],
      'border-w-r': [
        'border-r-none',
        'border-r-xs',
        'border-r-sm',
        'border-r-md',
        'border-r-lg',
        'border-r-xl',
      ],
      'border-w-b': [
        'border-b-none',
        'border-b-xs',
        'border-b-sm',
        'border-b-md',
        'border-b-lg',
        'border-b-xl',
      ],
      'border-w-l': [
        'border-l-none',
        'border-l-xs',
        'border-l-sm',
        'border-l-md',
        'border-l-lg',
        'border-l-xl',
      ],
      'border-color': [
        'border-brand',
        'border-brand-strong',
        'border-brand-disabled',
        'border-brand-hover',
        'border-error',
        'border-error-strong',
        'border-error-disabled',
        'border-neutral',
        'border-default',
        'border-weak',
        'border-strong',
        'border-transparent',
      ],
      'font-family': ['font-default'],
      'font-weight': ['font-weight-medium'],
      'font-size': ['text-body-xs', 'text-body-sm', 'text-body-md'],
      size: [
        'size-icon-xs',
        'size-icon-sm',
        'size-icon-md',
        'size-icon-lg',
        'size-icon-xl',
        'size-icon-2xl',
        'size-icon-3xl',
      ],
      'text-color': [
        'text-all-white',
        'text-brand',
        'text-brand-disabled',
        'text-error',
        'text-default',
        'text-weak',
        'text-strong',
        'text-neutral',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
