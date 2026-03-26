import figma from '@figma/code-connect'
import { BadgeNotificationSemantic } from './BadgeNotificationSemantic'

figma.connect(
  BadgeNotificationSemantic,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=132348-4539',
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
      status: figma.enum('Status', {
        Info: 'Info',
        Alert: 'Alert',
      }),
    },
    example: ({ size, shape, status }) => (
      <BadgeNotificationSemantic
        size={size}
        shape={shape}
        status={status}
        count={1}
      />
    ),
  },
)
