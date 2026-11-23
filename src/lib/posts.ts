import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'writing'>;

// Published posts, newest first. Drafts show up while you run `npm run dev`
// and are left out of the built site.
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('writing', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postPath(post: Post): string {
	return `/writing/${post.id}/`;
}

// Minutes to read, at about 230 words a minute.
export function readingTime(post: Post): number {
	const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 230));
}

export function tagSlug(tag: string): string {
	return tag
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

// Every tag in use, most used first.
export function collectTags(posts: Post[]): { tag: string; slug: string; count: number }[] {
	const counts = new Map<string, { tag: string; count: number }>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			const slug = tagSlug(tag);
			const entry = counts.get(slug) ?? { tag, count: 0 };
			entry.count += 1;
			counts.set(slug, entry);
		}
	}
	return [...counts.entries()]
		.map(([slug, { tag, count }]) => ({ tag, slug, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function groupByYear<T>(items: T[], yearOf: (item: T) => number): { year: number; items: T[] }[] {
	const groups = new Map<number, T[]>();
	for (const item of items) {
		const year = yearOf(item);
		groups.set(year, [...(groups.get(year) ?? []), item]);
	}
	return [...groups.entries()].sort((a, b) => b[0] - a[0]).map(([year, items]) => ({ year, items }));
}
