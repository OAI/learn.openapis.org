---
layout: default
title: Referencing FAQ
nav_order: 1
parent: Using References
---

# Referencing FAQ

## Do I need to read the entire referencing guide?

If your OpenAPI Description (OAD):

1. consists only of a single JSON or YAML document
1. contains only references that are fragments (beginning with a `"#"`, e.g. `{"$ref": "#/components/responses/oops"}`)
1. does not have any other keywords in the same object as any `"$ref"`
1. (OAS 3.1 only) does *not* use `"$id"`if you are using OAS 3.1, you are  *not* using the `"$id"` keyword in Schema Objects
1. (OAS 3.1 only) does *not* use `"$dynamicRef"` or `"$dynamicAnchor"`

Then your use of references is simple enough that your references will do what you expect with any tool that supports them at all.  You probably do not need to read the rest of this page.

## Can an OAD be *completely* "de-referenced" by "removing" all references?

In general, no.  But in many common cases, yes, and tools exist that will attempt this.

There are two types of reasons why de-referenceing might not be possible:

* Technical reasons:
   * Cyclic references are allowed in Schema Objects, and are used to describe recursive tree structures.  JSON Schema itself is a recursive tree structure, so the JSON Schema metaschemas cannot be fully de-referenced (see draft-07 or earlier for how this works with `"$ref"`; draft 2020-12 uses a different technique)
   * Cyclic references can also occur when describing complex payloads such as `multipart/form-data` where media type descriptions can be nested
   * References in Link Objects (`"operationRef"`) and Discriminator Objects (`"mapping"`) cannot be replaced with literal values, although there are alternatives to using references in these cases (`"operationId"` and mapping by schema component name, respectively, althouogh there can be challenges with arranging the documents properly for those techniques as well)
   * Dynamic references in OAS 3.1 (which are not covered in detail by this guide) have runtime behavior which cannot always be predicted ahead of time
* Social reasons:
   * In large-scale API ecosystems, different parts of an API may be owned by different entities and connected by references
   * Independent deployment of different parts of the API and different documents within the OpenAPI Description may make de-referencing impossible, or at least very fragile
   * Security or other policies may forbid the sort of copying necessary to perform de-referencing; this is most likely to happen in high-security environments such as government or military
   * Standards compliance policies might require referencing the OAD or schema published by a standards body, rather than copying it

## Can an OAD at least be de-referenced to a single document?

Technically, yes, although in some cases this is more complex than it may seem:

The following sorts of references cannot be removed and replaced with their (possibly modified, depending on the OAS version an source object) targets.  In some cases an alternate technique can be used, while in others the reference value must be updated to reflect the structure of the single consolidated document:

* cyclic references
* `"operationRef"` in Link Objects (although if `"operationId"`s are managed carefully, `"operationRef"` can be replaced by `"operationId"`)
* `"mapping"` in Discriminator Objects (although URI-reference values can be replaced with names from the Components Object if handled correctly)

Dynamic references, which are outside the scope of this guide, may need even more complex handling to be preserved in a single-document structure.

For OAS 3.1, note that if the `"$id"` keyword is used, tools must be aware of it to successfully perform de-referencing, so check your tool's documentation carefully.  For an example of using `"$id"` in a technique known as "bundling", see the OpenAPI Blog post [JSON Schema bundling finally formalised](https://www.openapis.org/blog/2021/08/23/json-schema-bundling-finally-formalised).

However, keep in mind that there are other, non-technical reasons why de-referencing may not be feasible.

*De-referencing is not a general solution in large-scale API ecosystems.*

## How is reference "resolution" different from "de-referencing"?

A reference is said to be *resolved* within a tool if:

* Its target has been identified
* Any modifications to the target required by the OAS have been performed
* The resulting value has been associated with the reference source in some way that the tool can easily use when needed

While plain JSON documents form a [tree](https://en.wikipedia.org/wiki/Tree_%28data_structure%29) structure, an OpenAPI Description with resolved references is not a tree, but a [graph](https://en.wikipedia.org/wiki/Graph_%28abstract_data_type%29).

## Do I need to understand dynamic references?

This guide does **not** cover OAS 3.1 / JSON Schema draft 2020-12's dynamic references (`"$dynamicRef"` and `"$dynamicAnchor"`).  Dynamic references seve a different purpose than  discussed here.  The following JSON Schema Blog posts explain some uses of dynamic references and anchors:

* [Using Dynamic References to Support Generic Types](https://json-schema.org/blog/posts/dynamicref-and-generics#using-dynamic-references-to-support-generic-types)
* [Validating OpenAPI and JSON Schema](https://json-schema.org/blog/posts/validating-openapi-and-json-schema)

Note that in some cases, `"$dynamicRef"` cannot be removed or de-referenced, as it will evaluate differently depending on how it is reached at runtime.
