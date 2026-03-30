import nextra from 'nextra'

const withNextra = nextra({
  // Nextra options
})

export default withNextra({
  // Regular Next.js config
  transpilePackages: ['@eh/tokens', '@eh/components'],
  output: 'export', // static export for easy deployment
})
