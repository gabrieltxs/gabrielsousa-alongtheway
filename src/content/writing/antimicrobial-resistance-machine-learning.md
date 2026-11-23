---
title: 'From genomes to resistance predictions: my undergraduate machine learning research'
shortTitle: Genomes and resistance
description: 'My 2022 Computer Engineering thesis used k-mer representations and six classifiers to predict antimicrobial resistance in Pseudomonas aeruginosa. The methods, the results, and what I would do differently.'
pubDate: 2026-11-23
kind: article
tags: [Machine Learning, Bioinformatics, Antimicrobial Resistance, Evaluation, Undergraduate Research]
image: /images/amr-research/undergraduate-defense.jpeg
imageAlt: 'Group photograph at the undergraduate thesis defense at PUC Goiás, with the research presentation projected behind the group.'
---

For my **Computer Engineering thesis at PUC Goiás** in 2022, I asked whether whole-genome sequence representations could predict antimicrobial resistance in *Pseudomonas aeruginosa*. The project connected public genomic data, feature engineering and supervised learning: turn each genome into a **k-mer frequency vector**, then compare six classifiers across four antibiotics.

The best mean F1 was **0.79, for Gradient Boosting on tobramycin**, and Gradient Boosting had the highest average across the four antibiotics (**0.76**). The results also showed large differences between antibiotics and between metrics. This was an offline classification study; it did not evaluate patient outcomes or clinical use.

