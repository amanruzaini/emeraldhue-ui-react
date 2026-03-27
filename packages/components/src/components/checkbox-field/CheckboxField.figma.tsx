import figma from '@figma/code-connect'
import { CheckboxField } from './CheckboxField'

figma.connect(
  CheckboxField,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=132812-50342&m=dev',
  {
    props: {
      state: figma.enum('State', {
        Default: 'Default',
        Hover: 'Hover',
        Focus: 'Focus',
        Disabled: 'Disabled',
      }),
      size: figma.enum('Size', {
        sm: 'sm',
        md: 'md',
      }),
      checked: figma.boolean('Checked'),
      indeterminate: figma.boolean('Indeterminate'),
    },
    example: ({ state, size, checked, indeterminate }) => (
      <CheckboxField
        size={size}
        checked={checked}
        indeterminate={indeterminate}
        disabled={state === 'Disabled'}
        readOnly
        description="Save my login details for next time."
      >
        Remember Me
      </CheckboxField>
    ),
  }
)
