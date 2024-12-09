import { readFileSync } from "fs";
import adapterStatic from "@sveltejs/adapter-static";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess({
		postcss: {
			plugins: [autoprefixer]
		}
	}),
	kit: {
		adapter: adapterStatic({
			pages: 'docs',
			assets: 'docs',
			fallback: 'index.html',
			strict: true
		}),
		paths: {
			base: '/social-mobility',
			relative: false
		},
		appDir: '_app',
		prerender: {
			entries: ['*'],
			handleHttpError: ({ path, referrer, message }) => {
				if (path.startsWith('/social-mobility/_app')) {
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;