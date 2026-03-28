import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
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

const navbar = (
  <Navbar
    logo={
      <span style={{ fontWeight: 700 }}>
        Emerald HUE
      </span>
    }
    projectLink="https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0"
  />
)

const footer = (
  <Footer>
    <span>
      © {new Date().getFullYear()} PETRONAS Digital Sdn Bhd. Emerald HUE
      Design System.
    </span>
  </Footer>
)

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap()

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        {/* Inline script to prevent theme flash */}
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
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/AmanSuryavanshi/emeraldhue-ui-react/tree/master/packages/docs"
          footer={footer}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          editLink="Edit this page"
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
