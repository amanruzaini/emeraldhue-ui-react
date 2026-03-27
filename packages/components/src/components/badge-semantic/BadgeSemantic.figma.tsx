import figma from '@figma/code-connect/react'
import { BadgeSemantic } from './BadgeSemantic'

figma.connect(
  BadgeSemantic,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=132058-40092',
  {
    props: {
      size: figma.enum('Size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      appearance: figma.enum('Appearance', {
        Inverted: 'Inverted',
        Solid: 'Solid',
      }),
      status: figma.enum('Status', {
        Error: 'Error',
        Success: 'Success',
        Info: 'Info',
        Warning: 'Warning',
      }),
      label: figma.string('Label'),
      iconLeading: figma.boolean('Icon Leading'),
    },
    example: ({ size, appearance, status, label, iconLeading }) => (
      <BadgeSemantic
        size={size}
        appearance={appearance}
        status={status}
        label={label}
        iconLeading={iconLeading}
      />
    ),
  },
)
