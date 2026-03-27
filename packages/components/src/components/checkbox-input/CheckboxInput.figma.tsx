import figma from '@figma/code-connect'
import { CheckboxInput } from './CheckboxInput'

figma.connect(
  CheckboxInput,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=132812-50267&m=dev',
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
      <CheckboxInput
        aria-label="Checkbox input"
        size={size}
        checked={checked}
        indeterminate={indeterminate}
        disabled={state === 'Disabled'}
        readOnly
      />
    ),
  }
)
