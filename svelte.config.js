import { readFileSync } from "fs";
import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const { subdirectory } = JSON.parse(readFileSync("package.json", "utf8"));
const dev = process.env.NODE_ENV !== "production";
const dir = subdirectory || "";
const prefix = dir.startsWith("/") ? "" : "/";
const base = dev || !dir ? "" : `${prefix}${dir}`;

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [autoprefixer]
	}
});

const config = {
	preprocess,
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: true
		}),
		paths: {
			base: dev ? '' : '/social-mobility'
		},
		prerender: {
			entries: ['*']
		},
		files: {
			assets: 'static'
		}
	},
	vitePlugin: {
		experimental: {
			inspector: { holdMode: true },
		}
	}
};

export default config;