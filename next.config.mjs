import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "picsum.photos",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "unicorn-bleak.s3.eu-central-1.amazonaws.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "3.76.77.2",
				port: "",
				pathname: "/**",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default withNextIntl(nextConfig);
