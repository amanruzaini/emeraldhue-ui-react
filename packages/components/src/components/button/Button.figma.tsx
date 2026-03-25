import figma from '@figma/code-connect'
import { Button } from './Button'

figma.connect(
  Button,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=135225-12196',
  {
    props: {
      variant: figma.enum('Type', {
        Primary: 'Primary',
        Secondary: 'Secondary',
        Tertiary: 'Tertiary',
        Destructive: 'Destructive',
      }),
      size: figma.enum('Size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      content: figma.enum('Content', {
        'Label + icon': 'Label + icon',
        'Icon only': 'Icon only',
      }),
      iconLeading: figma.boolean('Icon Leading'),
      iconTrailing: figma.boolean('Icon Trailing'),
      label: figma.string('Label'),
    },
    example: ({ variant, size, content, iconLeading, iconTrailing, label }) => (
      <Button
        variant={variant}
        size={size}
        content={content}
        iconLeading={iconLeading}
        iconTrailing={iconTrailing}
        label={label}
      />
    ),
  }
)
