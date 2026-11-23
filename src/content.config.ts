import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every Markdown file in src/content/writing/ is a post.
// The fields below go at the top of each file, between the --- lines.
const writing = defineCollection({
	loader: glob({ base: './src/content/writing', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		// One or two sentences. Shown in lists, search results and link previews.
		description: z.string(),
		shortTitle: z.string().optional(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		// 'article' for long-form pieces, 'note' for short ones.
		kind: z.enum(['article', 'note']).default('article'),
		tags: z.array(z.string()).default([]),
		// Drafts are visible with `npm run dev` and left out of the published site.
		draft: z.boolean().default(false),
	}),
});

export const collections = { writing };
