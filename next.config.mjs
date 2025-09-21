/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.redseam.redberryinternship.ge",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
