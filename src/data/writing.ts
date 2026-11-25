// Every post belongs to exactly one editorial category; keywords remain cross-cutting.
export const categoryIds = ['research-notes', 'experiments', 'builds', 'engineering-notes', 'milestones'] as const;
export const writingCategories = [
	{ id: categoryIds[0], title: 'Research Notes', description: 'Literature, ideas and open questions. Research as it develops.', icon: 'M4 5h6l2 2 2-2h6v15h-6l-2 2-2-2H4zM12 7v15M7 9h2M15 9h2M7 13h2M15 13h2', hue: 190 },
	{ id: categoryIds[1], title: 'Experiments', description: 'Hypotheses, experimental design and what the results tell us.', icon: 'M9 3h6M10 3v7L4 20q-1 2 2 2h12q3 0 2-2l-6-10V3M7 16h10M10 19h1', hue: 38 },
	{ id: categoryIds[2], title: 'Builds', description: 'Tools, code and pipelines. From an idea to a working repository.', icon: 'M7 7l-5 5 5 5M17 7l5 5-5 5M14 4l-4 16', hue: 160 },
	{ id: categoryIds[3], title: 'Engineering Notes', description: 'Environments, infrastructure and deployment. Making systems work.', icon: 'M5 17a4 4 0 0 1-1-8 7 7 0 0 1 13-2 5 5 0 0 1 2 10M12 12v10M8 18l4 4 4-4', hue: 212 },
	{ id: categoryIds[4], title: 'Milestones', description: 'Defenses, talks, publications and moments along the way.', icon: 'M4 3v19M4 4h15l-3 5 3 5H4M8 22H1', hue: 280 },
];
export const categoryPath = (id: string) => `/writing/category/${id}/`;
