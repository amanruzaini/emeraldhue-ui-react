import figma from '@figma/code-connect/react'
import { Button } from './Button'

figma.connect(
  Button,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=135225-12196',
  {
    variant: {
      Content: 'Label + icon',
    },
    props: {
      variant: figma.enum('Type', {
        Primary: 'Primary',
        Secondary: 'Secondary',
        Tertiary: 'Tertiary',
        Destructive: 'Destructive',
      }),
      size: figma.enum('Size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      label: figma.string('Label'),
      disabled: figma.boolean('Disabled'),
      startIcon: figma.boolean('Icon Leading', {
        true: figma.children('Icon Leading'),
        false: undefined,
      }),
      endIcon: figma.boolean('Icon Trailing', {
        true: figma.children('Icon Trailing'),
        false: undefined,
      }),
    },
    example: ({ variant, size, label, disabled, startIcon, endIcon }) => (
      <Button
        variant={variant}
        size={size}
        startIcon={startIcon}
        endIcon={endIcon}
        disabled={disabled}
      >
        {label}
      </Button>
    ),
  }
)

figma.connect(
  Button,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=135225-12196',
  {
    variant: {
      Content: 'Icon only',
    },
    props: {
      variant: figma.enum('Type', {
        Primary: 'Primary',
        Secondary: 'Secondary',
        Tertiary: 'Tertiary',
        Destructive: 'Destructive',
      }),
      size: figma.enum('Size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      disabled: figma.boolean('Disabled'),
      icon: figma.boolean('Icon Leading', {
        true: figma.children('Icon Leading'),
        false: figma.boolean('Icon Trailing', {
          true: figma.children('Icon Trailing'),
          false: undefined,
        }),
      }),
    },
    example: ({ variant, size, disabled, icon }) => (
      <Button variant={variant} size={size} iconOnly disabled={disabled}>
        {icon}
      </Button>
    ),
  }
)
