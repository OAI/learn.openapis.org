---
layout: default
title: Remove References
nav_order: 3
parent: Using References
---

# Remove References

Sometimes it is useful to remove references in an OpenAPI Description (OAD).  A common use case is working with tools that don't understand references well.  This isn't always straightforward, however, and this page covers the main points to look out for.

## Convert an OAD to a single-document form without any references

Not all OADs can be converted but there are many cases where it is possible to do such a thing without problems.

The difficult cases are:

* Cyclic references in JSON Schema ***cannot*** be removed, although if the references cross documents, it is possible to reduce them to same-document references in a single document
* While [dynamic references](dynamic) in OAS 3.1 Schema Objects technically can be converted to static references, it can [grow the schema size exponentially](https://dl.acm.org/doi/10.1145/3632891) ([pdf](https://dl.acm.org/doi/pdf/10.1145/3632891))
* OAS 3.1 Schema Objects, OAS 3.0 Reference Objects, and both OAS 3.0 and 3.1 Path Item Objects all allow keywords alongside a`"$ref"`, each with slightly different semantics; generic reference removal tools, particularly ones that predate OAS 3.1, may fail to preserve the behavior while removing references
* In OAS 3.1 Schema Objects that use `"$id"`, reference removal tools that are not aware of `"$id"` will resolve references impacted by the `"$id"` incorrectly
* The Link Object's `"operationRef"` cannot be replaced with an inline Operation Object (although if the target Operation Object has a unique-within-the-OAD `"operationId"`, then the `"operationRef"` can be replaced by the `"operationId"`)
* The Discriminator Object's `"mapping"` field forbids inline Schema Objects; URI-reference values can be replaced with names from the `"schemas"` section of the Components Object, but when the Discriminator Object is in a referenced document, there are ambiguities involved in how to resolve those names
* When using components published by 3rd parties such as standards organizations, tools might rely on reference URIs to identify standard components; while this usage is currently uncommon, it may become more common as OpenAPI is more broadly adopted by standards bodies

If your OAD does not run afoul of any of the above difficulties, you _can_ produce a reference-less single-document OAD, and there are [tools](https://tools.openapis.org) that will do so (but see the caveats in the next section).

## Convert a multi-document OAD into a single document

It is possible to convert a multi-document OAD into a single document even if not all references can be removed.  However, depending on exactly how your multi-document OAD is structured, this may be more complex than just removing references.  Sadly, the reasons have to do with [painfully obscure and technical ambiguities](https://github.com/OAI/oascomply/blob/main/reports/processing-model-summary.md) regarding how multi-document OADs are intended to be parsed.  The OpenAPI Initiative hopes to clarify this in future versions of the specification.

* It is possible for a Link Object's `"operationId"` to point to an Operation Object in a Path Item Object that is never referenced; it is unclear how this case should handle it, which is one reason the OAS itself [advises against](https://spec.openapis.org/oas/latest#fixed-fields-16) using `"operationId"` in  multi-document OADs
* Security Scheme Objects are never referenced, only named in Security Requirement Objects, and must be taken into account
* There is no standard place to put referenced Path Item Objects in OAS 3.0
* The resolution of server configuration and security settings can be unclear in multi-document OADs

Again, in many cases none of this is a problem, and there are [tools](https://tools.openapis.org) that will do what you want.

