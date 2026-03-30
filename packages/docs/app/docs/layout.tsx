import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import type { ReactNode } from 'react'

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

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap('/docs')

  return (
    <Layout
      navbar={navbar}
      footer={footer}
      pageMap={pageMap}
      docsRepositoryBase="https://github.com/AmanSuryavanshi/emeraldhue-ui-react/tree/master/packages/docs"
      sidebar={{ defaultMenuCollapseLevel: 1 }}
      editLink="Edit this page"
    >
      {children}
    </Layout>
  )
}
