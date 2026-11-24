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
	statement: 'I research how language models learn a new domain and its tasks.',

	// Shown under your name on the home page.
	tagline: 'Senior Applied AI Scientist at Deloitte. Goiânia, Brazil.',

	// Used in search results and link previews (aim for 120 to 160 characters).
	description:
		'Gabriel Sousa, M.Sc., is an applied AI research scientist working on domain-adaptive pre-training, post-training and alignment of language models.',

	// The "About" block on the home page. One string per paragraph.
	about: [
		"Applied AI research scientist (M.Sc.) working across the language-model training stack: domain-adaptive pre-training, data curation and synthetic data, supervised fine-tuning, reinforcement-learning alignment, and evaluation of deployed systems in regulated environments.",
		"At {Deloitte}, I lead the technical work on {PetroNeMo}, the largest Brazilian language model specialized in oil and gas, built with {Petrobras and NVIDIA} and presented at {NVIDIA GTC 2025}. I have carried the model through the full training stack, solving challenges at every stage: corpus curation over billions of tokens, tokenizer adaptation and continued pre-training on Brazilian HPC clusters (including cluster-level optimization in legacy environments), followed by post-training and alignment with supervised fine-tuning, frontier-model distillation and reinforcement learning using NVIDIA NeMo, and inference acceleration for serving. The resulting domain-specialized reasoning models outperform state-of-the-art models on internal benchmarks.",
		"My {M.Sc. research} at the {Federal University of Goiás} studied industrial scaling laws for continual pre-training: how model scale, token exposure and intra-domain data mixtures interact, and how to allocate a training budget within a domain. With the {Center of Excellence in Artificial Intelligence} (CEIA-UFG) and CoreJur, I research legal NLP: evidence selection and context compression in long documents and typed decision models, testing novel techniques and validating their practical viability in the domain. There I train System-One and small language models that match state-of-the-art models in accuracy on the domain's tasks while reducing operating costs.",
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
