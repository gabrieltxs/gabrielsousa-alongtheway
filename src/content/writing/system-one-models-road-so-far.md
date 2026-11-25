---
category: research-notes
title: The Road So Far for System One Models
shortTitle: System One models
plain: "A review of 110 studies on small AI models that make one quick, well-defined decision, and of what is still unknown about them."
description: 'A review of 110 works on typed decision models: capabilities, calibration, reliability, training data, benchmarks, domain results, and the evaluation gaps that remain.'
pubDate: 2026-11-23
kind: article
tags: [System One Models, Decision Models, Machine Learning, Evaluation, Literature Review]
image: /images/system-one-review/primitive-coverage.png
imageAlt: 'Coverage of decision primitives in 97 core sources, with far more evidence for choice, noul and score than for set and span.'
---

System One models make a specific promise: give a model a state and a set of typed questions, and get back probabilities that software can turn straight into decisions. The early evidence points to large savings in latency and inference cost. It also exposes a harder problem: **a model can pick the right answer fairly often while being unreliable about its confidence, about how the question is worded, or about whether any valid answer exists at all**.

I reviewed **110 works** published between November 18, 2024 and **November 18, 2026**. The central finding is that capability and reliability have to be evaluated separately: matching a generative model's average accuracy is only part of the case for automating a decision.

This article covers the method, the model families, the five decision primitives, evaluation protocols, training recipes, benchmarks, domain results and a proposed research agenda.

<aside class="note">

**Scope of the evidence.** This is a literature synthesis, not a new benchmark. At the cutoff, all 97 sources directly about this model category were preprints or grey literature; the 13 peer-reviewed works concern adjacent tasks. I ran the review as a single reviewer with AI assistance, and reading depth varied from full texts to abstracts. Numbers below are findings reported by their authors, not a leaderboard or independently replicated measurements; check them against the original papers before citing. Codes in brackets, such as [B01], identify entries in the [full bibliography](/documents/system-one-literature-review.pdf).

</aside>

## What System One models promise

The category's public starting point is TypeSafe AI's announcement of **Jev** on September 15, 2026. The contract has three parts: the caller supplies an unstructured state, declares the questions and admissible answers at inference time, and receives probabilities over those answers. No text is generated, so a routing decision, policy check, relevance judgment or rubric score can be consumed directly by a program.

That changes the failure mode. A malformed answer is easy to reject; a well-formed probability that takes the wrong branch can pass silently through an application. Type validity guarantees the structure of the output, not that the chosen option is supported by the evidence or that a confidence of 0.9 means 90% correctness.

Early audits report median hosted latency of about **0.15–0.45 seconds**, and SO-Arena reports local latency below **0.3 seconds** for open models. These are measurements of particular configurations, not guarantees. The vendor's claims about calibrated decisions and its training method, Reinforcement Learning for Calibrated Decisions (**RLCD**), should also be kept apart from independently documented recipes: the reference model's data, architecture and reward details have not been disclosed.

## How the literature was assembled

Five questions organized the review: how these models are evaluated; where their training data come from; which datasets and benchmarks exist; what domain-specific evaluations reveal; and how well the literature covers the primitives `choice`, `noul`, `score`, `set` and `span`.

The search combined English and Portuguese web queries, snowballing from the references of **SO-Arena**, and a community index and early evidence audit. Sources included arXiv, Preprints.org, publication records, GitHub, Hugging Face, and vendor and leaderboard pages. A closing search added **14 more works**, a sign of how fast the field was moving.

Publication status and relevance were scored separately. Status tiers were **S** for leading journals and conferences, **A** for other peer-reviewed venues, **B** for preprints and **C** for grey literature with primary information on benchmarks, training or production use. Relevance combined centrality to typed decision models (up to five points) with coverage of the research questions (up to five more); inclusion required centrality of at least two and a total of at least five.

| Area | Works | Publication status |
| --- | ---: | --- |
| Reviews, audits and taxonomies | 4 | Preprints |
| General benchmarks and evaluation protocols | 17 | Preprints |
| Calibration, coherence and reliability | 12 | Preprints |
| Decision models as judges | 5 | Preprints |
| Adversarial robustness and security | 6 | Preprints |
| Models and training recipes | 18 | Preprints |
| Domain-specific studies | 23 | Preprints |
| Grey literature | 12 | Vendor reports, repositories and indices |
| Adjacent peer-reviewed literature | 13 | 8 tier S and 5 tier A |
| **Total** | **110** | **85 preprints, 12 grey sources, 13 peer-reviewed** |

Of the 97 core sources, 33 date from September 2026, 48 from October and 16 from the first half of November. I read 37 in full and 24 in part; 35 only as abstracts, 11 as web pages or repositories, and the remaining three through abstracts plus prior knowledge or a secondary assessment. Metrics, items and model versions were too heterogeneous for a meta-analysis, so the synthesis is narrative.

