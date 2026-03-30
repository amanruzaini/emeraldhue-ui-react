import { Head } from 'nextra/components'
import 'nextra-theme-docs/style.css'
import './globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'Emerald HUE',
    template: '%s — Emerald HUE',
  },
  description:
    'Emerald HUE (EH) design system — React component library for Petronas industrial environments.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('eh-theme') || 'theme-light';
                const textResize = localStorage.getItem('eh-text-resize') || 'text-resize-100';
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.setAttribute('data-text-resize', textResize);
              } catch (e) {}
            `,
          }}
        />
      </Head>
      <body>
        {children}
      </body>
    </html>
  )
}
