/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@neo/types'],
  async rewrites() {
    const apiUrl = process.env.API_INTERNAL_URL ?? 'http://127.0.0.1:5011'
    return [
      {
        source:      '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ]
  },
}

export default config
