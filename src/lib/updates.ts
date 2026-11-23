import type { Certification } from '../data/cv';
import type { NewsItem } from '../data/news';
import type { Project } from '../data/projects';
import type { Post } from './posts';

export interface Update {
	title: string;
	shortTitle?: string;
	summary: string;
	url: string;
	category: string;
	date?: string;
	dateLabel?: string;
	image?: string;
	imageAlt?: string;
	cta: string;
}

export function collectUpdates(
	posts: Post[], news: NewsItem[], projects: Project[], certifications: Certification[], limit = 5,
): Update[] {
	const catalog: Update[] = [
		...projects.map((project) => ({
			title: project.name,
			shortTitle: project.shortTitle,
			summary: project.tagline,
			url: `/projects/#project-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
			category: 'Project',
			date: project.addedDate,
			dateLabel: 'Added',
			image: project.image,
			imageAlt: project.imageAlt,
			cta: 'View project',
		})),
		...certifications.map((certification) => ({
			title: certification.name,
			shortTitle: certification.shortTitle,
			summary: certification.summary ?? 'A credential from my professional learning and development. Explore the details and certification record.',
			url: certification.url ?? '/cv/#section-certifications',
			category: 'Certification',
			date: certification.addedDate,
			dateLabel: 'Added',
			image: certification.image,
			imageAlt: certification.imageAlt,
			cta: certification.url ? 'View credential' : 'View certifications',
		})),
	];
	const updates: Update[] = [
		...posts.filter((post) => !post.data.draft).map((post) => ({
			title: post.data.title,
			shortTitle: post.data.shortTitle,
			summary: post.data.description,
			url: `/writing/${post.id}/`,
			category: 'Post',
			date: (post.data.updatedDate ?? post.data.pubDate).toISOString().slice(0, 10),
			dateLabel: post.data.updatedDate ? 'Updated' : 'Published',
			image: post.data.image,
			imageAlt: post.data.imageAlt,
			cta: 'Read post',
		})),
		...news.map((item) => ({
			title: item.title ?? item.text,
			shortTitle: item.shortTitle,
			summary: item.text,
			url: item.link?.url ?? '/writing/',
			category: item.category ?? 'Update',
			date: item.date,
			image: item.image,
			imageAlt: item.imageAlt,
			cta: item.link?.label ?? 'Explore writing',
		})),
		...catalog.filter((item) => item.date),
	];
	// Keep one existing project and credential discoverable without inventing dates.
	for (const category of ['Project', 'Certification']) {
		const undated = catalog.find((item) => item.category === category && !item.date);
		if (undated) updates.push(undated);
	}
	return updates.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, limit);
}
