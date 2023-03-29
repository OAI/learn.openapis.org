---
layout: default
title: Best Practices
nav_order: 4
---

# Best Practices

This page contains general pieces of advice which do not strictly belong to the [Specification Explained](specification) chapter because they are not directly tied to the OpenAPI Specification.

However, they greatly simplify creating and maintaining OpenAPI documents, so they are worth keeping in mind.

## Use a Design-First Approach

Traditionally, two main approaches exist when creating OpenAPI documents: **Code-first** and **Design-first**.

- In the Code-first approach, **the API is first implemented in code**, and then its description is created from it, using code comments, code annotations or simply written from scratch. This approach does not require developers to learn another language so it is usually regarded as the easiest one.

- Conversely, in Design-first, **the API description is written first** and then the code follows. The first obvious advantages are that the code already has a skeleton upon which to build, and that some tools can provide boilerplate code automatically.

There have been a number of heated debates over the relative merits of these two approaches but, in the opinion of the OpenAPI Initiative, the importance of using **Design-first** cannot be stressed strongly enough.

The reason is simple: **The number of APIs that can be created in code is far superior to what can be described in OpenAPI**. To emphasize: **OpenAPI is not capable of describing every possible HTTP API, it has limitations**.

Therefore, unless these descriptive limitations are perfectly known and taken into account when coding the API, they will rear their ugly head later on when trying to create an OpenAPI description for it. At that point, the right fix will be to change the code so that it uses an API which can be actually described with OpenAPI (or switch to Design-first altogether).

Sometimes, however, since it is late in the process, it will be preferred to twist the API description so that it matches *more or less* the actual API. It goes without saying that this leads to **unintuitive and incomplete descriptions**, that will rarely scale in the future.

Finally, there exist a number of [validation tools](https://tools.openapis.org/categories/data-validators) that can verify that the implemented code adheres to the OpenAPI description. Running these tools as part of a Continuous Integration process allows changing the OpenAPI document with peace of mind, since deviations in the code behavior will be promptly detected.

> **Bottom line:**
> OpenAPI opens the door to a [wealth of automated tools](https://tools.openapis.org). Make sure you use them!

## Keep a Single Source of Truth

Regardless of your design approach (design-first or code-first) always keep a single source of truth, i.e., information should **not** be duplicated in different places. It is really the same concept used in programming, where repeated code should be moved to a common function.

Otherwise, eventually one of the places will be updated while the other won't, leading to headaches... in the best of cases.

For instance, it is also commonplace to use code annotations to generate an OpenAPI description and then commit the latter to source control while the former still lingers in the code. As a result, newcomers to the project will not know which one is actually in use and mistakes will be made.

Alternatively, you can use a Continuous Integration test to ensure that the two sources stay consistent.

## Add OpenAPI Documents to Source Control

OpenAPI descriptions are **not** just a documentation artifact: they are **first-class source files** which can drive a great number of automated processes, including boilerplate generation, unit testing and documentation rendering.

As such, OpenAPI description should be committed to source control, and, in fact, they should be among the first files to be committed. From there, they should also participate in Continuous Integration processes.

## Make the OpenAPI Documents Available to the Users

Beautifully-rendered documents can be very useful for the users of an API, but sometimes they might want to access the source OpenAPI description. For instance, to use tools to generate client code for them, or to build automated bindings for some language.

Therefore, making the OpenAPI documents available to the users is an added bonus for them. The document can even be made available through the same API to allow runtime discovery.

## There is Seldom Need to Write OpenAPI Documents by Hand

Since OpenAPI documents are plain text files, in an easy-to-read format (be it JSON or YAML), API designers are usually tempted to write them by hand.

While there is nothing stopping you from doing this, and, in fact, hand-written API descriptions are usually the most terse and efficient, approaching any big project by such method is highly impractical.

Instead, you should try the other existing creation methods and choose the one that better suits you and your team (No YAML or JSON knowledge needed!):

- **OpenAPI Editors**: Be it [text editors](https://tools.openapis.org/categories/text-editors) or [GUI editors](https://tools.openapis.org/categories/gui-editors) they usually take care of repetitive tasks, allow you to keep a library of reusable components and provide real-time preview of the generated documentation.

- **Domain-Specific Languages**: As its name indicates, [DSL](https://tools.openapis.org/categories/dsl)'s are API description languages tailored to specific development fields. A tool is then used to produce the OpenAPI document. A new language has to be learned, but, in return, extremely concise descriptions can be achieved.

- **Code Annotations**: Most programming languages allow you to _annotate_ the code, be it with specific syntax or with general code comments. These annotations, for example, can be used to extend a method signature with information regarding the API endpoint and HTTP method that lead to it. A tool can then parse the code annotations and generate OpenAPI documents automatically. This method fits very nicely with the code-first approach, so keep in mind the first advice given at the top of this page when using it (Use a Design-First Approach)...

- **A Mix of All the Above**: It's perfectly possible to create the bulk of an OpenAPI document using an editor or DSL and then hand-tune the resulting file. Just be aware of the second advice above (Keep a Single Source of Truth): Once you modify a file **it becomes the source of truth** and the previous one should be discarded (maybe keep it as backup, but out of the sight and reach of children and newcomers to the project).

## Working with Big Documents

This is a collection of small hints related to working with large API description documents.

- **Do not repeat yourself** (The DRY principle). If the same piece of YAML or JSON appears more than once in the document, it's time to move it to the `components` section and reference it from other places using `$ref` (See [Reusing Descriptions](specification/components). Not only will the resulting document be smaller but it will also be much easier to maintain).

  Components can be referenced from other files, so you can even reuse them across different API documents!

- **Split the document into several files**: Smaller files are easier to navigate, but too many of them are equally taxing. The key lies somewhere in the middle.

  A good rule of thumb is to use the natural hierarchy present in URLs to build your file structure. For example, put all routes starting with `/users` (like `/users` and `/users/{id}`) in the same file (think of it as a "sub-API").

  Bear in mind that some tools might have issues with large files, whereas some other tools might not handle too many files gracefully. The solution will have to take your toolkit into account.

- **Use tags to keep things organized**: [Tags](https://spec.openapis.org/oas/v3.1.0#oasTags) have not been described in the Specification chapter, but they can help you arrange your operations and find them faster. A tag is simply a piece of metadata (a unique name and an optional description) that you can attach to [operations](specification/paths). Tools, specially [GUI editors](https://tools.openapis.org/categories/gui-editors), can then sort all your API's operation by their tags to help you keep them organized.

## Links to External Best Practices

There's quite a bit of literature about how to organize your API more efficiently. Make sure you check out how other people solved the same issues you are facing now!

For example:

- The [API Stylebook](http://apistylebook.com/design/guidelines/) contains internal API Design Guidelines shared with the community by some well known companies and government agencies.
