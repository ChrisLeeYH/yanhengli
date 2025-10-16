---
title: "Where Do LLMs Go Wrong? Diagnosing Automated Peer Review via Aspect-Guided Multi-Level Perturbation"
authors:
- Jiatao Li
- admin
- et,al
author_notes:
- ""
- ""
- ""
date: "2025-11-10T00:00:00Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2025-10-15T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["paper-conference"]

# Publication name and optional abbreviated publication name.
publication: "In *Proceedings of the 34th ACM International Conference on Information and Knowledge Management* "
publication_short: "In *CIKM'25*"

abstract: We introduce an aspect-guided perturbation framework to diagnose vulnerabilities of Large Language Models (LLMs) in peer review. By perturbing papers, reviews, and rebuttals along dimensions such as contribution, soundness, presentation, tone, and completeness, we reveal where LLM reviewers are most error-prone. Our analysis across major LLMs (GPT-4o, Gemini 2.0, LLaMA 3, etc) highlights recurring weaknesses, including misjudging methodological flaws, over-weighting strong rejections, mishandling incomplete rebuttals, and misinterpreting poor critiques as rigorous. These findings provide actionable insights for building balanced human–AI peer review partnerships.

# Summary. An optional shortened abstract.
summary:

tags:
- Large Language Models
- Automated Peer Review
- Bias Analysis

featured: false

hugoblox:
  ids:
    arxiv: 2502.12510

links:
  - type: pdf
    url: https://arxiv.org/abs/2502.12510
  # - type: code
  #   url: ""
  # - type: dataset
  #   url: ""
  # - type: poster
  #   url: ""
  # - type: project
  #   url: ""
  # - type: slides
  #   url: https://www.slideshare.net/
  # - type: source
  #   url: ""
  # - type: video
  #   url: ""

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'Image created by chatGPT-5'
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ""
---

<!-- > [!NOTE]
> Click the *Cite* button above to demo the feature to enable visitors to import publication metadata into their reference management software.

> [!NOTE]
> Create your slides in Markdown - click the *Slides* button to check out the example.

Add the publication's **full text** or **supplementary notes** here. You can use rich formatting such as including [code, math, and images](https://docs.hugoblox.com/content/writing-markdown-latex/). -->

I co-examine the robustness of LLMs when used as automated peer reviewers.  
- Co-Designed an **aspect-guided multi-level perturbation framework**.  
- Co-Evaluated multiple LLMs on review tasks.  
- Found systematic **cognitive biases and stability gaps**.  