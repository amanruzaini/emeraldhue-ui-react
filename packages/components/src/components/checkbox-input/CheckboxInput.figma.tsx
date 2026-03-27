import figma from '@figma/code-connect/react'
import { CheckboxInput } from './CheckboxInput'

figma.connect(
  CheckboxInput,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=132812-50267&m=dev',
  {
    props: {
      size: figma.enum('Size', {
        sm: 'sm',
        md: 'md',
      }),
      checked: figma.boolean('Checked'),
      indeterminate: figma.boolean('Indeterminate'),
      disabled: figma.enum('State', { Disabled: true }),
    },
    example: ({ size, checked, indeterminate, disabled }) => (
      <CheckboxInput
        aria-label="Checkbox input"
        size={size}
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        readOnly
      />
    ),
  }
)
