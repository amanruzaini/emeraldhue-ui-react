import figma from '@figma/code-connect'
import { BadgeNonSemantic } from './BadgeNonSemantic'

figma.connect(
  BadgeNonSemantic,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=132065-2788',
  {
    props: {
      size: figma.enum('Size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      appearance: figma.enum('Appearance', {
        Inverted: 'Inverted',
        Solid: 'Solid',
      }),
      colour: figma.enum('Colour', {
        Brand: 'Brand',
        Accent: 'Accent',
        'Blue Grey': 'Blue Grey',
      }),
      label: figma.string('Label'),
      iconLeading: figma.boolean('Icon Leading'),
    },
    example: ({ size, appearance, colour, label, iconLeading }) => (
      <BadgeNonSemantic
        size={size}
        appearance={appearance}
        colour={colour}
        label={label}
        iconLeading={iconLeading}
      />
    ),
  },
)
