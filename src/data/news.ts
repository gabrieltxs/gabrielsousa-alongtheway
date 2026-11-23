// Dated announcements for the home updates banner: evaluations, talks,
// awards or other news. Posts, projects and certifications are added separately.

export interface NewsItem {
	// 'YYYY-MM-DD'
	date: string;
	text: string;
	title?: string;
	shortTitle?: string;
	category?: string;
	image?: string;
	imageAlt?: string;
	// Optional link shown after the text.
	link?: { label: string; url: string };
}

export const news: NewsItem[] = [
	// Uncomment an entry to include it in the latest updates banner.
	//
	// {
	// 	date: '2025-07-01',
	// 	text: 'Started as Senior Applied AI Scientist at Deloitte, leading post-training and alignment for a conversational AI system.',
	// },
	// {
	// 	date: '2025-03-20',
	// 	text: 'PetroNeMo, the language model for oil and gas that I helped build for Petrobras with NVIDIA, was presented at NVIDIA GTC 2025.',
	// 	link: { label: 'Session page', url: 'https://www.nvidia.com/en-us/on-demand/session/gtc25-s73150/' },
	// },
	//
	// Template:
	//
	// {
	// 	date: '2026-12-01',
	// 	text: 'Our paper on ... was accepted at ...',
	// 	link: { label: 'Read the paper', url: 'https://...' },
	// },
];
