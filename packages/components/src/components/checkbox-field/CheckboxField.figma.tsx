import figma from '@figma/code-connect/react'
import { CheckboxField } from './CheckboxField'

figma.connect(
  CheckboxField,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=132812-50342&m=dev',
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
      <CheckboxField
        size={size}
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        readOnly
        description="Save my login details for next time."
      >
        Remember Me
      </CheckboxField>
    ),
  }
)
