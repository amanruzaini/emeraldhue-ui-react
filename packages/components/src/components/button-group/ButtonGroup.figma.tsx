import figma from '@figma/code-connect'
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
      iconLeading: figma.boolean('Icon Leading'),
      leadIcon: figma.children('Icon Leading'),
      iconTrailing: figma.boolean('Icon Trailing'),
      trailIcon: figma.children('Icon Trailing'),
      disabled: figma.enum('State', { Disabled: true }),
      viewOnly: figma.enum('State', { 'View only': true }),
    },
    example: ({ label, iconLeading, leadIcon, iconTrailing, trailIcon, disabled, viewOnly }) => (
      <ButtonGroupItem
        startIcon={iconLeading ? leadIcon : undefined}
        endIcon={iconTrailing ? trailIcon : undefined}
        disabled={disabled}
        viewOnly={viewOnly}
      >
        {label}
      </ButtonGroupItem>
    ),
  },
)
