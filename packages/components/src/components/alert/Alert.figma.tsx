import figma from '@figma/code-connect'
import { Alert } from './Alert'

figma.connect(
  Alert,
  'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=136903-37038',
  {
    props: {
      status: figma.enum('Status', {
        Warning: 'warning',
        Neutral: 'neutral',
        Error: 'error',
        Succes: 'success',
        Info: 'info',
      }),
      description: figma.boolean('Description'),
    },
    example: ({ status, description }) => (
      <Alert
        status={status}
        title="Alert message"
        onClose={() => {}}
      >
        {description ? 'Description content here' : undefined}
      </Alert>
    ),
  }
)
