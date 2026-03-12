/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVIDO: output: 'export' (Vercel não precisa)
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig