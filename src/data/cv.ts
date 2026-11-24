// Your CV. The CV page, the home page and the search-engine metadata read from here.
// Source: Gabriel_Sousa_Resume_EN_20262.pdf, supplied on 24 November 2026.
//
// Dates are 'YYYY' or 'YYYY-MM'. Leave `end` empty ('') for "present".

export const summary = [
	"Applied AI research scientist (M.Sc.) with hands-on experience across the language-model training stack: domain-adaptive pre-training, post-training, alignment and retrieval. At Deloitte, technical lead for PetroNeMo, the largest Brazilian language model specialized in oil and gas (Petrobras and NVIDIA, presented at NVIDIA GTC 2025), with the work now expanded to manufacturing-industry clients and Deloitte internal processes. Expertise in agentic tool-use distillation, reasoning models, DPO alignment and knowledge-graph RAG; researcher in legal NLP and System-One models at CEIA-UFG.",
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
	links?: Link[];
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
		title: "Senior Applied AI Scientist",
		organisation: "Deloitte",
		location: "Goiânia, Brazil",
		start: "2025-07",
		end: "",
		highlights: [
			"Continue to lead the technical work on PetroNeMo with Petrobras and NVIDIA; the work has since expanded to manufacturing-industry clients and Deloitte internal processes.",
			"Lead post-training and alignment of domain-specialized models on NVIDIA NeMo: supervised fine-tuning (SFT), frontier-model distillation and DPO on NeMo RL.",
			"Built agentic tool-use distillation pipelines from the reasoning and tool-calling trajectories of frontier models, plus synthetic-data pipelines combining RAG with large-scale HPC inference.",
			"Trained open-weight models of 3B, 8B, 30B, 70B and 120B parameters, including a reasoning model with agentic capability; models of 70B and above outperformed state-of-the-art models on the internal benchmark.",
			"Designed the reference-data annotation process for RLAIF in DPO, with human supervision and intervention.",
			"Built the Model Alignment Center (CAM), a Streamlit platform for model-arena A/B testing, feedback collection and preference-dataset preparation.",
			"Led high-level design of RAG architectures on massive knowledge graphs, with embedding and reranking models, optimized for deployment on AWS compute instances.",
		],
		links: [
			{
				label: "Talk: PetroNeMo at SPE Workshop: Digital Transformation 2026",
				url: "https://lnkd.in/p/dMPyuNTN",
			},
			{
				label: "Deloitte Tracking the Trends 2026",
				url: "https://www.deloitte.com/content/dam/assets-shared/docs/industries/energy-resources-industrials/2026/tracking-the-trends-2026.pdf",
			},
			{
				label: "Gartner CIO Conference Brazil 2026",
				url: "https://www.gartner.com/en/conferences/la/cio-brazil/sessions/detail/5969363-Executive-Story-QA-Petrobras-Petronemo--Generative-AI-for-Excellence-in-Industrial-Maintenance",
			},
			{
				label: "IT Forum 100+ Inovadoras",
				url: "https://acervo.maven.com.br/neoflip/pub/itmidia/leitor?ed=26c7cc8d05a0dc19cfc07baa975877f1#page/64",
			},
			{
				label: "Forbes Tech",
				url: "https://forbes.com.br/forbes-tech/2026/09/o-que-esperar-do-futuro-da-ia/",
			},
			{
				label: "TI Inside",
				url: "https://tiinside.com.br/02/09/2026/pessoas-processos-e-dados-sao-cruciais-para-sucesso-da-ia-afirma-cio-da-petrobras/",
			},
		],
	},
	{
		title: "Applied AI Scientist II",
		organisation: "Deloitte",
		location: "Goiânia, Brazil",
		start: "2024-11",
		end: "2025-06",
		highlights: [
			"Led Deloitte’s technical delivery of PetroNeMo, Petrobras’s Portuguese-language model for oil and gas, with NVIDIA researchers and solution architects; presented at NVIDIA GTC 2025.",
			"Built NVIDIA NeMo Curator pipelines over billions of tokens and directed tokenizer adaptation, domain-adaptive pre-training and evaluation on Brazilian HPC clusters.",
			"Resolved framework-level issues in legacy HPC environments and built a containerized cross-node inference solution for models larger than a single node’s memory.",
			"Served as main technical liaison between Petrobras, Deloitte and NVIDIA; designed the evaluation suite for accuracy, groundedness and robustness.",
		],
		links: [
			{
				label: "NVIDIA GTC 2025 session",
				url: "https://www.nvidia.com/en-us/on-demand/session/gtc25-s73150/",
			},
			{
				label: "Valor Econômico",
				url: "https://valor.globo.com/empresas/noticia/2025/03/21/petrobras-cria-ia-para-acelerar-manutencao-de-plataformas.ghtml",
			},
			{
				label: "Exame",
				url: "https://exame.com/carreira/empresas-fronteira-o-novo-modelo-de-trabalho-impulsionado-por-ia-que-vai-mudar-sua-carreira/",
			},
			{
				label: "Deloitte case study",
				url: "https://www.deloitte.com/br/pt/services/consulting/perspectives/petrobras-inovacao-eficiencia.html",
			},
		],
	},
	{
		title: "Applied AI Scientist I",
		organisation: "Deloitte",
		location: "Goiânia, Brazil",
		start: "2024-03",
		end: "2024-10",
		highlights: [
			"Delivered three agentic RAG systems for Petrobras (HR goals, safety recommendations, real-time data through SQL) with multi-agent orchestration on Azure AI.",
			"Implemented grounded retrieval, content safety and prompt shielding, validated by evaluations of groundedness, traceability and robustness.",
		],
	},
	{
		title: "Earlier experience in data, AI and software",
		organisation: "IndustryCare, Lymx Spa, TOTVS Brasil Central",
		location: "Goiânia, Brazil",
		start: "2019",
		end: "2023",
		highlights: [
			"Built ETL pipelines, feature engineering and predictive models for Industry 4.0 clients.",
			"Optimized database routines and .NET workflows, supported server migrations and customized ERP reports.",
		],
	},
];

