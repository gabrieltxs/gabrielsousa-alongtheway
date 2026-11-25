---
category: experiments
title: 'Legal NLP: typed decisions and the meaning of absence'
shortTitle: Typed legal decisions
plain: "Asking an AI a legal yes/no question more precisely made it agree with the expected answer far more often, with the same model."
description: 'Clarifying what a legal yes/no question asks raised agreement with the reference from 36/60 to 57/60 with the same model and the same source windows. Why the proposition matters as much as the model.'
pubDate: 2026-11-03
updatedDate: 2026-11-23
kind: article
tags: [Legal AI, NLP, Decision Models, Evaluation, Evidence]
image: /images/legal-research/binary.png
imageAlt: 'Reference-polarity agreement and automatic-judge acceptance across three binary-question conditions.'
---

**With the model and the source windows held fixed, clarifying what each legal question asks raised agreement with the reference from 36/60 to 57/60.** The main intervention was not a new model but a precise statement of the document, the proposition and what a positive answer means.

This study is part of my legal NLP research at **CEIA-UFG**. It treats typed decision models as components of an evidence-processing system: the model evaluates local propositions, and software combines those evaluations into a document-level answer. Decisions came from the `typesafe-ai/jev` API through Vercel; a separate model, Luna, served as the automatic judge.

## A typed answer still needs a well-defined proposition

