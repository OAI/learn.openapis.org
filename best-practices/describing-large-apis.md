---
layout: default
title: Describing Large APIs
parent: Best Practices
nav_order: 6
---

# Describing Large APIs

This is a collection of small hints related to working with large OADs.

- **Do not repeat yourself** (The DRY principle). If the same piece of YAML or JSON appears more than once in the document, it's time to move it to the `components` section and reference it from other places using `$ref` (See [Reusing Descriptions](../specification/components). Not only will the resulting document be smaller but it will also be much easier to maintain).

  Components can be referenced from other documents, so you can even reuse them across different API descriptions!

- **Split the description into several documents**: Smaller files are easier to navigate, but too many of them are equally taxing. The key lies somewhere in the middle.

  A good rule of thumb is to use the natural hierarchy present in URLs to build your directory structure. For example, put all routes starting with `/users` (like `/users` and `/users/{id}`) in the same file (think of it as a "sub-API").

  Bear in mind that some tools might have issues with large files, whereas some other tools might not handle too many files gracefully. The solution will have to take your toolkit into account.

- **Use tags to keep things organized**: [Tags](https://spec.openapis.org/oas/v3.1.0#oasTags) have not been described in the Specification chapter, but they can help you arrange your operations and find them faster. A tag is simply a piece of metadata (a unique name and an optional description) that you can attach to [operations](../specification/paths). Tools, specially [GUI editors](https://tools.openapis.org/categories/gui-editors), can then sort all your API's operation by their tags to help you keep them organized.
