---
layout: default
title: Referencing FAQ
nav_order: 1
parent: Using References
---

# Referencing FAQ

A few quick answers to common questions when using references with multi-document OpenAPI Descriptions (OADs).

## Is it possible to convert all OADs to a single-document form without any references?

The short answer is "no", but there are many cases where it is possible to do such a thing.  The difficult cases are:

* Cyclic references in JSON Schema ***cannot*** be removed, although if the references cross documents, it is possible to reduce them to same-document references in a single document
* While dynamic references in OAS 3.1 Schema Objects technically can be converted to static references, it can [grow the schema size exponentially](https://dl.acm.org/doi/10.1145/3632891) ([pdf](https://dl.acm.org/doi/pdf/10.1145/3632891))
* OAS 3.1 Schema Objects, OAS 3.0 Reference Objects, and both OAS 3.0 and 3.1 Path Item Objects all allow keywords alongside a`"$ref"`, each with slightly different semantics; generic reference removal tools, particularly ones that predate OAS 3.1, may fail to preserve the behavior while removing references
* In OAS 3.1 Schema Objects that use `"$id"`, reference removal tools that are not aware of `"$id"` will resolve references impacted by the `"$id"` incorrectly
* The Link Object's `"operationRef"` cannot be replaced with an inline Operation Object (although if the target Operation Object has a unique-within-the-OAD `"operationId"`, then the `"operationRef"` can be replaced by the `"operationId"`)
* The Discriminator Object's `"mapping"` field forbids inline Schema Objects; URI-reference values can be replaced with names from the `"schemas"` section of the Components Object, but when the Discriminator Object is in a referenced document, there are ambiguities involved in how to resolve those names
* When using components published by 3rd parties such as standards organizations, tools might rely on reference URIs to identify standard components; while this usage is currently uncommon, it may become more common as OpenAPI is more broadly adopted by standards bodies

If your OAD does not run afoul of any of the above difficulties, you _can_ produce a reference-less single-document OAD, and there are [tools](https://tools.openapis.org) that will do so (but see the caveats in the next section).

## Can I convert my multi-document OAD into a single document, even if I cannot remove all references?

Yes.  However, depending on exactly how your  multi-document OAD is structured, this may be more complex than just removing references.  Sadly, the reasons have to do with [painfully obscure and technical ambiguities](https://github.com/OAI/oascomply/blob/main/reports/processing-model-summary.md) regarding how multi-document OADs are intended to be parsed.  The OpenAPI Initiative hopes to clarify this in future versions of the specification.

* It is possible for a Link Object's `"operationId"` to point to an Operation Object in a Path Item Object that is never referenced; it is unclear how this case should handle it, which is one reason the OAS itself [advises against](https://spec.openapis.org/oas/v3.1.0#fixed-fields-16) using `"operationId"` in  multi-document OADs
* Security Scheme Objects are never referenced, only named in Security Requirement Objects, and must be taken into account
* There is no standard place to put referenced Path Item Objects in OAS 3.0
* The resolution of server configuration and security settings can be unclear in multi-document OADs

Again, in many cases none of this is a problem, and there are [tools](tools.openapis.org) that will do what you want.

## What is "dynamic referencing" and would I use it?

Dynamic referencing is a feature of JSON Schema draft 2020-12, and therefore included in OAS 3.1.  It allows setting a placeholder reference target that can be overridden during validation depending on how the dynamic reference was reached.  If that explanation didn't help you at all, don't worry, it boils down to two use cases:

* [Implementing generic types](https://json-schema.org/blog/posts/dynamicref-and-generics#using-dynamic-references-to-support-generic-types) (a.k.a. templatized types), such as container data structures or payload envelopes
* Extending recursive schemas, as the OAS schema needed to do to [add OAS-specific keywords to the standard JSON Schema dialect](https://json-schema.org/blog/posts/validating-openapi-and-json-schema)

While there may be other creative ways to use dynamic references, these are the situations most likely to show up in API descriptions.

## How is reference resolution different from reference removal?

A reference is said to be _resolved_ within a tool if:

* Its target has been identified
* Any modifications to the target required by the OAS (e.g. because of fields adjacent to `"$ref"`) have been performed on a copy of the target
* The resulting target value has been associated with the reference source in some way that the tool can easily use when needed

A reference is said to be _removed_ if it has been replaced by its (possibly modified) target.

Reference resolution usually preserves the referencing information such as the URI used to identify the target, while reference removal usually discards it.  In many cases this is not significant, except that not knowing how the parsed OAD relates to the references in your JSON or YAML document may make debugging more difficult.

While plain JSON documents form a [tree](https://en.wikipedia.org/wiki/Tree_%28data_structure%29) structure, an OpenAPI Description with resolved references is not _necessarily_ a tree, but a [graph](https://en.wikipedia.org/wiki/Graph_%28abstract_data_type%29).

Tools that resolve references in-memory and work with the graph structure can process all OADs. Tools that rely on reference removal, either as part of the tool or by a separate pre-processing tool, can only support OADs that form trees.

## Is anything being done to reduce this complexity in future OpenAPI Specifications?

Yes!

The [Moonwalk project](https://github.com/OAI/sig-moonwalk/discussions) is considering a different approach that imports complete documents, associates them with namespaces, and only supports referencing by component name (not `"$ref"`).  A small example can be seen in the [Moonwalk deployments proposal](https://github.com/OAI/sig-moonwalk/blob/main/Deployments.md), and there are discussions around an [initial draft proposal for imports](https://github.com/OAI/sig-moonwalk/discussions/72) and a few ideas on [how to manage interactions with JSON Schema referencing](https://github.com/OAI/sig-moonwalk/discussions/73).

The [proposed Workflows Specification](https://github.com/OAI/sig-workflows/blob/main/versions/1.0.0.md) is already using a `"sourceDescription"` field that is not unlike the Moonwalk proposal.

