---
category: research-notes
title: How to write a post on this site
description: A template that shows everything a post can contain. Copy this file, rename it and replace the text.
pubDate: 2026-11-21
# updatedDate: 2026-12-01   (optional: shown as "Updated ..." beside the post)
kind: article # 'article' for long pieces, 'note' for short ones
tags: [Site news]
# Drafts are visible while you run `npm run dev` and are left out of the
# published site. Delete the next line, or set it to false, to publish.
draft: true
---

Start with the point of the post. The first paragraph shows under the title and decides whether people keep reading, so say what the reader will get.

The file name becomes the address: `my-first-paper.md` is published at `/writing/my-first-paper/`. Second-level headings (`##`) appear in the "On this page" list beside the post once there are three or more.

## Text

Plain Markdown: *italic*, **bold**, `inline code`, [links](https://example.com) and lists.

- A point.
- Another point, with a footnote.[^1]

1. First step.
2. Second step.

> A quotation, or a sentence you want to set apart.

<aside class="note">

**A note.** Use this block for a caveat, a definition or a tip that would interrupt the main text.

</aside>

## Maths

Write LaTeX between dollar signs. Inline, the softmax temperature is $\tau$. On its own line:

$$
p_i = \frac{\exp(z_i / \tau)}{\sum_{j=1}^{V} \exp(z_j / \tau)}
$$

and the perplexity of a model on a sequence of $N$ tokens is

$$
\mathrm{PPL} = \exp\left(-\frac{1}{N} \sum_{t=1}^{N} \log p_\theta(x_t \mid x_{<t})\right).
$$

## Code

Name the language after the three backticks to get syntax colouring.

```python
import math


def perplexity(log_probs: list[float]) -> float:
    """Perplexity from per-token natural-log probabilities."""
    return math.exp(-sum(log_probs) / len(log_probs))


print(round(perplexity([-0.2, -1.3, -0.7]), 2))  # 2.08
```

## Tables

| Model | Parameters | Exact match |
| --- | --- | --- |
| Baseline | 110M | 71.4 |
| Ours | 110M | 74.9 |

## Figures

Put the image next to the post (here, in the `figures` folder) and link to it with a relative path. Wrap it in `<figure>` to add a caption.

<figure>

![A prompt goes into a model, which produces a draft](./figures/example-figure.svg)

<figcaption>Captions go here. The site defaults to light and also supports dark mode; export plots with readable labels in both themes.</figcaption>
</figure>

For a diagram that should follow the dark and light themes, paste the SVG straight into the post with `class="diagram"` and use `currentColor` for strokes and text. The post on legal text generation does this.

## Before you publish

- Does the title say what the post is about?
- Is the description one or two sentences? It is what search results and link previews show.
- Are the numbers and code checked?
- Remove `draft: true`.

[^1]: Footnotes are collected at the end of the post.
