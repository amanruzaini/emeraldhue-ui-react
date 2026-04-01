import figma from '@figma/code-connect'
import { Pagination } from './Pagination'

figma.connect(
  Pagination,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0--Early-Access-Preview-?node-id=137222-40923',
  {
    props: {
      variant: figma.enum('Type', {
        'Card full combined': 'card',
        'Full combined': 'bar',
      }),
    },
    example: ({ variant }) => (
      <Pagination
        variant={variant}
        page={2}
        totalPages={8}
        onPageChange={(page) => console.log(page)}
      />
    ),
  },
)
