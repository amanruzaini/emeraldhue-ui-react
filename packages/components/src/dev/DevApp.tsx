import React from 'react'
import { Button } from '../components/button'
import type { ButtonVariant, ButtonSize } from '../components/button'

const themes = [
  'theme-light',
  'theme-dark',
  'theme-light-high-contrast',
  'theme-dark-high-contrast',
  'theme-light-colour-blind',
  'theme-dark-colour-blind',
] as const

const variants: ButtonVariant[] = ['Primary', 'Secondary', 'Tertiary', 'Destructive']
const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg']

const PlaceholderIcon = () => <span>●</span>

function setTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function DevApp() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '1rem' }}>EH Components Dev</h1>

      {/* Theme Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => setTheme(theme)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              background: '#f5f5f5',
            }}
          >
            {theme}
          </button>
        ))}
      </div>

      {/* Variants × Sizes */}
      <h2 style={{ marginBottom: '0.5rem' }}>Variants × Sizes (Label + icon)</h2>
      <table style={{ borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Variant \ Size</th>
            {sizes.map((size) => (
              <th key={size} style={{ padding: '0.5rem' }}>{size}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant}>
              <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{variant}</td>
              {sizes.map((size) => (
                <td key={size} style={{ padding: '0.5rem' }}>
                  <Button variant={variant} size={size}>
                    {variant}
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* With Icons */}
      <h2 style={{ marginBottom: '0.5rem' }}>With Leading & Trailing Icons</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {variants.map((variant) => (
          <Button
            key={variant}
            variant={variant}
            size="md"
            startIcon={<PlaceholderIcon />}
            endIcon={<PlaceholderIcon />}
          >
            {variant}
          </Button>
        ))}
      </div>

      {/* Icon Only */}
      <h2 style={{ marginBottom: '0.5rem' }}>Icon Only</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {variants.map((variant) => (
          sizes.map((size) => (
            <Button
              key={`${variant}-${size}`}
              variant={variant}
              size={size}
              iconOnly
            >
              <PlaceholderIcon />
            </Button>
          ))
        ))}
      </div>

      {/* Disabled States */}
      <h2 style={{ marginBottom: '0.5rem' }}>Disabled</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {variants.map((variant) => (
          <Button
            key={variant}
            variant={variant}
            size="md"
            disabled
          >
            {`${variant} (disabled)`}
          </Button>
        ))}
      </div>
    </div>
  )
}
