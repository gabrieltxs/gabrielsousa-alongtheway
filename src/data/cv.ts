// Your CV. The CV page, the home page and the search-engine metadata read from here.
// Source: your résumé (Applied AI Researcher version).
//
// Dates are 'YYYY' or 'YYYY-MM'. Leave `end` empty ('') for "present".

export const summary = [
	'Applied AI research scientist (M.Sc.) working across the language-model training stack, from domain-adaptive pre-training to post-training and alignment. My research covers continued pre-training for specialized domains, data curation and synthetic data, grounding and evaluation methodology, and I carry it from experimental design through large-scale training to deployed systems.',
	"At Deloitte I lead post-training and alignment research for a proprietary conversational AI system. Before that, I led Deloitte's technical work on the Petrobras–NVIDIA initiative behind PetroNeMo, the largest Brazilian language model specialized in oil and gas, presented at NVIDIA GTC 2025. There I drove the domain-adaptation research: corpus curation, tokenizer adaptation, continued pre-training and evaluation.",
	'I work hands-on throughout: forming hypotheses and running ablations, distributed training on HPC clusters with PyTorch and NVIDIA NeMo, and rigorous evaluation of domain-specific models in regulated environments.',
];

// Basic obfuscation for click-to-reveal contact; not a secret or access control.
export const contactEmailEncoded = 'Z2FicmllbHRlaXhlaXJhc291c2FAZ21haWwuY29t';

export interface Link {
	label: string;
	url: string;
}

export interface Position {
	title: string;
	organisation: string;
	location?: string;
	start: string;
	end: string;
	// What you did and what came of it.
	highlights?: string[];
	links?: Link[];
}

export interface Degree {
	degree: string;
	institution: string;
	start: string;
	end: string;
	// Focus, thesis or dissertation title, advisor: anything worth a line.
	notes?: string[];
}

export interface Award {
	title: string;
	issuer: string;
	date: string;
}

export interface Certification {
	name: string;
	url?: string;
	shortTitle?: string;
	summary?: string;
	// Date added to the site; does not imply the credential's issue date.
	addedDate?: string;
	image?: string;
	imageAlt?: string;
}

export const experience: Position[] = [
	{
		title: 'Senior Applied AI Scientist',
		organisation: 'Deloitte',
		location: 'Goiânia, Brazil',
		start: '2025-07',
		end: '',
		highlights: [
			'Lead post-training and alignment for a proprietary conversational AI system: supervised fine-tuning and frontier-model distillation with NVIDIA NeMo 2.0, followed by reinforcement-learning alignment with NeMo RL and GPO-style policy optimization to improve quality and safety.',
			'Designed multi-stage synthetic-data pipelines that combine RAG with large-scale HPC inference to generate reasoning and instruction data for specialized enterprise tasks.',
			'Fine-tuned a 70B reasoning model that outperformed GPT-4o on specialized internal writing benchmarks for client-facing tasks.',
			'Designed and built the Model Alignment Center (CAM), a Streamlit application for model-arena A/B testing, feedback collection, data curation and preference-dataset preparation.',
		],
	},
	{
		title: 'Applied AI Scientist II',
		organisation: 'Deloitte',
		location: 'Goiânia, Brazil',
		start: '2024-11',
		end: '2025-06',
		highlights: [
			'Led Deloitte’s technical delivery of PetroNeMo, Petrobras’s domain-adapted language model, with NVIDIA researchers and solution architects; the results were presented at NVIDIA GTC 2025.',
			'Directed the design, training and deployment of the Portuguese-language model, including tokenizer adaptation, domain-adaptive pre-training and evaluation.',
			'Built data-curation pipelines for billions of tokens with NVIDIA NeMo Curator and GPU-accelerated components, feeding distributed training and evaluation on Brazilian HPC clusters.',
			'Patched framework-level issues in legacy HPC environments and built a containerized cross-node inference solution for models larger than a single node’s memory.',
			'Served as the main technical liaison between Petrobras, Deloitte and NVIDIA, and designed an evaluation suite for task accuracy, groundedness and conversational robustness.',
		],
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
		title: 'Applied AI Scientist I',
		organisation: 'Deloitte',
		location: 'Goiânia, Brazil',
		start: '2024-03',
		end: '2024-10',
		highlights: [
			'Delivered three enterprise agentic RAG systems for Petrobras: HR goal generation, safety recommendations and SQL-based access to real-time data.',
			'Designed multi-agent orchestration on Azure AI (Prompt Flow, Azure Functions, Azure AI Search) with grounded retrieval, content safety and prompt shielding.',
			'Built qualitative and quantitative evaluation workflows for groundedness, traceability, answer quality and conversational robustness before rollout.',
		],
	},
	{
		title: 'Earlier roles in data, AI and software',
		organisation: 'IndustryCare, Lymx Spa and TOTVS Brasil Central',
		location: 'Goiânia, Brazil',
		start: '2019',
		end: '2023',
		highlights: [
			'Developed data and AI solutions for Industry 4.0 clients: ETL pipelines, feature engineering, supervised and unsupervised models, and predictive analytics.',
			'Improved operational reliability by refactoring database routines, troubleshooting .NET workflows, and supporting server migration and production.',
			'Customized ERP workflows and reports for procurement, inventory, billing and finance.',
		],
	},
];