JEV exposes **Choice, Score and Boolean** decisions with probabilities, so an application does not have to recover a decision from generated prose ([Vercel's announcement](https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway) describes the contract). This study uses the boolean interface.

It belongs to the same research question as [System-One evidence selection with Vela](/writing/legal-rag-versus-long-context/): which decisions can be made explicitly, before or instead of answer generation? JEV is the decision model tested here; this is not a Vela experiment or a comparison of the two architectures.

The design separates uncertain semantic detection from deterministic composition. The model judges whether a proposition is supported in a window. Software applies a threshold, combines the window results, tracks coverage and maps the result to the requested polarity. A boolean type rules out malformed answers; it does not resolve an ambiguous proposition, establish calibration or guarantee a correct legal interpretation.

For example, "the supplied text does not mention an issue" is not the same as "the court failed to address that issue." The second may require the wider procedural record and legal interpretation. A probability returned for one proposition is not evidence for the other.

## Setup: same documents, same windows

The cohort has **60 direct binary questions across six documents**; complex questions follow a separate route and are excluded. Each question is evaluated over one to thirteen windows of up to **24,000 UTF-8 bytes** with **300 characters of overlap**, and all three conditions reuse the same **150 window intervals**.

The model returns a probability for each local boolean decision, with **0.5** as the positive threshold. Every window is evaluated, including those after a positive result. The route makes no embedding, retrieval or answer-generation calls.

There are three conditions:

1. **Original questions, repeated:** a fresh run of the existing wording and aggregation.
2. **Clarified wording + OR:** revised propositions with the original aggregation.
3. **Clarified wording + absence operator:** revised propositions with scope-consistent aggregation for absence.

Thirty-two questions are unchanged. Twenty-four questions about one appellate document are clarified because they had been asking about a trial-level judgment; the rewrite also makes "yes" mean textual absence within the supplied scope rather than a legal finding of omission. Four more edits clarify relationships between entities and events.

Identical requests are cached: 450 logical window evaluations need only **223 JEV calls**, and 180 logical judgments need **84 Luna calls**. Caching guarantees identical results for identical requests and avoids redundant calls; I did not measure its effect on latency.

## Why absence needs a different operator

For a positive existence proposition, one supported occurrence is enough, so the document-level decision is OR over the window decisions. For absence, the system instead evaluates **presence** in every window and negates the combined result:

```text
present[j] = presence_probability(window[j], proposition) >= 0.5
exists = any(present)

if question_asks_absence:
    if coverage_is_incomplete:
        return no_decision
    return not exists
return exists
```

The pseudocode shows the logical contract, not the experiment's API code. The absence condition makes **fresh presence evaluations**; it does not invert old probabilities obtained for differently worded questions. A missing window blocks the absence decision, because coverage is an application-level constraint, not a confidence score from the model.

OR over local absence judgments is logically fragile: a window that happens not to mention the topic triggers a positive answer even when a later window does mention it. Negating aggregated presence avoids that composition error, but false negatives remain possible, and reading every window does not prove that the right legal document was selected.

## Two measurements, two different criteria

<figure>
<a href="/images/legal-research/binary.png" target="_blank" rel="noopener"><img src="/images/legal-research/binary.png" alt="Polarity agreement is 60%, 96.7% and 95%; Luna acceptance is 60%, 85% and 83.3%, for the repeated, clarified-OR and absence-operator conditions." width="1760" height="880" loading="lazy" decoding="async" /></a>
<figcaption>Figure 1. Agreement with the reference polarity and acceptance by the automatic judge measure different things. Results come from a development cohort; no held-out performance is implied.</figcaption>
</figure>

| Condition | Polarity matches | Luna-accepted | Yes-class recall | No-class recall | Balanced accuracy |
| --- | ---: | ---: | ---: | ---: | ---: |
| Original, repeated | 36 / 60 | 36 / 60 | 11 / 33 | 25 / 27 | 63.0% |
| Clarified wording + OR | 58 / 60 | 51 / 60 | 33 / 33 | 25 / 27 | 96.3% |
| Clarified + absence operator | 57 / 60 | 50 / 60 | 31 / 33 | 26 / 27 | 95.1% |

Balanced accuracy averages recall over the 33 "yes" and 27 "no" references. The original system's weakness was the positive class: only 11 of 33 "yes" answers matched. The corrected procedure raises that to 31 and also improves the "no" class from 25 to 26, so the gain is not an artifact of predicting the majority class.

Against the repeated run, the full correction produces **21 gains and no regressions**, a **35.0-point** improvement with a document-bootstrap 95% interval of **0.0–69.8 points**. Clarified wording with OR gives 23 gains and one regression, **+36.7 points** (interval 0.0–72.4). With only six source documents, the intervals are wide even when the question-level change is large.

An earlier run of the original questions scored 35/60, against 36/60 on repetition; relative to it, the full correction repairs 22 of 25 errors and keeps all 35 correct decisions. The fresh repetition remains the main comparator because it separates the intervention from run-to-run variability.

After rewriting, Luna accepts fewer answers than polarity agreement suggests: 51 rather than 58, and 50 rather than 57. The judge sees the reference and the answer **but not the question**, so an explanatory reference can lead it to reject an answer whose yes/no polarity is correct. The two criteria disagree in fourteen logical evaluations, and neither should silently replace the other.

## Most of the gain comes from scope and wording

| Document group | Questions | Original, repeated | Clarified + OR | Absence operator |
| --- | ---: | ---: | ---: | ---: |
| Document with scope mismatch | 24 | 2 correct | 23 correct | 22 correct |
| Remaining documents | 36 | 34 correct | 35 correct | 35 correct |

The gain is concentrated in one document, and that document has **one window per question**, so its improvement cannot show a benefit from multi-window aggregation. What it shows is that a typed decision model answers a well-specified proposition far more reliably. All 32 unchanged questions stay correct in every condition.

The one-answer edge of clarified OR over the absence operator does not make OR over local absence judgments logically sound. Switching to presence predicates changes the model's semantic task as well as the operator, and the cohort has too few informative multi-window absence cases to isolate that effect.

The remaining errors show where types stop helping. One multi-window error has a positive score of **0.57**, just above the threshold; two disputed presence detections score **0.72 and 0.61**. Structurally valid booleans can still be semantically wrong, and these scores say nothing about calibration on new legal documents.

## What this means for typed legal decision systems

A useful implementation separates three responsibilities: **define the proposition, evaluate local evidence, and compose a decision under explicit scope rules**. Failures then become inspectable. Was the wrong legal object queried, did presence detection fail, or did the program combine correct local detections incorrectly?

The questions were rewritten after inspecting errors and references, so these results show progress on a development cohort, not generalization. The next evaluation needs independent documents, more multi-window absence cases, a judge that sees the question, and separate annotations for local presence and complete coverage.

The same lesson carries into the [D1–D4 evidence-decision study](/writing/legal-evidence-decisions-h100/): a typed interface makes a policy precise enough to test, and controlled comparisons then show whether the learned decision adds value beyond a simpler rule.

*Only aggregate measurements and generic logical examples are published; case identifiers, case-specific questions and individual outputs are omitted.*
