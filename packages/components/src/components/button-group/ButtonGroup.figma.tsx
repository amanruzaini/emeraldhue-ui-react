import figma from '@figma/code-connect/react'
import { ButtonGroup, ButtonGroupItem } from './ButtonGroup'

// ButtonGroup container
figma.connect(
  ButtonGroup,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=134881-2579',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({ children }) => (
      <ButtonGroup>{children}</ButtonGroup>
    ),
  },
)

// ButtonGroupItem
figma.connect(
  ButtonGroupItem,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=134870-39367',
  {
    props: {
      label: figma.string('Label'),
      startIcon: figma.boolean('Icon Leading', {
        true: figma.children('Icon Leading'),
        false: undefined,
      }),
      endIcon: figma.boolean('Icon Trailing', {
        true: figma.children('Icon Trailing'),
        false: undefined,
      }),
      disabled: figma.enum('State', { Disabled: true }),
      viewOnly: figma.enum('State', { 'View only': true }),
    },
    example: ({ label, startIcon, endIcon, disabled, viewOnly }) => (
      <ButtonGroupItem
        startIcon={startIcon}
        endIcon={endIcon}
        disabled={disabled}
        viewOnly={viewOnly}
      >
        {label}
      </ButtonGroupItem>
    ),
  },
)
