import figma from '@figma/code-connect'
import { RadioInput } from './RadioInput'

figma.connect(
  RadioInput,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=132946-285',
  {
    props: {
      selected: figma.boolean('Selected'),
    },
    example: ({ selected }) => (
      <RadioInput checked={selected} />
    ),
  }
)
