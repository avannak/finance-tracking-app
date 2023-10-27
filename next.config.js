/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image support
  images: {
    domains: ["thispersondoesnotexist.com", "lh3.googleusercontent.com"], // Add the domains where images are hosted
  },
};

module.exports = nextConfig;
