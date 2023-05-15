/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './public',
  },
};
 
module.exports = nextConfig;