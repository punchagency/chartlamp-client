/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "chartlamp.s3.amazonaws.com",
      "punch-sales-app.s3.amazonaws.com",
      "chartlamp.s3.us-east-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
