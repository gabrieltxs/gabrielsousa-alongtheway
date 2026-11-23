// Research projects you take part in. Shown on the Research and CV pages;
// the first entry also appears on the home page.
// Source: your résumé (Applied AI Researcher version).

import type { Link } from './cv';

export interface ResearchProject {
	// The project's name.
	title: string;
	// Your role in it.
	role: string;
	// Who it is with.
	organisations: string;
	start: string;
	end: string;
	// One sentence for the home page.
	summary: string;
	points: string[];
	links?: Link[];
}

export const researchProjects: ResearchProject[] = [
	{
		title: 'Industrial Scaling Laws for Continual Pre-Training: Optimizing Intra-Domain Mixtures',
		role: 'M.Sc. Researcher',
		organisations: 'Federal University of Goiás (UFG)',
		start: '2024',
		end: '2026',
		summary: 'How model scale, token budget and the mix of sources within an industrial domain shape continual pre-training.',
		points: [
			'Studied how data selection shapes the adaptation of language models to industrial domains, where technical manuals, standards and maintenance reports share a domain but differ in structure and content.',
			'Modeled the relationship between model scale, token exposure and source proportions during continual pre-training, to guide how a training budget is allocated within a domain.',
			'Thesis approved in May 2026; supervised by Prof. Arlindo Rodrigues Galvão Filho.',
		],
		links: [
			{ label: 'Defense post', url: '/writing/defesa-de-mestrado/' },
			{
				label: 'Defense announcement (PT)',
				url: 'https://ppgcc.inf.ufg.br/e/39024-399-defesa-de-dissertacao-de-mestrado-leis-de-escalonamento-industrial-em-continual-pre-training-otimizacao-de-misturas-intra-dominio',
			},
		],
	},
	{
		title: 'Automatic Generation of Legal Texts Using Natural Language Generation Models',
		role: 'AI Researcher',
		organisations: 'UFG, CEIA-UFG and CoreJur',
		start: '2024',
		end: '',
		summary:
			'Legal NLP: evidence selection, context compression and typed decisions for long legal documents, plus a pipeline from document collection to preference-based post-training.',
		points: [
			'Built an end-to-end pipeline for legal AI: targeted document collection, data preparation, synthetic instruction data and preference datasets for RL-based post-training.',
			'Study how to select, compress and verify evidence in long legal documents, comparing dense retrieval, reranking with decision models, context compression and full-context reading.',
			'Research hybrid memory architectures that combine model-internal knowledge with retrievable external memory to keep long legal texts consistent.',
			'Develop agentic and memory-augmented workflows with CrewAI, ChromaDB, Python and PyTorch, including reinforcement-learning experiments for legal-text generation.',
		],
		links: [
			{
				label: 'Project page at CEIA-UFG (PT)',
				url: 'https://ceia.ufg.br/geracao-automatica-de-textos-juridicos-utilizando-modelos-de-geradores-de-linguagem-natural/',
			},
			{ label: 'Posts on legal NLP', url: '/tags/legal-ai/' },
		],
	},
	{
		title: 'Predicting Antimicrobial Resistance in Pseudomonas aeruginosa with Machine Learning',
		role: 'Undergraduate Researcher',
		organisations: 'PUC Goiás',
		start: '2022',
		end: '2022',
		summary: 'Genome k-mer representations and six classifiers for resistance prediction across four antibiotics.',
		points: [
			'Represented whole genomes as k-mer frequency vectors (k = 5 to 9) and compared six classifiers on resistance to four antibiotics.',
			'Capstone thesis in Computer Engineering, approved in December 2022.',
		],
		links: [{ label: 'Retrospective post', url: '/writing/antimicrobial-resistance-machine-learning/' }],
	},
	{
		title: 'Digital Twin for a Hydroelectric Power Plant',
		role: 'Undergraduate Researcher',
		organisations: 'PUC Goiás',
		start: '2020',
		end: '2020',
		summary: 'A parser for the circuit language used to model plant assets in a digital twin.',
		points: [
			'Built a parser from scratch for a domain-specific electrical-circuit language used to model and simulate plant assets in a digital twin.',
			'First author of a peer-reviewed conference paper on lexical and syntactic validation of electrical-circuit connectivity lists.',
		],
	},
];
