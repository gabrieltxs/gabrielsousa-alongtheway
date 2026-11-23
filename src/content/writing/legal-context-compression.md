---
title: 'Compressing legal context: what survives, what breaks, and what it saves'
shortTitle: Legal context compression
description: 'Protected spans plus LLMLingua-2 cut generator input by 39.20% for a 3.24-point accuracy loss on 10,834 legal questions. Where the savings come from, and why numbers and dates break first.'
pubDate: 2026-11-23
kind: article
tags: [Legal AI, NLP, Context Compression, LLMLingua, Evaluation, Evidence]
image: /images/legal-research/compression-pipeline.png
imageAlt: 'Compression pipeline: legal source, protection mask, LLMLingua-2 selection, reconstruction and compressed text, which the generator reads together with the questions.'
---

**Selective compression cut generator input by 39.20% and recorded generator cost by 38.37%, while accuracy fell from 84.87% to 81.63%.** That is a useful efficiency trade-off, but the paired error analysis shows its limits: numbers and dates are far more fragile than yes/no answers, and keeping a value does not guarantee keeping the relationship that makes it usable evidence.

This study is part of my legal NLP research at **CEIA-UFG**. It combines deterministic protection of selected source spans with **LLMLingua-2**, then compares the compressed context with full documents, protected spans alone and retrieval. The question is how much context can be removed while keeping the evidence needed to answer legal questions.

## The experimental unit

The corpus has **1,000 records, 632 distinct legal texts and 10,834 questions**. Full-context inference sends a document together with all of its record's questions. The compressed variants keep that structure: each source is compressed once and reused for every record that contains it.

Deduplicating the 632 texts avoids repeated compression work, but it does not remove records or questions from the evaluation. Accuracy is always computed over all **10,834 questions**, with failures counted as incorrect.

The protection rules were informed by the question inventory. After normalizing case and whitespace, it contained 1,327 distinct formulations. Format instructions such as "only" and "answer" were frequent, alongside references to parties, amounts, identifiers and contracts, which motivated rules that keep such evidence together with its nearby context. Frequency alone, of course, does not ensure that the rules cover every fact a later question will need.

A crucial design choice is that **protection and compression do not depend on the questions asked at inference time**. The generator receives the questions only after the compressed document has been rebuilt. That makes compression reusable, but it makes less predictable evidence harder to preserve.

## Implementation: protect first, then select from the rest

<figure>
<a href="/images/legal-research/compression-pipeline.png" target="_blank" rel="noopener"><img src="/images/legal-research/compression-pipeline.png" alt="Compression pipeline: legal source text, a rule-based protection mask, LLMLingua-2 selection of free subtokens, reconstruction in original order, and compressed text that the Qwen generator reads together with the record's questions." width="1760" height="860" loading="lazy" decoding="async" /></a>
<figcaption>Figure 1. Protected spans are fixed before neural selection, and the questions enter only at the generator.</figcaption>
</figure>

The protection layer keeps the **first 2% of Qwen tokens** and applies regular expressions for requests, powers of attorney, procedural roles, identifiers, amounts, dates, receipts and negations. Each match is expanded into nearby context, with caps on span length and on the number of spans per category. A power-of-attorney role, for instance, keeps ninety characters on either side; a short negation keeps eight characters before and sixteen after. These are engineering heuristics, not guarantees that a whole legal relation fits inside the protected window.

The implementation juggles three coordinate systems: Qwen tokens for the protected prefix, character offsets for the mask and reconstruction, and XLM-RoBERTa subtokens for the neural retention decisions. Keeping them explicit matters, because a subtoken can overlap a protected span without lying entirely inside it.

