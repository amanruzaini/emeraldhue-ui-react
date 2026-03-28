interface Prop {
  name: string
  type: string
  default?: string
  description: string
  required?: boolean
}

interface PropsTableProps {
  props: Prop[]
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr
            style={{
              textAlign: 'left',
              borderBottom: '2px solid var(--nextra-border-color, #e5e7eb)',
            }}
          >
            <th style={{ padding: '0.5rem 1rem' }}>Prop</th>
            <th style={{ padding: '0.5rem 1rem' }}>Type</th>
            <th style={{ padding: '0.5rem 1rem' }}>Default</th>
            <th style={{ padding: '0.5rem 1rem' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr
              key={prop.name}
              style={{
                borderBottom: '1px solid var(--nextra-border-color, #e5e7eb)',
              }}
            >
              <td style={{ padding: '0.5rem 1rem', fontFamily: 'var(--nextra-font-family-mono, monospace)' }}>
                {prop.name}
                {prop.required && <span style={{ color: 'red', marginLeft: '0.25rem' }}>*</span>}
              </td>
              <td
                style={{
                  padding: '0.5rem 1rem',
                  fontFamily: 'var(--nextra-font-family-mono, monospace)',
                  fontSize: '0.8125rem',
                }}
              >
                {prop.type}
              </td>
              <td
                style={{
                  padding: '0.5rem 1rem',
                  fontFamily: 'var(--nextra-font-family-mono, monospace)',
                  fontSize: '0.8125rem',
                }}
              >
                {prop.default ?? '—'}
              </td>
              <td style={{ padding: '0.5rem 1rem' }}>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
