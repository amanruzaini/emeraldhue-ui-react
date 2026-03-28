import figma from '@figma/code-connect'
import { TextLink } from './TextLink'

figma.connect(
  TextLink,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=135225:13390',
  {
    props: {
      variant: figma.enum('Type', {
        Primary: 'Primary',
        Destructive: 'Destructive',
      }),
      size: figma.enum('Size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      label: figma.string('Label'),
      iconLeading: figma.boolean('Icon Leading'),
      iconTrailing: figma.boolean('Icon Trailing'),
      leadIcon: figma.children('Icon Leading'),
      trailIcon: figma.children('Icon Trailing'),
      content: figma.enum('Content', {
        'Label + icon': 'Label + icon',
        'Icon only': 'Icon only',
      }),
      iconChild: figma.children('Icon Before'),
    },
    example: ({ variant, size, label, iconLeading, iconTrailing, leadIcon, trailIcon, content, iconChild }) => {
      if (content === 'Icon only') {
        return (
          <TextLink variant={variant} size={size} iconOnly icon={iconChild} aria-label={label}>
            {label}
          </TextLink>
        )
      }
      return (
        <TextLink
          variant={variant}
          size={size}
          startIcon={iconLeading ? leadIcon : undefined}
          endIcon={iconTrailing ? trailIcon : undefined}
        >
          {label}
        </TextLink>
      )
    },
  },
)