The thesis was approved on **December 8, 2022**, and the [full text is available in the PUC Goiás repository](https://repositorio.pucgoias.edu.br/jspui/handle/123456789/5118). This retrospective revisits its implementation and findings, and separates the original results from what I would read differently today.

<figure>
<a href="/images/amr-research/undergraduate-defense.jpeg" target="_blank" rel="noopener"><img src="/images/amr-research/undergraduate-defense.jpeg" alt="Group photograph at PUC Goiás during the undergraduate thesis defense, with the antimicrobial-resistance research presentation on the screen." width="1280" height="805" loading="eager" decoding="async" /></a>
<figcaption>At my undergraduate thesis defense at PUC Goiás, December 8, 2022.</figcaption>
</figure>

## The question

The target was an antibiotic-specific phenotype, **resistant or susceptible**, for **meropenem, ceftazidime, tobramycin and ciprofloxacin**. Each genome was represented numerically, and its recorded susceptibility supplied the label.

The representation used sequence-wide k-mer counts instead of a hand-picked list of resistance genes. That kept feature construction general, since the same representation could be paired with any antibiotic label, but it also created a hard statistical problem: a huge number of possible features and comparatively few labeled isolates. Good predictions alone do not identify which genomic features cause resistance, and the thesis did not validate causal markers.

## Data: from 414 isolates to 238

Genomes and phenotypes came from the public **PATRIC** resource, using the cohort of the study identified by **PMID 32048461**: 414 isolates collected in European clinical and university settings. That study measured the susceptibilities; my project reused the data for computational analysis.

To get clean binary tasks, I excluded every isolate with an **intermediate phenotype for any of the four antibiotics**, reducing the shared cohort from **414 to 238 isolates**. That removed about **42.5%** of the original cohort, so a model evaluated on the remaining resistant and susceptible cases says nothing about the excluded intermediate ones.

<figure>
<a href="/images/amr-research/amr-phenotypes.png" target="_blank" rel="noopener"><img src="/images/amr-research/amr-phenotypes.png" alt="Stacked bar chart of resistant and susceptible phenotype counts for the four antibiotics after excluding isolates with intermediate labels." width="1322" height="404" loading="lazy" decoding="async" /></a>
<figcaption>Figure 1. Resistant (yellow) and susceptible (teal) isolates per antibiotic in the retained cohort. Class balance differs by antibiotic even though the isolates are the same. Figures in this post come from the original thesis and keep its Portuguese labels.</figcaption>
</figure>

The class balance matters when reading the metrics: a similar F1 on two antibiotics does not mean the two problems have the same class proportions or difficulty.

## Representation: genomes as k-mer counts

A k-mer is a contiguous substring of length **k**. A window slides one position at a time along the sequence, and the resulting substrings are counted, so each genome becomes a vector of frequencies. The representation keeps local sequence patterns and discards their global order.

<figure>
<a href="/images/amr-research/amr-kmer-diagram.png" target="_blank" rel="noopener"><img src="/images/amr-research/amr-kmer-diagram.png" alt="Illustrative k-mer diagram showing a sliding window of length four and a table of substring frequencies across genome files." width="1772" height="794" loading="lazy" decoding="async" /></a>
<figcaption>Figure 2. How a sliding window of length k = 4 turns sequences into a frequency table (rows are samples, columns are k-mer counts). The experiments themselves used k from 5 to 9.</figcaption>
</figure>

The engineering trade-off is exponential growth: with four DNA bases there are **4^k possible k-mers**.

| k | Possible DNA k-mers | Columns in the generated table |
| --- | ---: | ---: |
| 5 | 1,024 | 1,025 |
| 6 | 4,096 | 4,097 |
| 7 | 16,384 | 16,385 |
| 8 | 65,536 | 65,537 |
| 9 | 262,144 | 262,145 |

The vocabulary grows **256-fold from k = 5 to k = 9**. Everything ran on a **four-core Intel Core i5-6500 with 16 GB of RAM**, and memory is what capped the experiments at k = 9: a small increase in substring length can blow up the feature space before any classifier is trained. And with only 238 isolates, a higher-dimensional representation does not create more independent training examples.

## Six classifiers on a shared representation

Training used **scikit-learn**, with an **80/20 train/test split** and **10-fold cross-validation**:

| Classifier | Main settings |
| --- | --- |
| AdaBoost | 50 estimators, learning rate 1.0, SAMME.R |
| Bagging | 10 estimators, sample and feature fractions of 1.0 |
| Gradient Boosting | 100 estimators, learning rate 0.1, maximum depth 3 |
| Support Vector Classifier | RBF kernel, C = 1.0, gamma = scale |
| Logistic Regression | L2 penalty, C = 1.0, lbfgs solver, 100 iterations |
| Random Forest | 100 trees, Gini criterion, square-root feature sampling |

The comparison spans linear, kernel and ensemble methods on the same features, mostly with default settings rather than exhaustive tuning. Looking back, the protocol is also under-documented: the thesis does not spell out how the split and the cross-validation were combined, and it does not record split assignments or random seeds. The tables below are the results as reported, not an independently verified or nested-validation estimate.

## Result 1: longer k-mers generally helped, but not uniformly

<figure>
<a href="/images/amr-research/amr-f1-kmer.png" target="_blank" rel="noopener"><img src="/images/amr-research/amr-f1-kmer.png" alt="Four-panel chart of F1 versus k-mer length from five to nine for meropenem, ciprofloxacin, ceftazidime and tobramycin, comparing six classifiers." width="1281" height="971" loading="lazy" decoding="async" /></a>
<figcaption>Figure 3. F1 against k-mer length, one panel per antibiotic. The broad trend favors longer k-mers within the tested range, but individual curves fluctuate.</figcaption>
</figure>

Longer local patterns carried useful signal in this cohort. At k = 9, most mean F1 scores lie between **0.70 and 0.79**; ceftazidime is harder, at **0.60 to 0.72**. Some methods peak earlier or fluctuate, especially for ceftazidime and tobramycin, and nothing beyond k = 9 was tested, so further gains at larger k remain a hypothesis. More specific patterns could help discrimination, but the larger vocabulary also raises the cost and makes models harder to estimate from limited data.

## Result 2: the best model depends on the antibiotic

<figure>
<a href="/images/amr-research/amr-f1-heatmap.png" target="_blank" rel="noopener"><img src="/images/amr-research/amr-f1-heatmap.png" alt="Heatmap of mean F1 at k equals nine: Gradient Boosting reaches 0.79 for tobramycin, AdaBoost reaches 0.72 for ceftazidime, and several methods tie on other tasks." width="1760" height="960" loading="lazy" decoding="async" /></a>
<figcaption>Figure 4. Mean F1 at k = 9. Bold values mark the highest mean for each antibiotic: point-estimate rankings, not statistically established differences.</figcaption>
</figure>

| Classifier | Meropenem | Ceftazidime | Tobramycin | Ciprofloxacin |
| --- | ---: | ---: | ---: | ---: |
| AdaBoost | 0.77 ± 0.08 | 0.72 ± 0.09 | 0.74 ± 0.09 | 0.76 ± 0.05 |
| Bagging | 0.75 ± 0.04 | 0.60 ± 0.12 | 0.75 ± 0.13 | 0.72 ± 0.08 |
| Gradient Boosting | 0.77 ± 0.07 | 0.70 ± 0.08 | 0.79 ± 0.07 | 0.78 ± 0.07 |
| SVC | 0.76 ± 0.10 | 0.65 ± 0.07 | 0.77 ± 0.05 | 0.78 ± 0.05 |
| Logistic Regression | 0.76 ± 0.10 | 0.65 ± 0.08 | 0.77 ± 0.06 | 0.77 ± 0.05 |
| Random Forest | 0.77 ± 0.08 | 0.65 ± 0.08 | 0.73 ± 0.06 | 0.77 ± 0.04 |

Values are mean ± standard deviation at k = 9; the standard deviations are not confidence intervals for differences between classifiers. Three things stand out:

- **Gradient Boosting is the strongest overall F1 baseline**, with a simple average of 0.760 across the four tasks against about 0.748 for AdaBoost. These are averages of four task means, not pooled F1 scores.
- **AdaBoost leads on ceftazidime**, 0.72 against 0.70 for Gradient Boosting and 0.60 for Bagging, but the variation is too large to call this a model-family advantage.
- **Many differences are small or tied.** Meropenem reaches 0.77 with AdaBoost, Gradient Boosting and Random Forest; ciprofloxacin reaches 0.78 with Gradient Boosting and SVC. A single "winning model" label would hide this.

F1 is the harmonic mean of precision and recall, so an F1 of 0.79 is **not 79% accuracy**: it measures a particular balance of classification errors, not the share of decisions that would be correct.

## Result 3: more samples helped, with unstable intermediate points

<figure>
<a href="/images/amr-research/amr-learning-curves.png" target="_blank" rel="noopener"><img src="/images/amr-research/amr-learning-curves.png" alt="Learning curves at k equals nine, with sample counts from forty to 238; results generally improve with more samples but show dips and task-specific fluctuations." width="1281" height="996" loading="lazy" decoding="async" /></a>
<figcaption>Figure 5. Learning curves at k = 9, from 40 to 238 isolates. Point estimates only, without uncertainty bands.</figcaption>
</figure>

The curves generally rise as samples are added, most visibly from the smallest subsets. Ceftazidime stays difficult, and several curves dip at intermediate sizes, as one would expect in a small-data experiment where subset composition can move the result. The thesis discussed a possible plateau near the largest sizes; today I would read it more narrowly. Some curves flatten within the observed range, but **238 isolates do not establish a saturation point**, and more diverse isolates could change both performance and the ranking of models.

Varying the sample size alongside the model was a useful part of the design: more specific features and more independent examples address different constraints, and one cannot substitute for the other.

## Result 4: ROC-AUC changes the reading of F1

<figure>
<a href="/images/amr-research/amr-roc.png" target="_blank" rel="noopener"><img src="/images/amr-research/amr-roc.png" alt="ROC curves for four antibiotic tasks: meropenem curves are close to the diagonal, tobramycin shows stronger separation, and ceftazidime and ciprofloxacin are intermediate." width="1281" height="996" loading="lazy" decoding="async" /></a>
<figcaption>Figure 6. ROC curves per antibiotic; the diagonal marks chance-level ranking. Exact AUC values are in the table below.</figcaption>
</figure>

| Classifier | Meropenem AUC | Ceftazidime AUC | Tobramycin AUC | Ciprofloxacin AUC |
| --- | ---: | ---: | ---: | ---: |
| AdaBoost | 0.581 | 0.675 | 0.847 | 0.760 |
| Bagging | 0.542 | 0.718 | 0.753 | 0.742 |
| Gradient Boosting | 0.611 | 0.777 | 0.873 | 0.814 |
| SVC | 0.515 | 0.629 | 0.813 | 0.739 |
| Logistic Regression | 0.592 | 0.699 | 0.879 | 0.737 |
| Random Forest | 0.597 | 0.703 | 0.826 | 0.751 |

**Tobramycin has the strongest discrimination**: Logistic Regression reaches the highest AUC, **0.879**, with Gradient Boosting close at 0.873. Gradient Boosting has the best AUC on the other three antibiotics and the best average across all four (about **0.769**).

**Meropenem is the clearest warning against reading F1 alone.** Its F1 means sit around 0.75–0.77, yet its AUC ranges only from **0.515 to 0.611**, far weaker ranking than the F1 table suggests. F1 depends on the decision threshold and on how classes are treated, while ROC-AUC measures ranking across all thresholds, and class balance affects how a fixed-threshold F1 should be read. The thesis does not document F1 averaging, the positive-class convention or aligned per-sample outputs in enough detail to pin down the cause, so the discrepancy deserves investigation rather than a ready-made explanation.

## What I would carry into a stronger follow-up

The project showed that a single genomic representation can support a systematic comparison: four phenotype tasks, six model families, and analyses of both representation size and data size. It is not, however, a complete replication package. A follow-up should make the evaluation protocol and the failure analysis as explicit as the feature construction:

1. **Freeze and document the splits.** Record seeds, preprocessing, class conventions and how model selection relates to the test set, and test generalization on independent sources with partitions that account for related isolates.
2. **Report complementary metrics together.** Per-class precision and recall, confusion matrices, the F1 averaging convention and ROC-AUC on aligned predictions, with uncertainty, before treating close rankings as meaningful.
3. **Audit the excluded population.** Measure how dropping all intermediate isolates changes the task, and which conclusions still hold beyond the filtered cohort.
4. **Use representations more efficiently.** Explore memory-efficient feature construction and compare representations at explicit resource budgets, rather than assuming that a larger k always helps.
5. **Test biological interpretability separately.** Comparing against known resistance genes and alternative encodings could show whether predictive features carry interpretable signal.

The lasting lesson is that representation, sample selection and metric choice together determine what a machine learning result means.

## Acknowledgments

I am grateful to my supervisor, **Professor Clarimar José Coelho**, for his guidance, and to my co-supervisor, **Walcy Santos Rios** (CEIA-UFG), for his support and encouragement throughout the research. I also thank **Rafael Viana de Carvalho** and **Douglas Vieira do Nascimento**, members of the examining committee, for evaluating the work. Defending this project marked the end of my undergraduate research in Computer Engineering.

*Reference: Gabriel Teixeira Andrade Sousa, "Predição de resistência antimicrobiana em Pseudomonas aeruginosa com aprendizagem de máquina," undergraduate thesis, PUC Goiás, 2022. [Repository record](https://repositorio.pucgoias.edu.br/jspui/handle/123456789/5118) · [Full text (PDF)](https://repositorio.pucgoias.edu.br/jspui/bitstream/123456789/5118/1/TCC_Gabriel%20-%20Corrigido.pdf). No individual isolate records are published here.*
