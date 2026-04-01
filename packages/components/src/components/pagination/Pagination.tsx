/**
 * DESIGN DECISION — Controlled only (no internal page state)
 *
 * Pagination almost always lives alongside a data-fetching layer (table, list,
 * API call). The consumer needs to know the current page to fetch the right data,
 * so an uncontrolled mode would be convenient for demos but misleading in
 * production — nobody in a Petronas industrial app would use pagination without
 * knowing which page they're on.
 *
 * Controlled-only keeps the API honest and avoids dual-state sync complexity.
 * If this decision is revisited, adding `defaultPage` for uncontrolled mode is
 * a backwards-compatible change.
 *
 * Discussed with engineering team: [date TBD]
 */

import * as React from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../button'

// Future: Add previousKeys/nextKeys props to compose <KeyboardShortcut> inside prev/next buttons.
// Deferred until state management is in place.

export type PaginationVariant = 'card' | 'bar'

export interface PaginationProps extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> {
  /** Maps to Figma "Type" property. "card" = Card full combined, "bar" = Full combined. */
  variant?: PaginationVariant
  /** Current active page (1-indexed). Required — controlled component. */
  page: number
  /** Total number of pages. */
  totalPages: number
  /** Callback when page changes. */
  onPageChange: (page: number) => void
  /** Pages shown on each side of current page. @default 1 */
  siblingCount?: number
  /** @default "Previous" */
  previousLabel?: string
  /** @default "Next" */
  nextLabel?: string
  // Future: previousKeys/nextKeys props for KeyboardShortcut composition
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const ChevronLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10 12L6 8L10 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6 12L10 8L6 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ─── Page range algorithm ─────────────────────────────────────────────────────

function generatePageRange(
  page: number,
  totalPages: number,
  siblingCount: number,
): (number | 'ellipsis')[] {
  const range: (number | 'ellipsis')[] = []

  const firstPage = 1
  const lastPage = totalPages

  const leftSiblingIndex = Math.max(page - siblingCount, firstPage)
  const rightSiblingIndex = Math.min(page + siblingCount, lastPage)

  const showLeftEllipsis = leftSiblingIndex > firstPage + 1
  const showRightEllipsis = rightSiblingIndex < lastPage - 1

  range.push(firstPage)

  if (showLeftEllipsis) {
    range.push('ellipsis')
  } else {
    for (let i = firstPage + 1; i < leftSiblingIndex; i++) {
      range.push(i)
    }
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== firstPage && i !== lastPage) {
      range.push(i)
    }
  }

  if (showRightEllipsis) {
    range.push('ellipsis')
  } else {
    for (let i = rightSiblingIndex + 1; i < lastPage; i++) {
      range.push(i)
    }
  }

  if (lastPage !== firstPage) {
    range.push(lastPage)
  }

  return range
}

// ─── Shared typography classes ────────────────────────────────────────────────

const typographyClasses = [
  'text-[length:var(--eh-font-size-body-sm)]',
  'leading-[var(--eh-font-line-height-body-xs)]',
  'tracking-[var(--eh-font-letter-spacing-body-sm)]',
  'font-weight-medium',
]

// ─── Ellipsis ─────────────────────────────────────────────────────────────────

const Ellipsis = ({ layoutVariant }: { layoutVariant: 'card' | 'bar' }) => (
  <span
    data-slot="pagination-ellipsis"
    className={cn(
      'inline-flex items-center justify-center',
      ...typographyClasses,
      'text-disabled',
      layoutVariant === 'card' && 'min-w-[28px] p-2 rounded-sm',
      layoutVariant === 'bar' && 'min-w-[36px] p-4',
    )}
    aria-hidden="true"
  >
    ...
  </span>
)

// ─── PaginationItem ───────────────────────────────────────────────────────────

interface PaginationItemProps {
  page: number
  isActive: boolean
  onClick: () => void
  layoutVariant: 'card' | 'bar'
  isLastBarItem?: boolean
}

