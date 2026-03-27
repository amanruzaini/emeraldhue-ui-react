import figma from '@figma/code-connect/react'
import { AvatarSingle } from './AvatarSingle'

figma.connect(
  AvatarSingle,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=140384-15661',
  {
    props: {
      size: figma.enum('Size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
        '2xl': '2xl',
        '3xl': '3xl',
        '4xl': '4xl',
      }),
      type: figma.enum('Type', {
        Image: 'Image',
        Initial: 'Initial',
      }),
      indicator: figma.boolean('Indicator'),
      indicatorType: figma.enum('Indicator Type', {
        Status: 'Status',
        Logo: 'Logo',
      }),
    },
    example: ({ size, type, indicator, indicatorType }) => (
      <AvatarSingle
        size={size}
        type={type}
        indicator={indicator}
        indicatorType={indicatorType}
        src="/avatar.jpg"
        alt="User name"
        initials="AZ"
      />
    ),
  },
)
