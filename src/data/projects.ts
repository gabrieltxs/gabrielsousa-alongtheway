// Things you built: applied projects, open-source code, datasets, demos.
// The "Projects" link appears in the menu as soon as this list has one entry.
// Source: your résumé (Applied AI Researcher version).
//
// For client work, say only what your employer and the client are happy
// to see in public.

import type { Link } from './cv';

export interface Project {
	name: string;
	shortTitle?: string;
	// Date added to the site, not the project's start date. Optional preview image.
	addedDate?: string;
	image?: string;
	imageAlt?: string;
	// One sentence, shown on the home page for featured projects.
	tagline: string;
	// Two or three sentences for the Projects page: the problem, what you built, what changed.
	summary: string;
	// Featured projects appear on the home page under "Selected work".
	featured?: boolean;
	// "2024", "2024 to 2025"...
	period: string;
	// Your part in it.
	role?: string;
	tags?: string[];
	links?: Link[];
}

export const projects: Project[] = [
	{
		name: 'PetroNeMo: a language model for the oil and gas industry',
		shortTitle: 'PetroNeMo',
		tagline: 'A Portuguese-language model specialized for Petrobras, built with NVIDIA and presented at GTC 2025.',
		featured: true,
		period: '2024 to 2025',
		role: 'Led Deloitte’s technical delivery, working with Petrobras and with NVIDIA researchers and solution architects',
		summary:
			'A Portuguese-language model adapted to Petrobras’s oil and gas domain. The work covered curation of billions of tokens with NVIDIA NeMo Curator, tokenizer adaptation, domain-adaptive pre-training on Brazilian HPC clusters, and an evaluation suite for task accuracy, groundedness and conversational robustness. Presented at NVIDIA GTC 2025.',
		tags: ['Domain-adaptive pre-training', 'Tokenizer adaptation', 'HPC', 'Evaluation'],
		links: [
			{ label: 'NVIDIA GTC 2025 session', url: 'https://www.nvidia.com/en-us/on-demand/session/gtc25-s73150/' },
			{
				label: 'Valor Econômico (PT)',
				url: 'https://valor.globo.com/empresas/noticia/2025/03/21/petrobras-cria-ia-para-acelerar-manutencao-de-plataformas.ghtml',
			},
			{
				label: 'Deloitte case study (PT)',
				url: 'https://www.deloitte.com/br/pt/services/consulting/perspectives/petrobras-inovacao-eficiencia.html',
			},
		],
	},
	{
		name: 'Post-training and alignment of a conversational AI system',
		tagline: 'Specializing a foundation model into a task-specific agent with fine-tuning, distillation and RL alignment.',
		featured: true,
		period: '2025 to present',
		role: 'Lead',
		summary:
			'Specializing a foundation model into a task-specific agent through supervised fine-tuning and frontier-model distillation with NVIDIA NeMo 2.0, then reinforcement-learning alignment with NeMo RL. Training data comes from multi-stage synthetic-data pipelines that combine RAG with large-scale HPC inference. A fine-tuned 70B reasoning model outperformed GPT-4o on specialized internal writing benchmarks.',
		tags: ['Post-training', 'RL alignment', 'Synthetic data', 'Distillation'],
	},
	{
		name: 'Model Alignment Center (CAM)',
		tagline: 'A model arena for A/B testing, feedback collection and preference-dataset preparation.',
		featured: true,
		period: '2025 to present',
		role: 'Design and development',
		summary:
			'A Streamlit application that keeps the alignment loop in one place: model-arena A/B testing, user-feedback collection, data curation, dataset transformation and preference-dataset preparation.',
		tags: ['Model arena', 'Preference datasets', 'Human feedback'],
	},
	{
		name: 'Agentic RAG systems for Petrobras',
		tagline: 'Three enterprise retrieval-augmented systems with multi-agent orchestration on Azure AI.',
		period: '2024',
		role: 'Design and delivery',
		summary:
			'Three enterprise retrieval-augmented systems for HR goal generation, safety recommendations and SQL-based access to real-time data. Multi-agent orchestration on Azure AI (Prompt Flow, Azure Functions, Azure AI Search) with grounded retrieval, content safety and prompt shielding, validated for groundedness, traceability and robustness before rollout.',
		tags: ['RAG', 'Agents', 'Azure AI', 'Evaluation'],
	},
];
