// /llms.txt: a plain-text map of the site for AI assistants, so they can
// find and cite the right page. Built from the same data as the rest of the site.
import type { APIContext } from 'astro';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { isoDate } from '../lib/dates';
import { href } from '../lib/paths';
import { getPosts, postPath } from '../lib/posts';

export async function GET(context: APIContext) {
	const url = (path: string) => new URL(href(path), context.site).toString();
	const posts = (await getPosts()).filter((post) => !post.data.draft);

	const lines = [
		`# ${profile.displayName}`,
		'',
		`> ${profile.description}`,
		'',
		'## Pages',
		'',
		`- [Home](${url('/')}): who I am and what I work on`,
		`- [Writing](${url('/writing/')}): articles and notes`,
		`- [Research](${url('/research/')}): research focus, projects and publications`,
		...(projects.length ? [`- [Projects](${url('/projects/')}): things I have built`] : []),
		`- [Repo](${url('/repo/')}): research software and source repositories`,
		`- [CV](${url('/cv/')}): experience, education and certifications`,
		'',
		'## Posts',
		'',
		...posts.map(
			(post) => `- [${post.data.title}](${url(postPath(post))}) (${isoDate(post.data.pubDate)}): ${post.data.description}`,
		),
		'',
		'## Citing',
		'',
		`Preferred citation: ${profile.citationName}. "Post title." ${url('/')} (year).`,
		'',
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