The union of protected intervals forms a **character-level mask**. LLMLingua-2, which treats compression as token classification with bidirectional context ([Pan et al., 2024](https://aclanthology.org/2024.findings-acl.57/)), uses an **XLM-RoBERTa-large** encoder over windows of up to **510 subtokens** to estimate retention probabilities. Let **U** be the subtokens entirely outside the mask: the procedure keeps the **ceil(0.375 × |U|)** highest-scoring of them, breaking ties by position, and keeps every subtoken that touches the mask. Reconstruction follows the original offsets, normalizes whitespace in the free regions and verifies that protected passages were copied verbatim.

This is extractive compression: the neural component selects source material instead of writing a summary. The verification step checks that designated spans survive; it cannot check that every necessary span was designated, or that the rebuilt text preserves the relationships between surviving fragments.

The **37.5% rate applies only to free subtokens**, not to the whole document or the final prompt. Protected spans, questions, instructions and differences between tokenizers all affect the total, which is why the measured input reduction is 39.20% rather than 62.5%.

A protected-only ablation keeps the same mandatory spans, drops everything else and runs no neural model. It measures how much useful information lies outside the rule-selected regions.

## Results: most of the accuracy with less input

| Method | Correct / 10,834 | Accuracy | Generator input | Relative to full context |
| --- | ---: | ---: | ---: | ---: |
| Qwen, protected spans only | 7,990 | 73.75% | 6.84M tokens | 30.6% |
| Qwen, protection + LLMLingua-2 | 8,844 | 81.63% | 13.60M tokens | 60.8% |
| Qwen, RAG top-3 | 8,874 | 81.91% | 73.44M tokens | 328.2% |
| Qwen, RAG top-6 | 9,049 | 83.52% | 110.28M tokens | 492.9% |
| Qwen, full context | 9,195 | 84.87% | 22.38M tokens | 100.0% |
| Luna, full context | 9,440 | 87.13% | 22.38M tokens | 100.0% |

Input is counted with **o200k_base** over the content of every message (system instructions, questions and context) once per logical request, so the identical Qwen and Luna full-context prompts are directly comparable. All Qwen arms use the same generator, Qwen 3.8-27B. Luna is a different model and also serves as the judge, so its higher score does not isolate a context-management effect, and self-evaluation is a limitation of that comparison.

Relative to Qwen full context, protected LLMLingua-2 loses **351 net correct answers (3.24 points)** while removing about **8.78 million input tokens**. Protected-only compression saves more input, **69.42%**, but loses **1,205 net correct answers (about 11.12 points)**.

Adding the neural selection on top of the mask recovers **854 correct answers (+7.88 points)** for about **6.76 million extra tokens**. That supports the value of information outside the protected regions; it does not show that LLMLingua-2 is the best selector at that budget, because no alternative selector was tested at equal cost.

### Why retrieval uses more input here

The RAG variants use **Qwen3-Embedding-4B**, 2,048-token chunks with a 150-token overlap, and one generator call per question. Full and compressed context answer all of a record's questions in one call. Retrieval therefore repeats instructions and passages across **10,834 calls**, against **1,000** for the record-level arms.

Top-3 retrieval gets only **30 more correct answers** than protected LLMLingua-2 (+0.28 points) while using about **5.4 times** as much input. Going from three to six passages adds **175 correct answers (+1.62 points)** for about **36.84 million** more tokens, and top-6 still trails Qwen full context by **146 answers (1.35 points)** while consuming about **4.93 times** its input. These contrasts describe the workloads as implemented: they do not separate retrieval from question batching, and they are not a general efficiency ranking of RAG systems.

The [Vela retrieval study](/writing/legal-rag-versus-long-context/) uses different baselines and token accounting, so its percentages should not be merged with this table or read as a before-and-after comparison.

## The accuracy–input frontier

<figure>
<a href="/images/legal-research/compression-frontier.png" target="_blank" rel="noopener"><img src="/images/legal-research/compression-frontier.png" alt="Scatter of accuracy against generator input: protected spans only at 73.75% and 6.84M tokens, protection plus LLMLingua-2 at 81.63% and 13.60M, Qwen full context at 84.87% and 22.38M, Luna full context at 87.13% and 22.38M, RAG top-3 at 81.91% and 73.44M, RAG top-6 at 83.52% and 110.28M." width="1760" height="920" loading="lazy" decoding="async" /></a>
<figcaption>Figure 2. Higher and further left is better. Rings mark configurations that no other tested configuration beats on both axes. Point estimates only; no uncertainty intervals.</figcaption>
</figure>

A configuration is non-dominated when no other tested configuration has at least as much accuracy with no more input, and is strictly better on one of the two. On these point estimates, protected-only, protected LLMLingua-2 and Luna full context form the frontier; restricted to Qwen, its full-context arm joins the two compression variants. Both RAG configurations are dominated by Qwen full context.

There is no universal winner. Protected-only uses the least input and gives up the most accuracy, protected LLMLingua-2 sits in between, and full context keeps the most correct answers. A two-axis plot also leaves out price, latency, local processing and operational constraints: Luna dominates Qwen on accuracy and input, yet Qwen is cheaper.

## What the paired errors reveal

Overall accuracy hides movement in both directions. Of Qwen full context's **9,195 correct answers**, protected LLMLingua-2 keeps **8,630 (93.86%)**. It loses **565** previously correct answers and gains **214** where the baseline was wrong:

**9,195 − 565 + 214 = 8,844.**

So the net loss of 351 understates how many answers were harmed. Nor are all 214 gains genuine improvements: **191** replace answers judged incorrect, while **23** recover questions affected by technical failures or missing judgments. Of the 565 losses, **562** are judged incorrect and **three** lack a valid judgment.

| Category | Questions | Full context correct | LLMLingua-2 correct | Losses / gains | Loss risk among previously correct |
| --- | ---: | ---: | ---: | ---: | ---: |
| Textual | 5,645 | 4,418 | 4,261 | 303 / 146 | 6.86% |
| Numerical / calculation | 1,206 | 1,044 | 903 | 167 / 26 | 16.00% |
| Date / time | 620 | 531 | 495 | 49 / 13 | 9.23% |
| Binary | 3,363 | 3,202 | 3,185 | 46 / 29 | 1.44% |
| Total | 10,834 | 9,195 | 8,844 | 565 / 214 | 6.14% |

"Loss risk" divides losses by the answers that were correct under full context. It is neither the category's final error rate nor its share of all losses.

<figure>
<a href="/images/legal-research/compression-loss-risk.png" target="_blank" rel="noopener"><img src="/images/legal-research/compression-loss-risk.png" alt="Loss risk for LLMLingua-2 versus protected-only: textual 6.86% versus 16.75%, numerical 16.00% versus 37.93%, date/time 9.23% versus 33.52%, binary 1.44% versus 4.37%." width="1760" height="880" loading="lazy" decoding="async" /></a>
<figcaption>Figure 3. Share of previously correct answers lost, by question category. Labels show the paired counts, so each denominator is explicit.</figcaption>
</figure>

Textual questions have the most losses in absolute terms (**303**), but they are also the largest category. Numerical questions are the most fragile: **167 of 1,044** previously correct answers are lost (**16.00%**), against **49 of 531** for dates (**9.23%**). Together, these two categories make up about **16.9% of the questions but 38.2% of the losses**.

The protected-only ablation amplifies the pattern, with loss risks of **37.93%** for numerical questions and **33.52%** for dates, and **1,454 losses against 249 gains** overall (34 of the losses lack a valid judgment). Rules alone keep useful anchors but not enough of the surrounding evidence.

The categories describe question format, not clean cognitive operations: a "textual" question may have several parts or require arithmetic. And the low risk for binary questions does not prove that every negation survives.

## Four failure mechanisms

I audited four deliberately chosen failures against both the original and the compressed text. They illustrate mechanisms, not how often each occurs, and are described here without identifiers, literal case text, exact dates or amounts.

**A time expression is cut in half.** Compression keeps the hour but removes the minutes. The generator fills in zero minutes, and a later time calculation propagates the error. Time expressions should be treated as atomic units.

**A value survives, but its label does not.** An amount remains while part of the section heading that gives it a legal role disappears, and the generator answers that the information is absent. Protecting digits alone does not let the reader bind them to the right category.

**The evidence survives, but selection still fails.** Both the requested value and a competing one remain, next to shortened labels, and the generator picks the wrong one. Removal of the correct value cannot explain this case; loss of table structure is a plausible contributor, but I have not established it.

**Literal fidelity is lost.** A legal title loses connecting words and punctuation, and the answer repeats the shortened form. A request for exact wording can fail even when the meaning largely survives, so exact transcription needs its own preservation checks.

These failures connect to the [D1–D4 study of evidence decisions](/writing/legal-evidence-decisions-h100/): usable evidence includes identity, scope and relationships. Compression works at a different level, token retention, but can damage the same relationships that a later decision or answer model depends on. I have not yet tested compression and Vela reranking together.

## Cost, local execution and latency

Recorded generator cost uses each provider's native accounting, including input, output and cache, for the last attempt of each request. It excludes earlier attempts, evaluation and local processing, and one Qwen timeout has no receipt. These are historical costs for this experiment, not current prices or a complete bill.

| Method | Recorded generator cost | Median generator-call latency | Generator requests |
| --- | ---: | ---: | ---: |
| Qwen, protected spans only | $0.540 | 5.26 s | 1,000 |
| Qwen, protection + LLMLingua-2 | $1.246 | 6.03 s | 1,000 |
| Qwen, RAG top-3 | $2.958 | 3.55 s | 10,834 |
| Qwen, RAG top-6 | $7.108 | 3.61 s | 10,834 |
| Qwen, full context | $2.023 | 12.06 s | 1,000 |
| Luna, full context | $2.676 | Not measured | 1,000 |

Protected LLMLingua-2 saves **38.37%** of recorded generator cost (computed before rounding, so the displayed totals do not reproduce it exactly). The median generator call falls from **12.06 to 6.03 seconds**, a 50% reduction in that statistic, which is not the same as a 2× speedup of the whole workload.

Compressing all **632 texts took 366.04 seconds after loading the weights**, a median of **0.266 seconds** per text, on a local GPU whose cost I did not measure. Because compressed contexts are reused, that work is not repeated for each record.

RAG's shorter calls must be read alongside its far larger request count. Multiplying medians by request counts would not give batch duration under concurrency, and adding a median compression time to a median generation time would not give end-to-end latency. What the measurements do show is reusable compression, lower total generator input and a faster median generator call under this workload.

## What the study supports, and what to test next

Protected LLMLingua-2 is a measured intermediate operating point: **39.20% less input while keeping 93.86% of the baseline's correct answers**, for a net loss of 3.24 points once gains are counted. Its advantage over protected-only shows that useful evidence extends beyond the deterministic mask, and the paired analysis points to numerical and temporal relations as the priorities.

There are no confidence intervals or repeated runs. Repeated sources and related questions are not independent observations, some transitions involve technical failures, and apparent gains could reflect less distracting context or generator and judge variation.

The next experiments should target the mechanisms directly:

1. **Atomic entities.** Preserve complete times, dates, amounts, identifiers and titles, including separators and connecting words, and measure recovered answers against added tokens.
2. **Local relationships.** Protect section headers, label–value pairs, table headers and row boundaries, and compare against fixed character windows at the same token budget.
3. **Causal restoration.** Reinsert only the removed material in audited failures and rerun inference alongside unchanged controls, to separate removal effects from run-to-run variation.
4. **Independent validation.** Compare mask variants on new sources with repeated runs and paired source-level analysis, reporting quality, technical failures, tokens, latency and full processing cost separately.

The engineering challenge is to preserve complete evidence relationships selectively. Expanding every protected region would erode the savings that make compression worth doing.

*Only aggregate results and a generic pipeline are published. The audited failures are described at the level of mechanisms, without identifiers or source passages.*
