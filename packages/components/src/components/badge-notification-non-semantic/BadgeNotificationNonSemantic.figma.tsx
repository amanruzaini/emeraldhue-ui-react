import figma from '@figma/code-connect'
import { BadgeNotificationNonSemantic } from './BadgeNotificationNonSemantic'

figma.connect(
  BadgeNotificationNonSemantic,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=133139-36562',
  {
    props: {
      size: figma.enum('Size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      shape: figma.enum('Shape', {
        Solid: 'Solid',
        Inverted: 'Inverted',
      }),
      colour: figma.enum('Colour', {
        Brand: 'Brand',
        Neutral: 'Neutral',
      }),
    },
    example: ({ size, shape, colour }) => (
      <BadgeNotificationNonSemantic
        size={size}
        shape={shape}
        colour={colour}
        count={1}
      />
    ),
  },
)
