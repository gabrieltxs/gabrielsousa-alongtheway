// Who you are. Everything on the site that describes you reads from this file.
// Source: your résumé (Applied AI Researcher version).

export const profile = {
	name: 'Gabriel Sousa',
	displayName: 'Gabriel Sousa, M.Sc.',

	// Family name first, for citations ("Sousa, Gabriel").
	citationName: 'Sousa, Gabriel',

	// How you describe yourself in one line.
	headline: 'Applied AI Research Scientist',

	// Current job.
	role: 'Senior Applied AI Scientist',
	employer: 'Deloitte',

	location: 'Goiânia, Brazil',

	// The one large sentence on the home page. Keep it to a line or two.
	statement: 'I research how language models learn a domain and its tasks, and build the experiments to test them, across pre-training, post-training, and serving.',

	// Shown under your name on the home page.
	tagline: 'Senior Applied AI Scientist at Deloitte. Goiânia, Brazil.',

	// Used in search results and link previews (aim for 120 to 160 characters).
	description:
		'Gabriel Sousa, M.Sc., is an applied AI research scientist working on domain-adaptive pre-training, post-training and alignment of language models.',

	// The "About" block on the home page. One string per paragraph; keep it short.
	about: [
		'I am a senior applied AI scientist at Deloitte, where I lead post-training and alignment research for a proprietary conversational AI system. Before that, I led Deloitte’s technical work on PetroNeMo, a Portuguese-language model for the oil and gas industry built with Petrobras and NVIDIA and presented at NVIDIA GTC 2025.',
		'My research spans the training stack: continued pre-training and data mixtures for specialized domains, the subject of my M.Sc. thesis at the Federal University of Goiás, and post-training with synthetic and preference data. With CEIA-UFG and CoreJur, I also study evidence selection, context compression and typed decision models for legal NLP.',
	],

	// Shown as a list on the Research page.
	interests: [
		'Domain-adaptive and continual pre-training: data mixtures, scaling laws and tokenizer adaptation',
		'Post-training and alignment (SFT, distillation, RLHF, DPO, GPO)',
		'Synthetic data and preference datasets',
		'Evaluation, grounding and robustness of language models',
		'Legal NLP: evidence selection, context compression and typed decision models',
		'Memory-augmented and agentic systems',
	],

	// Leave a value empty ('') to hide that link everywhere.
	//
	// The email is empty on purpose: this file is public once the site is
	// on GitHub, and whatever you type here is shown on every page.
	// Fill it in if you want people to write to you directly.
	email: '',
	links: {
		linkedin: 'https://www.linkedin.com/in/gabriel-sousa-xp/',
		lattes: 'http://lattes.cnpq.br/4244807184243359',
		github: 'https://github.com/gabrieltxs',
		scholar: '',
		orcid: '',
		huggingface: '',
		x: '',
	},

	// Put a PDF in public/ (for example public/cv.pdf) and set this to '/cv.pdf'
	// to show a download link on the CV page.
	cvPdf: '',
};

// Labels for the links above, in the order they are displayed.
export const linkLabels: Record<keyof typeof profile.links, string> = {
	scholar: 'Google Scholar',
	github: 'GitHub',
	huggingface: 'Hugging Face',
	linkedin: 'LinkedIn',
	lattes: 'Lattes',
	orcid: 'ORCID',
	x: 'X',
};

export function activeLinks(): { key: string; label: string; url: string }[] {
	return (Object.keys(linkLabels) as (keyof typeof profile.links)[])
		.filter((key) => profile.links[key])
		.map((key) => ({ key, label: linkLabels[key], url: profile.links[key] }));
}
