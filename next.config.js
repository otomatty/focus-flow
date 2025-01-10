/** @type {import('next').NextConfig} */
const nextConfig = {
	// ... existing config ...
	experimental: {
		// ... other experimental options ...
		serverActions: {
			bodySizeLimit: "2mb",
		},
	},
	// Add fetch timeout
	serverRuntimeConfig: {
		fetchTimeout: 10000, // 10 seconds
		fetchRetry: 3,
	},
};

module.exports = nextConfig;
