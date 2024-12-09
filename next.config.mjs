import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
        locale: false
      }
    ]
  },
  webpack: config => {
    const __dirname = path.dirname(new URL(import.meta.url).pathname) // Get the directory of the current file

    config.resolve.alias['@'] = path.resolve(__dirname)

    return config
  }
}

export default nextConfig
