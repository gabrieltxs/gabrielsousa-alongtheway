// The RSS feed at /rss.xml. Feed readers and newsletters tools pick up new posts from here.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { profile } from '../data/profile';
import { href } from '../lib/paths';
import { getPosts, postPath } from '../lib/posts';

export async function GET(context: APIContext) {
	const posts = await getPosts();
	return rss({
		title: profile.displayName,
		description: profile.description,
		site: new URL(href('/'), context.site).toString(),
		items: posts
			.filter((post) => !post.data.draft)
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				categories: post.data.tags,
				link: new URL(href(postPath(post)), context.site).toString(),
			})),
		customData: '<language>en</language>',
	});
}
