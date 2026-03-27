import figma from '@figma/code-connect/react'
import { AvatarGroup } from './AvatarGroup'
import { AvatarSingle } from '../avatar-single'

figma.connect(
  AvatarGroup,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=134521-14516',
  {
    props: {
      size: figma.enum('Size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
      }),
    },
    example: ({ size }) => (
      <AvatarGroup size={size} max={4}>
        <AvatarSingle type="Image" src="/avatar-1.jpg" alt="User 1" />
        <AvatarSingle type="Image" src="/avatar-2.jpg" alt="User 2" />
        <AvatarSingle type="Image" src="/avatar-3.jpg" alt="User 3" />
        <AvatarSingle type="Image" src="/avatar-4.jpg" alt="User 4" />
        <AvatarSingle type="Image" src="/avatar-5.jpg" alt="User 5" />
      </AvatarGroup>
    ),
  },
)