const PaginationItem = React.forwardRef<HTMLButtonElement, PaginationItemProps>(
  ({ page, isActive, onClick, layoutVariant, isLastBarItem = false }, ref) => {
    const shared = cn(
      'inline-flex items-center justify-center',
      ...typographyClasses,
      'cursor-pointer transition-colors',
      'focus-visible:focus-ring-bezel focus-visible:outline-none',
    )

    if (layoutVariant === 'card') {
      return (
        <button
          ref={ref}
          data-slot="pagination-item"
          aria-current={isActive ? 'page' : undefined}
          onClick={onClick}
          className={cn(
            shared,
            'min-w-[28px] p-2 rounded-sm overflow-clip',
            isActive
              ? 'bg-disabled border-xs border-solid border-disabled text-default pointer-events-none'
              : [
                  'bg-default border-xs border-solid border-default text-strong default-ring-bezel',
                  'hover:bg-[var(--eh-colour-bg-brand-inverted)]',
                  'hover:border-[var(--eh-colour-border-brand-hover)]',
                  'hover:hover-ring-bezel',
                  'active:bg-[var(--eh-colour-bg-brand-inverted)]',
                  'active:border-[var(--eh-colour-border-brand-hover)]',
                ],
          )}
        >
          {page}
        </button>
      )
    }

    return (
      <button
        ref={ref}
        data-slot="pagination-item"
        aria-current={isActive ? 'page' : undefined}
        onClick={onClick}
        className={cn(
          shared,
          'min-w-[36px] p-4 overflow-clip',
          !isLastBarItem && 'border-r border-r-[var(--eh-colour-border-weak)]',
          isActive
            ? 'bg-disabled text-default pointer-events-none'
            : [
                'bg-default text-strong default-ring-bezel',
                'hover:bg-[var(--eh-colour-bg-brand-inverted)]',
                'hover:hover-ring-bezel',
                'active:bg-[var(--eh-colour-bg-brand-inverted)]',
              ],
        )}
      >
        {page}
      </button>
    )
  },
)
PaginationItem.displayName = 'PaginationItem'

// ─── Bar nav button (prev/next cell) ─────────────────────────────────────────

interface BarNavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hasDivider?: boolean
  children: React.ReactNode
}

const BarNavButton = React.forwardRef<HTMLButtonElement, BarNavButtonProps>(
  ({ hasDivider = false, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center p-4 overflow-clip',
        'cursor-pointer transition-colors',
        hasDivider && 'border-r border-r-[var(--eh-colour-border-weak)]',
        'bg-default text-strong default-ring-bezel',
        'hover:bg-[var(--eh-colour-bg-brand-inverted)] hover:hover-ring-bezel',
        'focus-visible:focus-ring-bezel focus-visible:outline-none',
        'disabled:text-disabled disabled:bg-transparent disabled:cursor-not-allowed disabled:no-ring',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)
BarNavButton.displayName = 'BarNavButton'

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      variant = 'card',
      page,
      totalPages,
      onPageChange,
      siblingCount = 1,
      previousLabel = 'Previous',
      nextLabel = 'Next',
      className,
      ...rest
    },
    ref,
  ) => {
    const pageRange = generatePageRange(page, totalPages, siblingCount)

    if (variant === 'card') {
      return (
        <nav
          ref={ref as React.Ref<HTMLElement>}
          data-slot="pagination"
          aria-label="Pagination"
          className={cn('flex items-center justify-between p-4 rounded-2xl', className)}
          {...rest}
        >
          <Button
            variant="Secondary"
            size="sm"
            startIcon={<ChevronLeftIcon />}
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            {previousLabel}
          </Button>

          <div className="inline-flex items-center bg-application-shell border-xs border-weak p-3 rounded-lg gap-[6px]">
            {pageRange.map((item, index) =>
              item === 'ellipsis' ? (
                <Ellipsis key={`ellipsis-${index}`} layoutVariant="card" />
              ) : (
                <PaginationItem
                  key={item}
                  page={item}
                  isActive={item === page}
                  onClick={() => onPageChange(item)}
                  layoutVariant="card"
                />
              ),
            )}
          </div>

          <Button
            variant="Secondary"
            size="sm"
            endIcon={<ChevronRightIcon />}
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            {nextLabel}
          </Button>
        </nav>
      )
    }

    // bar variant
    return (
      <nav
        ref={ref as React.Ref<HTMLElement>}
        data-slot="pagination"
        aria-label="Pagination"
        className={cn(
          'inline-flex items-center bg-application-shell border-xs border-default rounded-lg default-ring-bezel overflow-clip',
          className,
        )}
        {...rest}
      >
        <BarNavButton
          data-slot="pagination-prev"
          hasDivider
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label={previousLabel}
        >
          <ChevronLeftIcon />
          <span
            className={cn('px-2', ...typographyClasses)}
          >
            {previousLabel}
          </span>
        </BarNavButton>

        {pageRange.map((item, index) =>
          item === 'ellipsis' ? (
            <Ellipsis key={`ellipsis-${index}`} layoutVariant="bar" />
          ) : (
            <PaginationItem
              key={item}
              page={item}
              isActive={item === page}
              onClick={() => onPageChange(item)}
              layoutVariant="bar"
              isLastBarItem={index === pageRange.length - 1}
            />
          ),
        )}

        <BarNavButton
          data-slot="pagination-next"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label={nextLabel}
        >
          <span
            className={cn('px-2', ...typographyClasses)}
          >
            {nextLabel}
          </span>
          <ChevronRightIcon />
        </BarNavButton>
      </nav>
    )
  },
)
Pagination.displayName = 'Pagination'

export { Pagination }
