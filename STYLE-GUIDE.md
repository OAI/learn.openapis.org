# Style Guide for "Explained" Pages

This guide applies to pages that explain a specification object by object, such as [The Arazzo Specification](arazzo/index.md). It is based on the Callbacks, Links, and Security pages of [The OpenAPI Specification Explained](specification/index.md), which share a single author and a consistent approach.

## Organizing a section

- Write one page per object or closely related cluster of objects.
- Give each page a task-style title, such as "Providing Callbacks" or "Describing Steps".
- Order pages from the most common concepts to the most advanced.
- List each page on the section's landing page with the fields it covers: `- [Describing Steps](steps): `stepId` and `operationId`.`
- Use one running example across the section. Add to it rather than inventing a new domain for each page.
- Open the landing page by saying what the specification does. Then give the version the section explains and what it assumes readers know, and finish with the page list.
- Call a group of pages a "section", not a "chapter".

## Page skeleton

1. **Front matter**, then an H1 identical to `title`:

   ```yaml
   ---
   layout: default
   title: Describing Steps
   parent: The Arazzo Specification
   nav_order: 4
   ---
   ```

2. **The problem or pattern**, in plain terms, followed by the feature that addresses it. Say why the feature exists before saying how it works.
3. **A diagram**, showing where the object sits in the wider structure:

   ```html
   <figure style="text-align:center">
     <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-step-object.svg"></object>
     <figcaption>Steps are implemented in a <a href="workflows.html">Workflow</a>.</figcaption>
   </figure>
   ```

4. **A real-world use case**, then the running example, introduced with "Our Tic Tac Toe example…".
5. **YAML fragments**. Introduce each with a sentence ending in a colon, then explain what it does. Show only what is relevant to the point being made.
6. **The scope boundary**. Say what the specification leaves to tooling or what the page doesn't cover, for example "We therefore do not cover such considerations in this topic."
7. **A summary**, under `## Summary`, starting "In this topic we've learned that:" followed by 3-4 bullets. Restate concepts, not syntax.

A page covering several variants of one object gets a short list of the variants up front and an H2 for each.

## Voice

- Write in the first-person plural ("we", "our"). Use "you" for direct guidance.
- Be direct and fairly formal. State what something is or does, and don't add enthusiasm or reassurance.
- Use literal language. Write "provides an introduction", not "provides a soft landing".
- State facts without softeners such as "please note", "please refer to", or "it is worth knowing".
- Don't promote the documentation or narrate how it is organized. Leave out phrases such as "simplifying browsing" and "starting from the most common and progressing towards advanced ones".
- Keep each paragraph to one idea, such as separating what the specification does from what the section covers.
- Name the actors precisely: API provider and API consumer, plus workflow author and tooling where they apply.
- Explain what a feature is for and when it isn't appropriate, rather than listing what it contains.
- Use American spelling.
- Don't call anything obvious, simple, or easy.

## Conventions

| Item | Convention |
| --- | --- |
| Specification names | Use the full name in link text: "OpenAPI Specification", not "OpenAPI" |
| Object names | Link the first mention to the specification as "Workflow Object", then write "Workflow object" in prose |
| Field names and values | Backticks: `stepId`, `goto` |
| Contrast | Italics, as in _at design time_ |
| Normative rules | Bold lowercase **must**, only when the specification imposes the rule |
| Blockquotes | Tooling caveats and pointers to complete examples only |
| Headings | Title Case |
| Examples | YAML, as elsewhere on the site |

## Links

- Pin specification links to the version being explained, for example `https://spec.openapis.org/arazzo/v1.1.0.html#workflow-object`. Check that the anchor exists.
- Link to other pages in the section with a relative `.html` URL, for example `steps.html#choosing-a-target`.
- Link to complete examples with a relative path to the YAML file.

## Accuracy

- The specification is normative. Where it differs from the JSON Schema, follow the specification and raise the difference with the maintainers.
- Fragments must match the checked-in example or, if illustrating something the example doesn't do, must be valid against the schema.
- The diagram shows the structure and the prose covers what matters. Don't reproduce the specification's field tables.
- Don't describe something as new in a given version unless you have compared it with the previous version.

## Diagrams

Each diagram has a source file and a generated SVG in `img/`, with both committed. Arazzo diagrams are prefixed `arazzo-` because object names such as Parameter Object and Components Object also exist in OpenAPI.

- Green (`#94d60a` header, `#6ca437` fields) marks the objects the page is about.
- Gray (`#939598` header, `#6d6e71` fields) marks objects shown for context.
- Each object header is bold and links to its specification section. Field names are monospace.
- Connect edges to the field that holds the relationship, not just to the object.
- Use `…` for fields the page doesn't discuss, but list every field of the object the page is about.
- Name the graph after the diagram's own subject.

## Mistakes to avoid

These appear in the original pages and shouldn't be carried forward:

- Filler such as "(obviously)" or "the neat trick here".
- Mixing `latest` and versioned specification links on one page.
- Mixing "In this page" and "In this topic" in summaries.
- Fragments that aren't valid, such as a Security Scheme with no `type`.
- Unproofread forms such as "an Response", "born out" (for "borne out"), and "These then be declared".
