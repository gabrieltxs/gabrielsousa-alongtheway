---
title: 'System-One models for legal evidence: inside the D1–D4 experiments'
shortTitle: System-One evidence
description: 'Thirty-five conditions on two H100 GPUs test where a System-One model adds value in legal question answering: passage selection, proof scope, reading sufficiency and operand binding.'
pubDate: 2026-11-23
kind: article
tags: [Legal AI, NLP, System One, Decision Models, Retrieval, Evaluation]
image: /images/legal-research/evidence-decisions.png
imageAlt: 'Paired effects of D1–D4 evidence decisions and the chain through D3, with document-bootstrap intervals.'
---

**Vela's clearest contribution is choosing evidence: a single listwise decision raises legal-answer accuracy by 4.32 points at the same three-passage budget.** The full chain through D3 beats the full-document baseline by **3.27 points**, but the controls show that these two findings answer different questions. A better pipeline does not mean every learned decision inside it pays its way.

This study, part of my legal NLP research at **CEIA-UFG**, breaks evidence processing into four decisions: **D1, passage selection; D2, proof scope; D3, reading sufficiency; and D4, operand binding**. Across 35 conditions, it asks where a System-One model adds measurable value and where a simpler policy already does the useful work.

## System-One models as an explicit decision layer

Vela3-Flash-9B scores alternatives, or the support for a proposition; Qwen writes the answer. This follows the System-One interface described in the [Vela model card](https://huggingface.co/vllm-sr/vela3-flash), which returns structured decisions without generated text. Choices and scores drive application logic instead of appearing as free-form reasoning in the answer.

The idea behind **typed decision models** is to make the output contract match the task: choose a passage, classify a proof requirement, assess one facet of the evidence, or bind an occurrence to an operand. The program then enforces coverage rules, composes source intervals and executes supported operations. Types make those interfaces inspectable; they do not make the evidence correct or turn raw scores into calibrated probabilities.

| Stage | Model decision | Application action | Simpler comparator |
| --- | --- | --- | --- |
| D1 | Which candidates support the question? | Keep three source windows | Embedding order |
| D2 | What proof scope does the question need? | Route reading and attach a scope record | Text rule |
| D3 | Is each required evidence facet supported? | Stop, expand or read the full source | Fixed, random or length-based routing |
| D4 | Which occurrences are the required operands? | Record offsets and run the selected operation | First compatible occurrences |

The design is built for testing. Each stage is compared with its own input, with a simple policy that serves the same function, and with a reduced version of its own mechanism. These controls separate "this stage helps" from "a learned decision is needed here."

## Execution

Decision-model calls are split across **two NVIDIA H100 GPUs**, with the Vela backbone in **BF16, without quantization, and FP32 score readout**, and without the input truncation used in earlier runs. This differs from the four-bit reranker in the [retrieval benchmark](/writing/legal-rag-versus-long-context/). I did not isolate the accuracy effect of these choices or measure throughput, energy or scaling.

Qwen Embedding 4B proposes up to fifteen source windows. The generator, Qwen 3.8-27B, receives one question per call, the union of the selected source intervals and any applicable decision record, within a **116,000-token** budget. Even the full-document control is bounded: **88 of 2,570 inputs are truncated**, so "full context" means the full-source route under this budget, not guaranteed access to every token.

## Cohort and how to read the results

The study covers **2,570 questions from 100 documents**: ten pilot documents with 269 questions and ninety more with 2,301. Documents were chosen by their absolute historical error counts, which favors both difficult documents and documents with many questions. This is an adaptive development cohort, not a held-out sample.

There are two global controls, twelve D1 variants, six D2 variants, eleven D3 variants and four D4 variants. Each stage builds on a fixed input:

- **D2 receives the complementary D1 package (70.89%)**, not the higher-scoring listwise condition (71.28%).
- **D3 receives the main D2 scope condition (74.36%).**
- **D4 receives the D3 threshold-0.80 condition (75.53%).**

Because each stage has its own comparator, the stage effects must not be added up as if they described a single chain of best results. Differences are computed from unrounded paired counts, so subtracting rounded percentages can be off by 0.01 point.

<figure>
<a href="/images/legal-research/evidence-decisions.png" target="_blank" rel="noopener"><img src="/images/legal-research/evidence-decisions.png" alt="D1 gains 4.32 points, D2 3.46, D3 1.17, D4 loses 0.62; the chain through D3 gains 3.27 against full context. Each has a paired 95% interval." width="1920" height="880" loading="lazy" decoding="async" /></a>
<figcaption>Figure 1. Stage effects and the pipeline-level comparison, with intervals that resample whole source documents. Shading marks an approximate ±0.55-point judge-noise scale, not a significance region.</figcaption>
</figure>

Differences are paired over the same questions: **100 × (gains − regressions) / 2,570**. Intervals come from 10,000 bootstrap resamples of the 100 document clusters. I also apply an approximate Bonferroni screen to the 41 comparisons: **A** survives it, **B** excludes zero only before correction, and **C** includes zero. Plotted intervals are unadjusted 95% intervals.

## D1: one selection decision improves evidence delivery

D1 starts from up to fifteen windows and passes three to Qwen. A **listwise** decision scores the candidates together for relevance to the question, attending to subject, case, conditions and negations. The **complementary** variant makes three successive choices, each conditioned on the passages already selected, to look for evidence that is still missing.

These selectors are crossed with three candidate pools: dense retrieval; dense plus BM25, fused by reciprocal rank fusion with constant 60; and dense windows with closed boundaries, which snap to nearby newlines (up to 512 characters either side, within a 6,144-token union limit). The design separates better selection from better candidate recall or better passage boundaries.

<figure>
<a href="/images/legal-research/d1-selection.png" target="_blank" rel="noopener"><img src="/images/legal-research/d1-selection.png" alt="D1 matrix: dense candidates score 66.96, 71.28 and 70.89%; fused candidates 67.16, 70.97 and 71.17%; closed boundaries 68.21, 71.32 and 70.89% for retriever order, listwise and complementary selection." width="1760" height="880" loading="lazy" decoding="async" /></a>
<figcaption>Figure 2. The 3 × 3 D1 design. Read across a row for selector changes and down a column for candidate-pool changes.</figcaption>
</figure>

The selector is what matters. On dense candidates, listwise selection reaches **71.28% versus 66.96%**: **197 gains, 86 regressions, +4.32 points [2.94, 5.80], level A**. Three selected passages come within **0.97 points** of the full-document control (72.26%), and the effect holds with the other candidate pools.

Three complementary decisions do not beat one listwise decision: **48 gains and 58 regressions**, or **−0.39 points [−1.17, 0.39]**. Better boundaries help the weaker retriever-order policy, which rises to 68.21%, but under Vela selection the pool changes move accuracy by at most 0.31 points. Use Vela for the initial selection; repeated complementary selection shows no return.

Controls that fix the first passage to the dense result, permute the candidates or reverse their order score **71.01%, 70.62% and 70.51%**, differences of −0.27, −0.66 and −0.78 points from listwise, all with intervals containing zero. Those extra selection mechanics add nothing detectable.

The effect is not uniform: listwise versus dense order is **−0.37 points on the pilot** and **+4.87 on the ninety added documents**. The pooled result holds, but the small pilot alone would have told a different story. And any selector is still bounded by the evidence present among its fifteen candidates.

## D2: proof scope helps, but a text rule is very competitive

D2 classifies each question as **local extraction, existence, global absence, comparison or multiple components**. Local extraction keeps the D1 package; broader questions can trigger more reading. Existence and absence questions get passage-level decisions and a scope record passed to the generator.

For absence, the route requires coverage and legibility, and coverage is checked through the continuity of source intervals. That is a useful geometric guard, but it cannot certify that the right legal document was identified; as the [typed boolean study](/writing/legal-binary-questions-and-absence/) showed, the absence of a local match is weaker evidence than document-wide absence.

A 2 × 2 factorial design varies the local predicate (positive presence or the original question) and its aggregation (scope-aware composition or local OR). Two controls replace Vela routing with a text rule or a frequency prior.

| D2 condition | Accuracy | Difference from D1 input | 95% interval |
| --- | ---: | ---: | ---: |
| Presence + scope operator | 74.36% | +3.46 pp | [2.01, 4.94] |
| Presence + local OR | 74.05% | +3.15 pp | [1.76, 4.57] |
| Original question + scope operator | 74.05% | +3.15 pp | [1.68, 4.66] |
| Original question + local OR | 73.85% | +2.96 pp | [1.56, 4.36] |
| Text rule | 75.45% | +4.55 pp | [3.18, 5.90] |
| Frequency prior | 58.09% | −12.80 pp | [−16.56, −9.16] |

The main learned route corrects **187 answers and breaks 98**. Its routing produces 1,742 direct, 396 broad-context, 250 expansion and 182 derived-answer cases, so the stage changes both what is read and what decision information comes with it.

The learned router, however, trails the text rule by **1.09 points [−1.86, −0.32]** (56 gains, 84 regressions): level B evidence in favor of the rule, not a result that survives multiplicity correction. The scope operator and local OR, with the same presence predicate, differ by only **+0.31 [−0.39, 1.00]**, level C.

So scope-aware processing improves on its input, but this experiment does not show that learned routing or the specific operator is needed for that gain. Added context and the scope record change together, so their separate contributions remain confounded.

## D3: selective stopping, and where the pipeline gain comes from

D3 scores each evidence facet and stops when the minimum score clears **0.80**, with an extra coverage requirement for global absence. If the evidence is insufficient, the system adds neighboring or next-ranked passages up to six windows, then falls back to the full-source route or blockwise reading within the input budget.

The 0.80 threshold is a policy parameter, **not an 80% probability of being correct**; the scores depend on the instruction and the alternatives. Controls always expand to six windows, always read the full source, or match the routing frequencies with random or length-based decisions; a separate length rule uses a 65,536-character cutoff.

<figure>
<a href="/images/legal-research/d3-sufficiency.png" target="_blank" rel="noopener"><img src="/images/legal-research/d3-sufficiency.png" alt="D3 differences from the D2 package: never expand −0.39, always six +0.16, always full +0.39, calibrated +0.89, threshold +1.17, random +0.54, matched length +0.62, length rule +0.78 points, with intervals." width="1920" height="1040" loading="lazy" decoding="async" /></a>
<figcaption>Figure 3. D3 conditions against the D2 input at 74.36%. The threshold interval barely excludes zero before multiplicity correction. The two A/A controls reuse identical answers that were judged independently.</figcaption>
</figure>

The threshold policy reaches **75.53%**, **+1.17 points [0.12, 2.18]** over D2 (103 gains, 73 regressions, level B). Against always reading the full source with the D2 record, its edge is **+0.78 [0.12, 1.44]**, also level B; against matched random routing it is **+0.62 [−0.16, 1.40]**, level C. That is not a robust case for learned stopping.

The policy skips the full-source route on **590 questions (23%)** and uses it on **1,980 (77%)**. I did not measure the latency or token savings of that reduction.

| Route chosen by D3 | Questions | D3 correct | Full-context control correct | Net difference |
| --- | ---: | ---: | ---: | ---: |
| Stops before full source | 590 | 501 (84.9%) | 486 (82.4%) | +15 |
| Reads full source | 1,980 | 1,440 (72.7%) | 1,371 (69.2%) | +69 |

**Sixty-nine of the 84 net gains come from questions where the policy still reads the full source.** Most of the pipeline improvement therefore cannot be credited to stopping early. These are policy-selected groups, not randomized ones, and I have no route-specific intervals.

The chain through D3 beats the plain full-document control by **+3.27 points [1.85, 4.66]** (190 gains, 106 regressions, level A). But full source *with the D2 scope record* already reaches 74.75%, **2.49 points** above the 72.26% baseline (no interval for that decomposition); the remaining 0.78 points is the uncertain stopping increment above.

The D2 text rule scores **75.45%**, just two correct answers behind the chain (1,939 versus 1,941). That makes the simpler policy worth testing in a follow-up, although it is not a demonstration of equivalence. The pipeline also missed its target of a gain above five points: the upper bound of its interval is 4.66.

## D4: binding operands before deterministic execution

D4 targets a different legal NLP failure: finding the right amount or date but assigning it to the wrong entity, event or operation. The implementation lists candidate occurrences with their nearby entities, headers and events. Typed decisions then choose an operation (copy, sum, subtraction, count or date difference) and the ordered occurrences that serve as its operands.

The application keeps source offsets and an operand record, then runs the operation deterministically, so every number in the answer can be traced back to an occurrence. Correct arithmetic is not enough if the binding or units are wrong. Date differences return calendar days; business days would need a calendar, and conversion to months is left to the generator.

The controls take the first compatible occurrences, hide role cues during selection, or let Qwen perform the operation. Together they test whether semantic role binding and the deterministic executor actually improve answers.

| D4 condition | Accuracy | Difference from D3 | 95% interval |
| --- | ---: | ---: | ---: |
| Role binding + executor | 74.90% | −0.62 pp | [−1.91, 0.63] |
| First compatible occurrences | 75.18% | −0.35 pp | [−1.68, 0.99] |
| Role cues hidden | 75.41% | −0.12 pp | [−1.34, 1.10] |
| Operation delegated to Qwen | 74.86% | −0.66 pp | [−2.02, 0.66] |

Every interval crosses zero. The main binding condition has **116 gains and 132 regressions** against D3, and the direct mechanism comparisons are inconclusive as well: binding versus first occurrences **−0.27 [−0.92, 0.34]**, visible versus hidden roles **−0.51 [−1.14, 0.12]**, deterministic versus Qwen execution **+0.04 [−0.53, 0.61]**, all level C.

The binding route activates on only **72 questions** (2.8%). Within it, the main condition gets **32/72 correct (44.4%)** against **36/72 (50.0%)** for first occurrences; on the other 2,498 questions the counts are 1,893 and 1,896. The 248 judgments that change relative to D3 far exceed the 72 binding cases, so execution and evaluation variation outside the route also drive the overall contrast.

Sparse activation limits statistical power. Fixing all 36 errors that first occurrences make inside the route would add only **1.40 points** overall, and a gain on the scale of the 0.55-point judge noise needs about fourteen more correct answers, roughly twenty points within the route. The result shows no binding benefit, but it cannot rule one out on a large, deliberately numerical question set.

## The evaluator is part of the measurement problem

Luna judges each answer against the original question and a revised reference. Nine answers that were technically unavailable stay in the denominators. Each condition is usually judged in its own batch, and six failed judge requests inherit the judgment of an identical request. There is no validation against human judgments.

Two A/A controls expose judge variability directly. "Never expand" and D2 produce identical answers yet differ in **48 judgments**, a net **−10 answers (−0.39 points [−0.88, 0.08])**. The calibrated policy and the always-full policy also produce identical answers, but differ in **55 judgments**, **+13 answers (+0.51 points)**. Calibration never validated a stopping threshold, so that policy fell back to the full source everywhere; its higher score is not a calibration gain.

Under independent, symmetric vote flips, the judge-noise scale is roughly **±0.55 points**. It is a diagnostic, not a universal threshold or a substitute for confidence intervals, but it means small differences need replication, especially those that fail the multiple-comparison screen.

Auxiliary controls point the same way. Rewriting the generator's questions gives **72.72% (+0.47 [−0.62, 1.52])** against full context. Moving the anchor passage to the start, middle or end of the three-passage D1 package gives **71.17%, 70.97% and 71.05%**, versus 70.89% in the original order: no detectable position effect.

## What the next implementation should keep and test

The evidence supports **Vela reranking at D1** and **explicit handling of proof scope at D2**, and it supports a pipeline improvement over bounded full context on this development cohort. It does not show that complementary selection, learned scope routing, adaptive stopping or operand binding each earn their extra complexity.

A decisive next round would reuse one judge vote for identical question–reference–answer triples, confirm the main comparisons on independent documents, and cross context volume with the presence of a scope record. Evidence annotations for each subquestion would separate retrieval failures from generator failures. D4 needs a well-powered numerical subset with explicit unit handling; D3 needs its stored facet scores calibrated before another comparison with matched random routing.

For this research line, the value of System-One and typed decision models is concrete: they expose decisions that can be measured, replaced and tested one at a time. D1 shows that one such decision already improves legal evidence delivery, and the remaining controls show where further work needs stronger evidence.

*Figures are built from aggregate results. Case texts, record identifiers, individual outputs and infrastructure details are not published.*
