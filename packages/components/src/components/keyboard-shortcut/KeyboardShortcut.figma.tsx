import figma from '@figma/code-connect'
import { KeyboardShortcut } from './cc-KeyboardShortcut'

const FIGMA_URL = 'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=132420-3977'

figma.connect(KeyboardShortcut, FIGMA_URL, {
  props: {
    keys: figma.enum('Key', {
      '1': 1,
      '2': 2,
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    colour: figma.enum('Colour', {
      Neutral: 'neutral',
      Brand: 'brand',
      Destructive: 'destructive',
    }),
    disabled: figma.enum('State', {
      Default: false,
      Disabled: true,
    }),
    label: figma.string('Label'),
  },
  example: ({ keys, size, colour, disabled, label }) => (
    <KeyboardShortcut
      keys={keys}
      size={size}
      colour={colour}
      disabled={disabled}
      modifierKey="Ctrl"
    >
      {label}
    </KeyboardShortcut>
  ),
})