The highest relevance scores (**9.5**) went to JEVal, Chinese-Jev, MedJev, an independent product-reranking evaluation, EO-Jev and a Brazilian Portuguese benchmark. SO-Arena scored **8.5**: central to capability and reliability, but silent on training data and probability calibration. In a field this young, a higher publication tier did not mean greater relevance.

## One interface, several model families

Typed decisions are an interface, not an architecture. The corpus includes encoder classifiers, reward models, non-autoregressive decision engines, contrastive models and extraction models, with open implementations ranging from encoders of a few hundred million parameters to **27–31-billion-parameter** models derived from language models.

The pattern has clear predecessors: policy guardrails, reward models that rank candidate responses, and schema-driven extractors already worked over constrained outputs. What is new is a common contract with probabilities as a first-class output. Its value has to be measured against those predecessors, and against ordinary language models read through their label probabilities.

| Primitive | Meaning | Relevant evaluation |
| --- | --- | --- |
| `choice` | Select one of several mutually exclusive options | Accuracy, multiclass Brier score, negative log-likelihood, calibration, option-order stability |
| `noul` | Estimate the probability of a yes/no proposition | AUROC, AUPRC, Brier score, calibration, coverage at a fixed risk |
| `score` | Assign probability across ordered levels | Mean absolute error, within-one-level accuracy, quadratic kappa, ranked probability score |
| `set` | Select a subset of the options | Exact-set accuracy, Jaccard similarity, per-label and set-level evaluation |
| `span` | Extract character spans or temporal intervals | Exact and partial-overlap span F1, temporal intersection over union |

**Abstention** cuts across all five: is no available answer justified, is the evidence insufficient, should the decision be escalated? It is distinct from uncertainty between otherwise valid candidates. The reference interface covers `choice`, `noul` and `score`; `set` and `span` are emerging extensions.

## Accuracy needs the right comparators

Most evaluations convert public datasets into typed requests and give every system the same state, instructions and candidate answers. Single-label classification becomes `choice`, binary detection `noul`, ordinal prediction `score`, and multilabel tasks are often split into one binary question per label.

Three comparators answer different questions. Reading label probabilities from the **same base model** isolates the effect of specialized training or of the interface. A **supervised classifier** is the alternative whenever task labels exist. A **generative model with reasoning** sets a stronger capability reference. An early audit found that **21 of 27 studies** skipped the first comparison and **12 of 27** reported no confidence intervals or significance tests [R01].

The capability results show a recurring gap on reasoning-heavy tasks:

| Evaluation | Reported comparison | Interpretation |
| --- | --- | --- |
| SO-Arena [B01] | Best decision models **70.2** capability points; best reasoning reference **82.3** | Broad capability parity not yet reached |
| System1-Arena [B06] | Best decision model **73.0%**; leader **81.1%** | Same direction, on its own scale |
| One-pass limits [B14] | Jev **97.5%** on one-step items, **74%** on reasoning items | Difficulty depends on the computation required |
| Pairwise judging [J01] | **92.5%** on ordinary pairs; **78.6% vs. 93.1%** on hard pairs | Easy judgments can hide a large hard-case gap |
| Intent routing [B05] | Tuned encoder **0.953**; Jev **0.913** | Supervised baselines matter when labels exist |

Compare within rows only: the tasks and scoring systems differ, and averaging across them would be meaningless.

