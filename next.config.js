/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image support
  images: {
    domains: ["thispersondoesnotexist.com", "lh3.googleusercontent.com"], // Add the domains where your images are hosted
  },
};

module.exports = nextConfig;
