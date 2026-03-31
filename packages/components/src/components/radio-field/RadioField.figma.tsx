import figma from '@figma/code-connect'
import { RadioField } from './RadioField'

figma.connect(
  RadioField,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=132946-404',
  {
    props: {
      selected: figma.boolean('Selected'),
      description: figma.boolean('Description'),
    },
    example: ({ selected, description }) => (
      <RadioField
        checked={selected}
        description={description ? 'Save my login details for next time.' : undefined}
      >
        Remember Me
      </RadioField>
    ),
  }
)
