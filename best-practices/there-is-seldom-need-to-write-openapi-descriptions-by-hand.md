---
layout: default
title: There is Seldom Need to Write OpenAPI Descriptions by Hand
parent: Best Practices
nav_order: 5
---

# There is Seldom Need to Write OpenAPI Descriptions by Hand

Since OADs are plain text documents, in an easy-to-read format (be it JSON or YAML), API designers are usually tempted to write them by hand.

While there is nothing stopping you from doing this, and, in fact, hand-written API descriptions are usually the most terse and efficient, approaching any big project by such method is highly impractical.

Instead, you should try the other existing creation methods and choose the one that better suits you and your team (No YAML or JSON knowledge needed!):

- **OpenAPI Editors**: Be it [text editors](https://tools.openapis.org/categories/text-editors) or [GUI editors](https://tools.openapis.org/categories/gui-editors) they usually take care of repetitive tasks, allow you to keep a library of reusable components and provide real-time preview of the generated documentation.

- **Domain-Specific Languages**: As its name indicates, [DSL](https://tools.openapis.org/categories/dsl)'s are API description languages tailored to specific development fields. A tool is then used to produce the OpenAPI Description. A new language has to be learned, but, in return, extremely concise descriptions can be achieved.

- **Code Annotations**: Most programming languages allow you to _annotate_ the code, be it with specific syntax or with general code comments. These annotations, for example, can be used to extend a method signature with information regarding the API endpoint and HTTP method that lead to it. A tool can then parse the code annotations and generate OADs automatically. This method fits very nicely with the code-first approach, so keep in mind the advice in [Use a Design-First Approach](use-a-design-first-approach) when using it.

- **A Mix of All the Above**: It's perfectly possible to create the bulk of an OpenAPI Description using an editor or DSL and then hand-tune the resulting file. Just be aware of [Keep a Single Source of Truth](keep-a-single-source-of-truth): once you modify a file **it becomes the source of truth** and the previous one should be discarded (maybe keep it as backup, but out of the sight and reach of children and newcomers to the project).
