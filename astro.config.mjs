// @ts-check
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// Public address of the site.
// - GitHub Pages: filled in automatically by .github/workflows/deploy.yml.
// - Any other host: set SITE_URL in the host's build settings,
//   or replace the fallback below with your domain.
const SITE_URL = process.env.SITE_URL || 'https://example.com';

// Only needed when the site lives in a sub-folder (https://user.github.io/repo/).
// The GitHub Pages workflow sets it for you; leave it alone otherwise.
const BASE_PATH = process.env.BASE_PATH || undefined;

// Unicode ranges of the two subsets shipped for each font (same split Google Fonts uses).
const LATIN =
	'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT =
	'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

const fontDir = './src/assets/fonts';

// Lets posts link to other pages as /writing/... even when the site is
// served from a sub-folder: the folder is added to those links at build time.
function rehypeBasePath() {
	const base = (BASE_PATH || '').replace(/\/$/, '');
	/** @param {any} node */
	const visit = (node) => {
		// Markdown figures written as HTML remain raw nodes in this processor.
		if (node.type === 'raw' && typeof node.value === 'string') {
			node.value = node.value.replace(/(\s(?:href|src)\s*=\s*)(["'])\/(?!\/)/gi,
				(_match, attribute, quote) => `${attribute}${quote}${base}/`);
		}
		if (node.type === 'element' && node.properties) {
			for (const attr of ['href', 'src']) {
				const value = node.properties[attr];
				if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
					node.properties[attr] = base + value;
				}
			}
		}
		if (Array.isArray(node.children)) node.children.forEach(visit);
	};
	/** @param {any} tree */
	return (tree) => {
		if (base) visit(tree);
	};
}

export default defineConfig({
	site: SITE_URL,
	base: BASE_PATH,
	trailingSlash: 'always',
	integrations: [sitemap()],
	markdown: {
		// Posts are processed with Astro's "unified" Markdown processor, which
		// runs the remark/rehype plugins that typeset maths:
		// $inline$ and $$block$$ LaTeX is rendered with KaTeX when the site is built.
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex, rehypeBasePath],
		}),
		// Code blocks carry both colour themes; global.css picks one.
		shikiConfig: {
			themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
			defaultColor: false,
		},
	},
	// Fonts are self-hosted from src/assets/fonts (all SIL Open Font License).
	// Newsreader carries the "voice" (statement, titles, post text);
	// Geist carries everything else; Geist Mono is for code.
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Newsreader',
			cssVariable: '--font-newsreader',
			fallbacks: ['Georgia', 'Times New Roman', 'serif'],
			options: {
				variants: [
					{ src: [`${fontDir}/newsreader-latin-opsz-normal.woff2`], weight: '200 800', style: 'normal', display: 'swap', unicodeRange: [LATIN] },
					{ src: [`${fontDir}/newsreader-latin-ext-opsz-normal.woff2`], weight: '200 800', style: 'normal', display: 'swap', unicodeRange: [LATIN_EXT] },
					{ src: [`${fontDir}/newsreader-latin-opsz-italic.woff2`], weight: '200 800', style: 'italic', display: 'swap', unicodeRange: [LATIN] },
					{ src: [`${fontDir}/newsreader-latin-ext-opsz-italic.woff2`], weight: '200 800', style: 'italic', display: 'swap', unicodeRange: [LATIN_EXT] },
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'Geist',
			cssVariable: '--font-geist',
			fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
			options: {
				variants: [
					{ src: [`${fontDir}/geist-latin-wght-normal.woff2`], weight: '100 900', style: 'normal', display: 'swap', unicodeRange: [LATIN] },
					{ src: [`${fontDir}/geist-latin-ext-wght-normal.woff2`], weight: '100 900', style: 'normal', display: 'swap', unicodeRange: [LATIN_EXT] },
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'Geist Mono',
			cssVariable: '--font-geist-mono',
			fallbacks: ['Menlo', 'Consolas', 'monospace'],
			options: {
				variants: [
					{ src: [`${fontDir}/geist-mono-latin-wght-normal.woff2`], weight: '100 900', style: 'normal', display: 'swap' },
				],
			},
		},
	],
});