SO-Arena also shows the gap between capability and reliability most clearly. Across **21 models and 11 domains**, the most capable System One model ranked only **seventh** on reliability, a protocol that adds option-order stability and recognition of missing correct answers ([SO-Arena](https://arxiv.org/html/2611.15777v1)).

## Calibration belongs to a model and a task

A probability is useful for automation only if it supports the decision policy applied to it. Accuracy evaluates the top answer; calibration evaluates whether confidence matches observed outcomes. Proper scoring rules such as the **Brier score**, **negative log-likelihood** and **ranked probability score** evaluate the whole distribution, while expected calibration error (**ECE**) summarizes confidence–outcome gaps across bins. ECE should be compared with its finite-sample null level, and recalibration evaluated on data separate from the final test, because small ECE differences can come from sampling noise or binning.

Calibration depends heavily on the task. The same model had ECE **0.033** on a workflow dataset and **0.251** on social-science tasks [B05]. In relevance assessment, only **66%** of pairs given probability above **0.9** were actually relevant [C08]. On a task with a known answer distribution, a model put **89.35%** of its mass on the modal answer when the correct probability was **35.60%** [B02]. Rewording a question shifted calibration error by **0.071** in another audit [C11].

Local recalibration can help a great deal. In **MedJev**, a two-parameter method fitted on **50–200 labeled examples** cut ECE for in-hospital mortality from **0.286 to 0.007** ([MedJev](https://arxiv.org/abs/2610.36006)); that concerns one model and one patient-level task, not System One probabilities in general. Other studies improved a relevance Brier score from **0.213 to 0.147** [C08] and crash-narrative calibration error from **0.0231 to 0.0069** [D13]. Under asymmetric costs, poor probabilities can even make an expected-cost rule worse than simply taking the most likely label [B03]: calibration changes the action taken, not just the reliability plot.

## Selective prediction and cascades need local thresholds

Selective prediction automates some cases and defers the rest. **Coverage** is the share handled automatically; **risk** is the error rate within it. A risk–coverage curve shows the trade-off better than accuracy at one threshold.

Some early results are encouraging. In a medical-question study, predictions with confidence of at least **0.9** were **93.4%** accurate and covered **52.9%** of questions [D01]; in moderation, a **0.8** threshold covered **54.6%** of cases at **85.5%** accuracy [D11].

The problem is transfer. A threshold tuned on the evaluation sample for **5% error** produced up to **17%** out of sample [B10]. A 5% threshold set in English gave **7.8–12.4%** error in German and French [B04]. A rejection policy moved between tasks produced **69.3%** false rejections [C01], and a **0.90** confidence cutoff still left **34.9%** errors on a theory-of-mind benchmark [D15]. A procedure with statistical risk control, Learn-then-Test, kept **52.8%** of intent decisions under a 5% risk guarantee [B05].

Cascades add two considerations. First, escalation only helps if the stronger system can fix the first model's mistakes. One study reached **93.4% accuracy at 41.4% of the frontier judge's cost**, and a prospective test matched that judge while escalating **74.2%** of pairs [J01]. Another found that generative judges repeated **96.0%** of Jev's most confident wrong verdicts, against **50.3%** expected under independence, so even an oracle threshold gained at most **2.7 points** [J02]. Second, every stage costs something: one apparent saving of **23.9%** shrank to **4.3%** once the prefilter was included [B10]. The real question is the cost of the whole workflow at an acceptable risk.

## Stability and coherence expose hidden failures

Four kinds of stability test matter: candidate order, option names, equivalent wordings, and interference between questions sent together.

**Option order.** SO-Arena compares each list with 12 reorderings and reports median flip rates of **4.3%** for initially correct answers and **25.7%** for incorrect ones [B01]; other studies span much wider ranges. Permutation-invariant architectures, consistency losses and averaging over rotations help. A two-stage method that first scores options separately cut Jev's flips from **5.3% to 0.9%** [C12].

**Option names.** Swapping the binding between a label and its definition changed **32.5%** of Jev's decisions and **76.9%** of an open encoder's, with **zero type errors** [C04]. Misleading labels cut another encoder's accuracy from **0.85 to 0.14** and its confidence AUROC from **0.81 to 0.24** [C09]. A schema can be perfectly valid while the model follows the wrong semantic cue.

**Paraphrases and contrast groups.** TypedBench reported accuracy from **0.708 to 0.946** across wordings of the same task [B03]. In DecisionPivot, models only **2.6 points** apart on a reference track scored **70.1% vs. 44.2%** when an entire contrast group had to be right [B08]. Group-level evaluation tests whether a model responds to the fact that should decide the answer.

**Joint requests and logical coherence.** Batching questions flipped **11.7–22.4%** of a small model's decisions, with negligible effect on a larger sibling [C07]. Probabilities for a proposition and its negation missed summing to one by **0.064** on average, about five times the repeat-query noise [C03]. These checks should be read against the model's own test–retest variability, about **1%** for several hosted models.

## Missing answers need their own evaluation

Adding "none of the above" does not create a reliable abstention mechanism; a model may confidently pick the closest available answer when every candidate is wrong.

An arithmetic study makes this stark: Jev was **99%** accurate when the correct answer was present but rejected only **7%** of cases where it was absent. Binary verification of each candidate reached **99%** on those cases, and a threshold set on separate development problems raised rejection to **79%** while keeping **97%** accuracy when the answer was present ([When the Right Answer Is Missing](https://arxiv.org/abs/2609.39496)). The knowledge to reject was there; the categorical format did not use it.

Medical and open-model studies show similar weaknesses. Replacing the correct medical answer with a rejection option dropped accuracy from **77.62% to 65.60%** [D02]; "I don't know" was chosen in only **10.5%** of the cases where it was correct [D01]. Across open models, success on four paired fallback requests ranged from **18.2% to 81.0%**, and renaming the fallback option alone cut joint correctness from **43.8% to 22.7%** [C10].

Evaluations should measure **detection of absent answers** and **false rejection of present ones** separately. Architectures with an explicit null probability are another route: Jeva reported **93.88%** missing-answer detection at **5.02%** false positives [M04], a specific result rather than a transferable guarantee. Leaderboards also disagree on whether abstention counts as an error, which can reorder their rankings.

## A closed output space does not prevent adversarial decisions

Restricting the output space makes arbitrary attacker-chosen responses harder to induce. In one reconstructed injection evaluation, adaptive attacks raised success only from **1.8% to 3.5%** [S03]; in another, common injection strategies failed to change correct answers in **10,240 paired tests** [S04].

Changing which decision is selected is another matter. A dataset-specific adversarial suffix flipped **43%** of unseen documents [S04]. Additions that annotators judged natural redirected **61.4–73.2%** of initially correct decisions [C05]. An observer's opinion, with no explicit command, flipped **12.1%** of decisions and pushed **38.0%** of confident answers below the acceptance threshold [S01]. In an application study, **81.5% of 228 programs** showed decision flips [S06].

An attack evaluation must also confirm that the modified input still has the same correct answer: in DecisionRobust, attack success fell from **69.7% to 36.6%** after that check [S02]. Judges are vulnerable to presentation too; rewriting the better answer in an emotional style cut judging accuracy from **99% to 42%** in one study [J05].

## Efficiency must be measured across whole workflows

Cost and latency are the most consistent advantages. One judging study reported **US$0.044 per thousand judgments** for Jev against **US$12.182** for a frontier generative judge, with median latency of **0.15 vs. 1.89 seconds** [J01]; rubric-judging studies found generative judges **16–357 times** more expensive [J02]. These are historical costs, not current prices.

Per-call savings can vanish across a trajectory. In agent workflows, extra interactions or reasoning absorbed the savings, and one study found a higher cost per successful outcome [B16]. Hosted latency also includes network and service behavior, while local latency depends on hardware and configuration, so the two should not share a heading.

Composite indices add another layer. The JevBench leaderboard combined capability, calibration, speed and cost; the community Decision Index weighted public, private same-skill and private new-domain evaluations **20%, 50% and 30%**; Artificial Analysis combined a quadratic probability score with a symmetry penalty for answers that change across equivalent wordings. These are different quantities, and their definitions change between versions. Public scores can also become development targets, and sealed tests still expose their items to hosted providers.

## Agents need evaluation over trajectories

An isolated decision benchmark cannot show whether a model will complete a sequence of dependent actions. In closed-loop experiments, an open language model read through its probabilities reached **32.9%** success, against at most **3.1%** for smaller decision models [B06]. Jev's final-state accuracy fell to **53–80%** after **16 state updates** [B14], and zero-shot model routing was near chance in another evaluation [B10].

The role given to the model matters. In an actor–judge–teacher study, models acting directly were distracted by easier subgoals, while judges that saw whole trajectories credited the right steps; used as a teaching signal, their scores raised a trained policy's success from **72.8% to 82.9%** [B17].

Specialization is a more targeted route. SearchJev raised end-to-end search-agent accuracy from **45.0% to 54.0%** over the generative model alone [M18], and Dyad's typed action selection beat its reinforcement-learning baseline in **41 of 48** comparisons [M14]. Looped decision models and hybrids that learn when to reason widen the design space beyond a one-pass replacement for every agent decision.

## Four routes to training data

The literature shows four complementary routes, which differ in scale and in what the target probabilities mean:

1. **Reformat public supervised datasets.** Classification, inference, ranking and rubric datasets become typed requests; a single correct class becomes a hard target, and continuous scores can spread mass across adjacent ordinal levels. This yields millions of decisions, but often from the same source families later used for evaluation.
2. **Generate examples procedurally.** Simulators, executable programs and rule systems provide exact labels or known probabilities; one spatial-state simulator produced **60,200 questions**. The labels are verifiable, but diversity is limited by the generator.
3. **Use teacher models.** Synthetic examples are kept after agreement from several judges or verifiers; some recipes average reasoning samples into soft targets or distill a model's reasoning-conditioned distribution into a single pass. Agreement improves consistency without proving correctness.
4. **Use distributions of human annotations.** Multiple votes per item preserve disagreement as a soft target, which matters for subjective judgments where a majority label throws away information about ambiguity.

Domain work adds anonymized production traffic, medical-image annotations converted into **155,729 decision targets**, and public Earth-observation training splits. The reference Jev training mixture remains undisclosed.

### Training recipes and their scale

Volumes are the units each source reports, not standardized counts of unique documents.

| Model or recipe | Reported training volume | Main ingredients |
| --- | --- | --- |
| Chinese-Jev [M01] | **13.05 million decisions** | Converted general and medical sources; cross-entropy plus a proper-score reinforcement term |
| Chinese Decision [M02] | Same **13.05 million**, plus **1.2 million extraction rows** | Joint decision and span training |
| mammoth-1 / elephant-1 [G05] | **6.21 million examples**, **58.3% synthetic** | Public datasets, teacher panels, abstention examples, cross-entropy and Brier loss |
| StartLux-Decision [M05] | About **2.7 million** and **1.7 million** in two stages | Public splits, verified synthetic examples, soft targets, RLCD2 |
| Drex [M03] | **1.15 million** | Teachers, public data, executable verification, reinforcement and consistency losses |
| Jeva [M04] | About **1.1 million** | Curriculum with withheld answers, explicit nulls and candidate-coverage training |
| Jeff-1.0 [B09] | **417,825 questions** across **79 tasks** | Human and teacher soft labels, low-rank adaptation, decision head |
| SII-Decision [B02] | **39,279 questions** | Self-distillation without reference labels, weighted cross-entropy, divergence anchoring |
| this-that-model [M07] | **60,200 questions** | Simulator labels, cross-entropy and Brier score |
| Intern-Decision [M06] | **17,880 samples** | Teacher text, public tasks, games, loss at decision positions |
| EO-Jev [D16] | Training splits from **12 datasets** | Domain labels, replay of general data, low-rank adaptation, ordinal scoring |
| SearchJev [M18] | **425,000 state–schema pairs** | Search, intent and verification data; one-third model-labeled; source-weighted soft targets |
| LLM-as-Jev [M17] | Mixtures of **3,000–30,000 examples** | Human-labeled public data, tree-factorized listwise loss, low-rank adaptation |
| OpenJev-RLCD [M15] | **4,000 questions per task** | Calibrate the readout, then reinforce rationales with the Brier score |
| PACT [M16] | **2,334 paired records** | Machine-verified counterfactuals, evidence dependence, permutation consistency |

The common foundation is cross-entropy against hard or soft targets. On top of it come Brier terms, permutation consistency, shuffled options, explicit missing-answer examples and several reinforcement objectives. Compute ranges from full training of large models to short low-rank adaptation runs, or no training at all.

### What the ablations actually show

Nothing in the corpus establishes that reinforcement learning is indispensable. An untrained label-probability readout from a 31-billion-parameter open model scored **79.6**, close to Jev's **80.1** on the same validation setting, and a short supervised recipe reached **84.4**, mostly thanks to low-rank adaptation [B09]. A 4-billion-parameter readout reached **81.4%**, rising to **84.0%** after adaptation [M17].

Reinforcement contributions were mostly not isolated; one ablation put them at roughly **two points** [M03]. OpenJev-RLCD gives a sharper result: accuracy matched an accuracy-reward baseline, but the share of decisions automatable at **5% error** rose from **19.4% to 81.1%** on a verification task. When uncertainty came from annotator disagreement instead, the method did not beat cross-entropy [M15].

Data scale and repair mattered too. Across eight mixtures, a nine-billion-parameter model rose from **45.5 to 74.0** on a public index, although the same report gives **72.2** in its prose [G05], so the endpoint is not a single precise number. The broader lesson is to isolate data, adaptation, architecture and reinforcement in separate comparisons.

## Contamination and label circularity

Training recipes and benchmarks often draw on the same public datasets. Training on a dataset's train split and testing on its held-out split is legitimate, but it answers a narrower question than generalization to unseen sources or tasks, and claims of the latter need an exposure audit.

Defenses in the corpus include exact deduplication, fingerprints, source-based partitions, eight- or thirteen-word overlap filters, known-benchmark exclusions and perceptual image hashes. DecisionPivot removed **8.5%** of its reference items after finding overlap with training files [B08]. None of these catches paraphrases or indirect exposure through a teacher model.

Label circularity is a separate problem. If a generative model supplies the reference answer, the evaluation measures agreement with that model unless correctness is established independently. In JevAdvBench, **82.4%** of labels came from consensus among the models being evaluated [S01]. In a human audit of HakemBench, people and models disagreed on **3 of 53** objective questions but **39 of 90** subjective ones [B18]. Label provenance belongs next to the score, not in an appendix.

## The benchmark landscape

The inventory spans general native benchmarks, leaderboards, diagnostic benchmarks, language-specific benchmarks, open training collections and peer-reviewed datasets reused as components, **76 entries** in all. The main resources:

| Resource | Scope | Main use |
| --- | --- | --- |
| SO-Arena [B01] | **2,919 tasks**, **40 sources**, **11 domains** | Capability, order stability, missing answers, interactive tasks |
| JEVal [B02] | **11,257 instances**, **36 datasets** | General typed decisions and probability behavior |
| System1-Arena [B06] | **92,125 questions**, **268 sources** | Broad capability and closed-loop evaluation |
| Deußer et al. suite [B11] | **346,009 requests**, **37 datasets** | Reproducible conversion and comparison of public tasks |
| DecisionPivot [B08] | **40,033 items**, **7,800** in generated contrast groups | Evidence sensitivity and group consistency |
| TypedBench [B03] | **Seven programmatic generators**, **nine suites** | Calibration, framing and decision cost |
| XDecideBench [B04] | **153,875 questions**, **122 languages** | Multilingual decisions and threshold transfer |
| HakemBench [B18] | **2,346 items**, **4,275 questions** | Turkish typed decisions with a human-adjudicated subset |
| CJ-Bench [M01; M02] | **307,900 decisions** | Chinese general, medical, legal and financial tasks |
| PT-BR typed-decisions [G09] | **5,196 test items**, **seven tasks** | Brazilian Portuguese with human labels from source datasets |
| JevAdvBench [S01] | **812 questions**, **9,744 adversarial variants** | Attacks on typed outputs |
| SearchDecisionBench [M18] | **425,000 training pairs**; up to **10,000** test decisions per dataset | Chinese and English search-agent decisions |

**MMDM** adds **5,448 questions** across 16 task categories with option spaces of up to **1,024**, mixing new tasks with source-grounded rewrites ([MMDM](https://arxiv.org/abs/2611.14309)); its narrative also mentions 2,568 new questions, and the two figures should not be treated as interchangeable totals. An open-data collection of **17 datasets** includes **2.53 million human-labeled rows**, procedural collections of **520,000** and **264,000** rows, and **741,000 teacher soft-label rows** [G10]. Peer-reviewed components such as JudgeBench, RewardBench, BFCL, When2Call, RouteLLM, LLMRouterBench, RouterEval, Aegis2.0, WildGuard, DynaGuard and GLiNER2 supply established tasks and methods, but not peer-reviewed validation of the new category.

Names alone are not enough to identify a benchmark: the **JevBench evaluation-framework preprint [B13]** and the **JevBench leaderboard [G02]** are different things, and private and public leaderboard splits differ in reproducibility. A useful citation names the project, version, label provenance, exposure assumptions and scoring rule.

## The largest gaps are set and span

Coverage is lopsided. Of the **97 core sources**, **86** evaluate or implement `choice`, **56** `noul` and **47** `score`; only **three** directly cover `set` and **two** `span`.

<figure>
<a href="/images/system-one-review/primitive-coverage.png" target="_blank" rel="noopener"><img src="/images/system-one-review/primitive-coverage.png" alt="Stacked bars of primitive coverage across 97 core sources. Direct coverage: choice 86, noul 56, score 47, abstention 19, set 3, span 2." width="1760" height="840" loading="lazy" decoding="async" /></a>
<figcaption>Figure 1. How many of the 97 core sources cover each primitive directly, partially, not at all, or do not report it.</figcaption>
</figure>

For **set selection**, independent binary predictions can hide dependencies between labels and do not show whether the selected subset as a whole is right. MMDM's hard multi-select task illustrates the difficulty: no model exceeded **36.81%** when every reference-set member had to outrank every non-member. Exact-set recovery, Jaccard similarity and thresholds chosen for the joint decision answer questions that isolated binary scores cannot.

For **span extraction**, Chinese Decision reported exact-match span F1 rising from **63.1 to 68.9**; continuing with extraction-only training lifted F1 to **73.9** but dropped decision accuracy to **71.02%** [M02]. VideoJev evaluated temporal intervals by intersection over union [M13], and OmniMed-Jev dropped an image-localization primitive after its coordinate head collapsed [D07]. No general span benchmark comparable to the major decision suites exists yet. One should measure exact and partial overlap, span-level confidence and detection of absent spans, and keep commercial extraction features listed only in community indices apart from verified benchmark evidence.

## What the domain studies found

There are **23 dedicated domain studies**, plus domain slices of broader benchmarks and engineering reports. They favor bounded semantic judgments with explicit criteria and expose larger gaps in specialist reasoning, rare labels and missing evidence. None establishes fitness for deployment across a whole domain.

### Medicine

Knowledge and text comprehension were stronger than clinical judgment or hard non-text inputs: mean AUROC **0.94** for medical knowledge and **0.93** for text comprehension, against **0.69** for volumetric-image findings [D05]. One study found near parity on research-summary questions (**78.4% vs. 78.2%**) but a large gap on diagnostic cases (**59.8% vs. 82.4%**) [D01]. Triage nurses reached **0.85** accuracy against **0.56** for the best model [D05], and physiological-signal evaluation reached only **35.95%** [D02].

Narrower uses did better. Radiology-report factuality judgments correlated with reference assessments about as well as specialized metrics, at roughly **US$0.00025 per pair** [D06]. A Chinese medical specialist scored **87.65% vs. 84.29%** for the general reference model [M01], and OmniMed-Jev reported calibration error of **0.081 vs. 0.259** for a generative model with the same base at similar accuracy [D07]. Local validation, population-specific calibration and unanswerable-question tests remain essential.

### Law

Contract inference highlights the difference between contradictions and missing information. Jev reached **77.38%** accuracy, below all seven hosted generative comparators (best **83.21%**), with recall of **92.31%** for contradictions but **59.52%** for "not mentioned" [D08]. Rare contract clauses had F1 of **0.204** in a broader evaluation, and threshold tuning on another dataset raised micro-F1 from **0.499 to 0.748** [B11].

A legal engineering report shows why retrieval and factual verification need separate tests. Reranking statutory articles lifted top-one accuracy from **63.8% to 85.0%**, yet text-only judgments scored answers with fabricated citations above correct ones (**3.21 vs. 2.79**), and the model caught **89.1%** of destructive tool calls against **99.2%** for a handwritten blocklist [G12]. These are first-party findings with different targets, not a single measure of legal competence.

### Finance

The dedicated financial study tested evidence support for answers about financial reports. Overall AUROC was **0.986**, yet four of six selected adversarial cases still passed a **0.8** threshold when a citation was swapped for a different cell containing the **same number**; making the column heading explicit fixed those cases [D22]. Numerical agreement did not establish the right financial meaning. There is no broad financial-decision benchmark; elsewhere, a Chinese finance specialist trailed Jev [M01], and scaling from two to four billion parameters improved a financial slice by **7.11 points** [M02].

### Retrieval, recommendation and commerce

In a preregistered independent product-reranking evaluation, every decision model beat BM25, and the best beat a dedicated reranker (**0.822 vs. 0.787 nDCG@10**) [D09]. Relevance probabilities also enabled adaptive truncation of result lists: expected-F1 truncation reached **0.638** against **0.506** for a fixed cutoff [C08]. DecisionRank distilled a **1.7-billion-parameter** student that beat its **27-billion-parameter** teacher [M09].

The picture changes with the candidate set. In recommendation, Jev beat dedicated recommenders with **20 candidates** but fell behind with **200**, and candidate order flipped **26.8%** of correct decisions [D23]. Candidate count, ordering, calibration and the retrieval stage are all part of the system being evaluated.

### Moderation, annotation, fraud and operations

| Application | Reported result | Limit of the evidence |
| --- | --- | --- |
| Community moderation [D11] | Retrieved precedents raised accuracy from **52.7 to 65.1** | Depends on the available policy examples |
| Alignment-failure detection [J04] | Median **0.886 AUROC** across **31 benchmarks**, at about **63 times** lower cost | Probabilities poorly calibrated within tasks |
| Production classification [G06] | Domain tuning raised a small model's F1 from **0.563 to 0.902** | First-party result favoring adaptation over drop-in substitution |
| Social-science annotation [D12] | Behind the best generative model in **14 of 15** tasks; median gap **11.6 macro-F1** | Total cost **US$0.21**, against **US$0.34–62.99** |
| Crash-narrative coding [D13] | **0.908 F1** against human coders; **US$0.154 per thousand** narratives | Humans reviewed **0.8%** of flagged records |
| Scam-call screening [D14] | **0.974 AUROC** for a tuned open model | Callers were synthetic |
| Earth observation [D16] | Adaptation gained **23.8 points** in-domain and **8.0** outside it | A general index fell **1.8 points** |
| Support operations [G08] | About **US$0.0222 to US$0.0005 per call**, roughly **44×** cheaper | Quality parity claimed without published metrics |

The corpus also covers theory of mind, time-series decisions, scientific semantic choices, video quality, penetration-testing agents and emotion classification [D15; D17–D21], without comparable quantitative results for each. They should not be folded into a cross-domain average.

## Portuguese and multilingual evaluation remain thin

English results and thresholds do not transfer automatically. In XDecideBench, the English leader was significantly beaten in **56 of 232** suite–language combinations [B04]; a medical evaluation lost up to **39.4 points in Yoruba** [D05]; and generative models led the Turkish benchmark, with Jev fourth [B18].

I found only **two Brazilian Portuguese sources**. In relevance assessment on Brazilian legal and legislative collections, Jev's judgments reached quadratic kappa of **0.52–0.82** against reference judgments, with system-ranking agreement of Kendall's tau **0.90–0.93**; reranking a Portuguese web-passage collection lifted nDCG@10 from **0.3329 to 0.6331** [D10]. A community benchmark with **5,196 test items across seven tasks** (legislative topics, legal and scientific areas, fact-checking, offensive language) had a best external score of **62.46** on a chance-corrected 0–100 scale, not raw accuracy [G09]. Both argue for native Portuguese evaluation and locally chosen thresholds rather than an English leaderboard order.

## What the typed interface actually contributes

The interface, the training and the service implementation should be evaluated separately. The interface provides a convenient probability-bearing contract and eliminates many output-format failures; on its own, it has not been shown to beat label probabilities read from the same underlying language model.

Specialized training can add value: three decision heads improved on their base models across **12 languages**, with larger gains in languages less represented online [B04], and Jev beat an open 27-billion-parameter next-token baseline on **27 of 37** datasets [B11]. Those results coexist with strong untuned readout baselines and compact supervised models. The reference product should not stand in for the category either: Jev scores **60.4** capability points on SO-Arena, below the leading open decision models at **70.2**.

Four conclusions follow:

1. **Capability and reliability are separate axes.** Calibration, stability, abstention and selective risk decide whether a score can drive automation.
2. **The interface alone has not shown an accuracy advantage.** The clearest recurring benefits are cost and latency; the contribution of training needs a matched baseline.
3. **Contamination and circular labels are central threats to validity.** A large benchmark can still be measuring exposure, or agreement with a teacher.
4. **Set and span lack standard evaluation.** Joint and boundary-sensitive outputs need metrics beyond multiple choice.

## A minimum evaluation protocol

Ten requirements turn a model score into evidence about a decision workflow:

1. **Include meaningful comparators:** label-probability readout from the same base model (or a similar open model), a supervised classifier when labels exist, and a generative reasoning model.
2. **Document the items:** label provenance, novelty, source exposure and contamination checks, with fresh procedural or sealed items for any generalization claim.
3. **Report accuracy with uncertainty:** chance and majority baselines, resampling intervals and paired tests.
4. **Evaluate the probabilities:** a proper scoring rule and calibration error relative to its finite-sample null, before and after recalibration on separate data.
5. **Evaluate selective prediction:** risk–coverage curves, with thresholds chosen on held-out data from the intended workload and risk guarantees for automated decisions.
6. **Test stability:** reorder options, rename labels, paraphrase questions and evaluate contrast groups against test–retest variability.
7. **Test missing answers explicitly:** measure detection and false rejection separately.
8. **Test adversarial robustness:** natural context additions and injection attempts, checking that each perturbation preserves the correct label.
9. **Measure complete costs:** separate local and hosted latency, and include filtering and escalation in the cost per decision and per completed task.
10. **Respect the primitive and the domain:** joint set metrics and span-level evaluation where needed, compared with relevant human expertise and local calibration.

This is a basis for designing a benchmark, not evidence that any model has passed one.

## Limits and next steps

Seven threats run through the underlying evidence: a very recent, unreviewed core; reliance on changing, nondeterministic hosted models; incomplete contamination controls; model-generated reference labels; evaluations run by model developers; small samples or single runs; and a strong English bias.

The review has its own limits. It searched the open web rather than indexed bibliographic databases, did not assess every application cited by the initial audit, and had a single reviewer working with AI assistance, without independent double coding. Many entries rest on abstracts or partial texts, some venue classifications and leaderboard descriptions come from secondary material, and the relevance scores involve judgment.

The research priorities are clear: independent, peer-reviewed replications with matched comparators and open model versions; fresh human-labeled benchmarks, including native Portuguese tasks; and protocols that evaluate complete sets and extracted spans. The operational priority is just as concrete: measure the exact decision, candidate space, language and workload an application will use.

System One models have made fast probabilistic interfaces easy to build into software. The road ahead is to establish when those probabilities deserve to control an action, and to measure the cases where they do not.

## Sources and related work

The [full review (PDF, in Portuguese)](/documents/system-one-literature-review.pdf) contains the complete bibliography and the ranking of all 110 sources by publication tier and relevance; the bracketed codes in this article refer to its entries. Selected primary sources:

- [SO-Arena](https://arxiv.org/abs/2611.15777): capability and reliability across domains [B01].
- [TypedBench](https://arxiv.org/abs/2610.11392): calibration, framing and decision costs [B03].
- [Evaluating and Benchmarking the System One Model Jev](https://arxiv.org/abs/2609.37647): dataset conversion and broad comparison [B11].
- [Releasing the Inner Jev](https://arxiv.org/abs/2610.17205): open readouts and supervised adaptation [B09].
- [When the Right Answer Is Missing](https://arxiv.org/abs/2609.39496): candidate coverage and rejection [C02].
- [Type-Safe Is Not Error-Free](https://arxiv.org/abs/2609.26758): option-name sensitivity [C04].
- [MedJev](https://arxiv.org/abs/2610.36006): medical evaluation and local recalibration [D04].
- [MMDM](https://arxiv.org/abs/2611.14309): large candidate spaces and multi-select decisions [B07].
- [Jev-as-a-Judge for Brazilian Portuguese Information Retrieval](https://arxiv.org/abs/2610.23346): Portuguese relevance assessment and reranking [D10].
- [OpenJev-RLCD](https://arxiv.org/abs/2609.38850): an open investigation of calibrated-decision training [M15].

Related experiments on this site: [typed binary decisions and absence](/writing/legal-binary-questions-and-absence/), [legal evidence decisions](/writing/legal-evidence-decisions-h100/) and [Vela reranking versus long context](/writing/legal-rag-versus-long-context/).
