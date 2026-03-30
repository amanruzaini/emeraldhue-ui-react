'use client'

import { useState, type ReactNode } from 'react'

const THEMES = [
  { value: 'theme-light', label: 'Light' },
  { value: 'theme-dark', label: 'Dark' },
  { value: 'theme-light-high-contrast', label: 'Light HC' },
  { value: 'theme-dark-high-contrast', label: 'Dark HC' },
  { value: 'theme-light-colour-blind', label: 'Light CB' },
  { value: 'theme-dark-colour-blind', label: 'Dark CB' },
] as const

const TEXT_RESIZE = [
  { value: 'text-resize-75', label: '75%' },
  { value: 'text-resize-100', label: '100%' },
  { value: 'text-resize-125', label: '125%' },
  { value: 'text-resize-150', label: '150%' },
  { value: 'text-resize-200', label: '200%' },
] as const

type Theme = (typeof THEMES)[number]['value']
type TextResize = (typeof TEXT_RESIZE)[number]['value']

interface ComponentPreviewProps {
  children: ReactNode
  /** Optional title shown above the preview */
  title?: string
}

export function ComponentPreview({ children, title }: ComponentPreviewProps) {
  const [theme, setTheme] = useState<Theme>('theme-light')
  const [textResize, setTextResize] = useState<TextResize>('text-resize-100')
  const isDark = theme.includes('dark')

  const selectStyle = {
    fontSize: '0.8125rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid var(--nextra-border-color, #e5e7eb)',
    background: 'transparent',
  } as const

  return (
    <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Controls bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem 0.5rem 0 0',
          border: '1px solid var(--nextra-border-color, #e5e7eb)',
          borderBottom: 'none',
          fontSize: '0.8125rem',
          flexWrap: 'wrap',
        }}
      >
        {title && (
          <span style={{ fontWeight: 600, marginRight: 'auto' }}>{title}</span>
        )}

        <>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            Theme
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              style={selectStyle}
            >
              {THEMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            Text
            <select
              value={textResize}
              onChange={(e) => setTextResize(e.target.value as TextResize)}
              style={selectStyle}
            >
              {TEXT_RESIZE.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </>
      </div>

      {/* Preview area */}
      <div
        data-theme={theme}
        data-text-resize={textResize}
        style={{
          padding: '2rem',
          borderRadius: '0 0 0.5rem 0.5rem',
          border: '1px solid var(--nextra-border-color, #e5e7eb)',
          background: isDark ? '#1a1a1a' : '#ffffff',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}
