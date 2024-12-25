import type { NextConfig } from "next";
import type { RuleSetRule } from "webpack";

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
	webpack(config) {
		const fileLoaderRule = config.module.rules.find((rule: RuleSetRule) => {
			if (typeof rule !== "object") return false;
			if (!rule.test) return false;
			return rule.test instanceof RegExp && rule.test.test(".svg");
		});

		if (!fileLoaderRule) {
			throw new Error("File loader rule not found");
		}

		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/,
			},
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				resourceQuery: { not: /url/ },
				use: ["@svgr/webpack"],
			},
		);

		fileLoaderRule.exclude = /\.svg$/i;

		return config;
	},
};

export default nextConfig;
