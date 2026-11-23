// Your publications. Add one object per paper, thesis, preprint or talk.
// The Research page groups them by year; entries with `selected: true`
// also appear on the home page.
//
// Your Lattes CV is the quickest place to copy these from.

export type PublicationType = 'journal' | 'conference' | 'workshop' | 'preprint' | 'thesis' | 'talk';

export interface Publication {
	title: string;
	// Authors in publication order, exactly as printed.
	authors: string[];
	// Where it appeared: "PROPOR 2026", "arXiv", "M.Sc. dissertation, UFG"...
	venue: string;
	year: number;
	type: PublicationType;
	// One sentence in plain language: what the work shows and why it matters.
	summary?: string;
	selected?: boolean;
	// Main link for the title (publisher page, arXiv, DOI).
	url?: string;
	links?: {
		pdf?: string;
		arxiv?: string;
		doi?: string;
		code?: string;
		data?: string;
		slides?: string;
		video?: string;
	};
	// Paste the BibTeX entry here to show a "Copy BibTeX" button.
	bibtex?: string;
}

export const publications: Publication[] = [
	// Your résumé mentions a first-author, peer-reviewed conference paper (2020)
	// on lexical and syntactic validation of electrical-circuit connectivity
	// lists. Add it here with its exact title, co-authors and venue.
	//
	// Template (delete the two slashes at the start of each line and edit):
	//
	// {
	// 	title: 'Title of the paper',
	// 	authors: ['Gabriel Sousa', 'Second Author', 'Third Author'],
	// 	venue: 'Conference or journal name',
	// 	year: 2025,
	// 	type: 'conference',
	// 	summary: 'One sentence on what you found.',
	// 	selected: true,
	// 	url: 'https://doi.org/...',
	// 	links: {
	// 		pdf: 'https://...',
	// 		code: 'https://github.com/...',
	// 	},
	// 	bibtex: `@inproceedings{sousa2025title,
	//   title = {Title of the paper},
	//   author = {Sousa, Gabriel and Author, Second and Author, Third},
	//   booktitle = {Conference name},
	//   year = {2025}
	// }`,
	// },
];

export const typeLabels: Record<PublicationType, string> = {
	journal: 'Journal article',
	conference: 'Conference paper',
	workshop: 'Workshop paper',
	preprint: 'Preprint',
	thesis: 'Thesis',
	talk: 'Talk',
};
