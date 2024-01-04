// eslint-disable-next-line @typescript-eslint/no-var-requires,unicorn/prefer-module
const withNextIntl = require("next-intl/plugin")("./i18n.ts");

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
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

// eslint-disable-next-line unicorn/prefer-module
module.exports = withNextIntl(nextConfig);