export const education: Degree[] = [
	{
		degree: 'M.Sc. in Computer Science',
		institution: 'Federal University of Goiás (UFG)',
		start: '2024',
		end: '2026',
		notes: [
			'Focus: intelligent systems, large language models and NLP.',
			'Thesis: Industrial Scaling Laws for Continual Pre-Training: Optimizing Intra-Domain Mixtures.',
		],
	},
	{
		degree: 'B.S. in Computer Engineering',
		institution: 'Pontifical Catholic University of Goiás (PUC Goiás)',
		start: '2017',
		end: '2022',
		notes: ['Capstone: predicting antimicrobial resistance in Pseudomonas aeruginosa with machine learning.'],
	},
	// Listed on your LinkedIn but not on your résumé. Remove the slashes to show it.
	// {
	// 	degree: 'Graduate specialisation (lato sensu) in Databases with Big Data',
	// 	institution: 'Universidade Federal de Goiás (UFG)',
	// 	start: '2023',
	// 	end: '2025',
	// },
];

export const awards: Award[] = [
	{ title: 'Champion, Data Science Challenge', issuer: 'PUC Goiás', date: '2022' },
	{ title: 'Champion, Calculus Olympiad', issuer: 'PUC Goiás', date: '2018' },
	{ title: 'Third place, Programming Marathon', issuer: 'PUC Goiás', date: '2018' },
	// Listed on your LinkedIn but not on your résumé. Remove the slashes to show them.
	// { title: 'Champion, VII University Chemistry Olympiad', issuer: 'PUC Goiás', date: '2022-10' },
	// { title: 'Second place, Calculus II Olympiad', issuer: 'PUC Goiás', date: '2019-10' },
];

export const certifications: Certification[] = [
	{
		name: 'NVIDIA Certified Professional: Gen AI LLMs',
		shortTitle: 'NVIDIA LLMs',
		summary: 'Professional-level NVIDIA certification in generative AI and large language models.',
		url: 'https://www.credly.com/badges/23760ae2-c9c6-4bee-ab0a-7acb5b72d0af/public_url',
		image: '/images/certifications/nvidia-professional-llms.png',
		imageAlt: 'NVIDIA Certified Professional Generative AI LLMs badge',
	},
	{
		name: 'NVIDIA Certified Associate: Gen AI LLMs',
		url: 'https://www.credly.com/badges/93f1b401-ed6f-415c-bbb3-48f7a82d3be9/public_url',
		image: '/images/certifications/nvidia-associate-llms.png',
		imageAlt: 'NVIDIA Certified Associate Generative AI LLMs badge',
	},
	{
		name: 'NVIDIA Certified Associate: Gen AI Multimodal',
		url: 'https://www.credly.com/badges/cb16bd6f-1903-48eb-a9db-3d9f947417a1/public_url',
		image: '/images/certifications/nvidia-associate-multimodal.png',
		imageAlt: 'NVIDIA Certified Associate Generative AI Multimodal badge',
	},
	{
		name: 'FIAP: Cloud Fundamentals, Administration and Solution Architect',
		image: '/images/certifications/fiap.svg',
		imageAlt: 'FIAP issuer logo',
	},
	{
		name: 'Microsoft PL-900: Power Platform Fundamentals',
		image: '/images/certifications/microsoft-fundamentals.svg',
		imageAlt: 'Microsoft Certified Fundamentals badge',
	},
	{
		name: 'IBM: Machine Learning with Python',
		image: '/images/certifications/ibm-machine-learning-python.png',
		imageAlt: 'IBM Machine Learning with Python course badge',
	},
];

export const languages: { name: string; level: string; url?: string; image?: string; imageAlt?: string }[] = [
	{ name: 'Portuguese', level: 'native' },
	{
		name: 'English',
		level: 'C1',
		url: 'https://certs.duolingo.com/10m3pg2k0nxuoegy',
		image: '/images/certifications/duolingo-english-test.png',
		imageAlt: 'Duolingo English Test icon',
	},
];

// What you work with, by area. Shown on the CV page.
export const skills: { area: string; items: string }[] = [
	{
		area: 'Foundation models',
		items:
			'Domain-adaptive and continual pre-training, data mixtures and scaling laws, tokenizer adaptation, supervised fine-tuning, distillation, reinforcement-learning alignment (RLHF, DPO, GPO), synthetic and preference data, RAG, evaluation and agentic systems',
	},
	{
		area: 'ML engineering',
		items:
			'Python, PyTorch, NVIDIA NeMo, NeMo Curator, NeMo RL, CUDA, Slurm, distributed training, Docker, Apptainer, Azure AI, vector search and A/B testing',
	},
];
