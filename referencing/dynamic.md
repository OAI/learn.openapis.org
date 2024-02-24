---
layout: default
title: Dynamic References
nav_order: 4
parent: Using References
---

## Dynamic References

Dynamic referencing is a feature of JSON Schema draft 2020-12, and therefore included in OAS 3.1.  It allows setting a placeholder reference target that can be overridden during validation depending on how the dynamic reference was reached.  If that explanation didn't help you at all, don't worry, it boils down to two use cases:

* [Implementing generic types](https://json-schema.org/blog/posts/dynamicref-and-generics#using-dynamic-references-to-support-generic-types) (a.k.a. templatized types), such as container data structures or payload envelopes
* Extending recursive schemas, as the OAS schema needed to do to [add OAS-specific keywords to the standard JSON Schema dialect](https://json-schema.org/blog/posts/validating-openapi-and-json-schema)

While there may be other creative ways to use dynamic references, these are the situations most likely to show up in API descriptions.

