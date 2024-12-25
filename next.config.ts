import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "nginx_max_header_size",
						value: "51200", // 50KB
					},
				],
			},
		];
	},
};

export default nextConfig;
