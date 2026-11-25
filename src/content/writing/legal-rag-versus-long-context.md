---
category: experiments
title: 'Legal NLP: how Vela reranking closes the gap to long context'
shortTitle: Vela reranking
plain: "A smarter way of choosing which passages an AI reads gets it most of the way to the accuracy of reading the whole document."
description: 'Reranking with a System-One decision model recovers 420 correct legal answers at the same three-passage budget, closing 59% of the gap between dense retrieval and full-context reading.'
pubDate: 2026-10-14
updatedDate: 2026-11-23
kind: article
tags: [Legal AI, NLP, Retrieval, System One, Decision Models, Evaluation]
image: /images/legal-research/retrieval.png
imageAlt: 'Vela reranking improves accuracy from 72.16% to 76.04%, approaching the same-generator full-context result of 78.75%.'
---

**Across 10,834 legal questions, reranking with Vela raised accuracy from 72.16% to 76.04% without giving the answer generator a single extra passage.** Full context still leads, but a better selection step makes a fixed-budget retrieval pipeline substantially stronger.

This experiment is part of my legal NLP research at **CEIA-UFG**, the Center of Excellence in Artificial Intelligence at the Federal University of Goiás.

## A decision layer between retrieval and generation

Vela is a System-One model: instead of generating text, it returns choices and scores that software can act on directly (see the [Vela3-Flash model card](https://huggingface.co/vllm-sr/vela3-flash)). Here it has one job: score candidate evidence and decide what the generator reads.

The pipeline separates three roles. Embedding similarity proposes candidate passages, the decision model judges how useful each one is for the question, and the generator writes the answer from the selected evidence. Because the selection stage returns scores rather than prose, nothing has to be parsed back into a ranking. A typed interface makes that boundary explicit, although it does not guarantee that the selected evidence is sufficient or that the scores are calibrated.

## Setup

The benchmark has **10,834 questions over 1,000 records drawn from 632 source documents**. Retrieval searches only within each question's own source document; it is not a corpus-wide search for a relevant case.

1. **Window the source.** Split each document into windows of at most 2,048 tokens with a 150-token overlap, adjusting boundaries so that no Unicode character is broken.
2. **Embed and retrieve.** Encode the windows with Qwen3-Embedding-4B (FP16, 2,560 dimensions, unit-normalized) and rank them by cosine similarity. The baseline passes the top three windows to the generator.
3. **Widen the pool.** For reranking, keep the top fifteen dense candidates, so the decision model can recover windows that the top-three cutoff would discard.
4. **Rerank with Vela.** Score the fifteen candidates locally with `vllm-sr/vela3-flash` (Vela-Flash-9B), loaded with NF4 four-bit weights and double quantization, BF16 compute and FP32 score readout, and keep the best three. The reranker generates no tokens.
5. **Answer.** Send the three passages and the question to `qwen3.8-27b`, without reasoning mode and with the same prompt as the baseline.

The generator still receives three passages; only the way they are chosen changes. Four-bit loading reduces the memory needed for the reranker's weights, and FP32 readout keeps full precision where scores are compared. I did not ablate quantization, so I make no claim about its effect on speed, memory or accuracy against an unquantized reranker.

The full-context arms work differently: each call sends a whole source document together with all of its record's questions, about eleven per call. That matters for both accuracy and token counts.

## Results

<figure>
<a href="/images/legal-research/retrieval.png" target="_blank" rel="noopener"><img src="/images/legal-research/retrieval.png" alt="Accuracy with 95% intervals: dense retrieval 72.16%, Vela reranking 76.04%, Qwen full context 78.75%, Luna full context 81.16%, Terra full context 84.11%." width="1760" height="880" loading="lazy" decoding="async" /></a>
<figcaption>Figure 1. Accuracy on 10,834 questions with 95% source-clustered bootstrap intervals. The first three conditions share the Qwen generator; Luna and Terra are different models.</figcaption>
</figure>

| Configuration | Correct / total | Accuracy | 95% interval |
| --- | ---: | ---: | ---: |
| Dense retrieval, top 3 | 7,818 / 10,834 | 72.16% | 70.92–73.45% |
| Vela reranking, 15 → 3 | 8,238 / 10,834 | 76.04% | 74.94–77.15% |
| Qwen full context | 8,532 / 10,834 | 78.75% | 77.44–80.04% |
| Luna full context | 8,793 / 10,834 | 81.16% | 79.86–82.43% |
| Terra full context | 9,113 / 10,834 | 84.11% | 82.89–85.31% |

The **3.88-point** gain recovers 420 correct answers and shrinks the gap to Qwen full context from 714 answers to 294: a **58.8% gap closure**. Measured against dense retrieval's 3,016 wrong answers, it removes **13.9% of errors**. Both figures are arithmetic on aggregate counts, not separately estimated effects with paired intervals.

Reranking also reduces a costly failure: answering that the information is absent when the document does contain the answer. Those responses fall from **1,895 to 1,488**, a drop of 407 (21.5%); Qwen full context produces 430. This is consistent with better evidence reaching the generator, although aggregate counts cannot show that these 407 cases are the same ones behind the 420-answer gain.

<figure>
<a href="/images/legal-research/retrieval-effects.png" target="_blank" rel="noopener"><img src="/images/legal-research/retrieval-effects.png" alt="Unsupported absence responses fall from 1,895 to 1,488 with Vela and to 430 with full context. Generator inputs are 55.27, 55.27 and 22.85 million tokens respectively." width="1760" height="880" loading="lazy" decoding="async" /></a>
<figcaption>Figure 2. Reranking cuts unsupported "information absent" answers while leaving generator input almost unchanged. The reranker's own local computation is not included in the right-hand panel.</figcaption>
</figure>

## Where better selection helps, and where three passages are not enough

Gains differ by question type. Date questions improve by **10.5 points**, transcription by only **1.2**. A plausible reading is that reranking helps tell competing events and dates apart, whereas exact transcription depends on whether the required text was retrieved at all. Without evidence annotations, I cannot confirm either mechanism.

On non-binary questions, accuracy goes from **70.1%** with dense retrieval to **73.9%** with reranking, against **81.4%** for full context. The remaining full-context advantage is 12.6 points for other extractions, 12.1 for amounts, 11.0 for facts, 5.8 for dates and 5.2 for entities. That is the expected limit of a reranker: it can reorder its candidate pool, but it cannot recover evidence missing from that pool or fit every required relationship into three windows.

Binary questions need a different reading. Reranking scores 80.5% against 73.2% for full context, but the reversal comes from how the references encode absence: full context answers "No" in 614 positions where the reference marks the information as absent, versus 54 for reranking. A definite "no" and "not stated" are different propositions. That observation motivated a [separate study of typed boolean decisions and absence](/writing/legal-binary-questions-and-absence/); it is not evidence that retrieval reasons better about yes/no legal questions.

## Token accounting

Dense retrieval uses **55,269,795** generator input tokens; reranking uses **55,274,356**, only 4,561 more across the whole evaluation. The accuracy gain comes at essentially no extra generator input.

Qwen full context uses **22,853,642** input tokens, so dense retrieval consumes about **2.42 times** as much. Retrieval resends passages and instructions for every question, while full context amortizes each document over all of a record's questions. Shorter calls do not imply fewer tokens across a workload.

Reranking is not free either. Vela processes **174,320,088** input tokens locally, excluding out-of-memory retries, and generates none. I did not measure end-to-end latency or energy.

## Evaluation caveats

Answers are judged by Luna under a scoring scheme (S1) that treats `NULL` and `N/A` as equivalent absence markers. Missing judgments count as incorrect: 31 for dense retrieval, 7 for reranking and 15 for Qwen full context. Source-level bootstrapping accounts for questions that share a document, but there is no paired interval for the reranking gain, and Luna also judges its own full-context baseline.

Output conventions matter a great deal. Without marker equivalence, dense retrieval drops to **57.41%**, and its transcription score falls to **18.5%** against **85.8%** for full context. That gap reflects a conflict between a general `N/A` instruction and question-level `NULL` requirements, not a difference in evidence quality.

## Takeaways

A decision model used as a reranker improves final answers at a fixed three-passage budget, closing most of the gap to full context and cutting unsupported absence answers by a fifth. That is a concrete reason to study System-One decisions *before* generation.

A cleaner follow-up would hold question batching constant, annotate evidence recall, vary the passage budget and compare quantized with unquantized reranking. The [D1–D4 study](/writing/legal-evidence-decisions-h100/) takes the next step: it separates evidence selection from proof scope, stopping and operand binding on a different development cohort, so its percentages are not directly comparable with this benchmark.

*Case texts, identifiers and individual answers are not published; the figures show aggregate measurements only.*