// CV-specific research history follows the supplied résumé.
export const researchExperience: Position[] = [
	{
		title: "AI Researcher (LLM Researcher)",
		organisation: "CEIA-UFG, UFG and CoreJur",
		start: "2024",
		end: "",
		highlights: [
			"Research legal NLP in the project Automatic Generation of Legal Texts Using Natural Language Generation Models, focusing on System-One (typed decision) models as a decision layer between retrieval and generation in long documents: evidence selection and reranking, proof scope, reading sufficiency, context compression, typed decisions, calibration and reliability.",
			"Train System-One and small language models for legal tasks, targeting state-of-the-art accuracy at lower operating cost, and develop the end-to-end legal-AI pipeline, from document collection and synthetic data to preference datasets for DPO and agentic, memory-augmented workflows.",
		],
		links: [
			{
				label: "Write-ups and experiments",
				url: "/writing/",
			},
		],
	},
];

export const education: Degree[] = [
	{
		degree: "M.Sc. in Computer Science",
		institution: "Federal University of Goiás (UFG)",
		start: "2024",
		end: "2026",
		notes: [
			"Thesis: Industrial Scaling Laws for Continual Pre-Training: Optimizing Intra-Domain Mixtures (approved May 2026).",
			"Advisor: Prof. Arlindo Rodrigues Galvão Filho.",
		],
	},
	{
		degree: "B.S. in Computer Engineering",
		institution: "Pontifical Catholic University of Goiás (PUC Goiás)",
		start: "2017",
		end: "2022",
		notes: [
			"Capstone: machine-learning prediction of antimicrobial resistance in Pseudomonas aeruginosa.",
			"Undergraduate research (2020): parser for an electrical-circuit language in a hydroelectric plant digital twin; first author of a peer-reviewed paper.",
		],
	},
];

export const awards: Award[] = [
	{
		title: "Third place, Gartner Eye on Innovation Awards for Oil & Gas — PetroNeMo",
		issuer: "Gartner",
		date: "2026",
		links: [
			{
				label: "Gartner award",
				url: "https://www.gartner.com/en/documents/8449313",
			},
			{
				label: "Announcement",
				url: "https://lnkd.in/p/dkfRTR4D",
			},
		],
	},
	{
		title: "Champion, Data Science Challenge",
		issuer: "PUC Goiás",
		date: "2022",
	},
	{
		title: "Champion, Calculus Olympiad",
		issuer: "PUC Goiás",
		date: "2018",
	},
	{
		title: "Third place, Programming Marathon",
		issuer: "PUC Goiás",
		date: "2018",
	},
];

export const certifications: Certification[] = [
	{
		name: 'NVIDIA Certified Professional: Generative AI LLMs',
		shortTitle: 'NVIDIA LLMs',
		summary: 'Professional-level NVIDIA certification in generative AI and large language models.',
		url: 'https://www.credly.com/badges/23760ae2-c9c6-4bee-ab0a-7acb5b72d0af/public_url',
		image: '/images/certifications/nvidia-professional-llms.png',
		imageAlt: 'NVIDIA Certified Professional Generative AI LLMs badge',
	},
	{
		name: 'NVIDIA Certified Associate: Generative AI LLMs',
		url: 'https://www.credly.com/badges/93f1b401-ed6f-415c-bbb3-48f7a82d3be9/public_url',
		image: '/images/certifications/nvidia-associate-llms.png',
		imageAlt: 'NVIDIA Certified Associate Generative AI LLMs badge',
	},
	{
		name: 'NVIDIA Certified Associate: Generative AI Multimodal',
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
		area: "LLM training",
		items: "Supervised fine-tuning (SFT), frontier-model and agentic tool-use distillation, reasoning models, Direct Preference Optimization (DPO), RLAIF (reinforcement learning from AI feedback), human-in-the-loop annotation, domain-adaptive and continual pre-training, tokenizer adaptation, synthetic and preference data.",
	},
	{
		area: "Retrieval and agents",
		items: "Retrieval-augmented generation (RAG), knowledge graphs, embedding and reranking models, System-One (typed decision) models, context compression, tool calling, multi-agent systems.",
	},
	{
		area: "Engineering and evaluation",
		items: "Python, PyTorch, NVIDIA NeMo (NeMo 2.0, Curator, RL), CUDA, Slurm, distributed training on HPC, Docker, Apptainer, AWS, Azure AI, ChromaDB, CrewAI, Streamlit; benchmark design, model-arena A/B testing, groundedness and robustness evaluation.",
	},
];
