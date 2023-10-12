---
layout: default
title: Resolving References
nav_order: 3
parent: Using References
---

# Resolving References

The only difference between URIs and URLs is their intended usage:  if a URI is intended to be used as a locator exactly as it is written, then it can be called a URL.  API endpoints, for example, are URLs.  If a URI is intended to be a stable identifier regardless of where the identified document actually lives, it is a URI, and *not* a URL.

## Resolving internal references

References that consist only of URI fragments, or that have URIs whose non-fragment part resolves to the current document, are easily resolved.  For JSON Pointer fragments (the only kind allowed in 3.0, and the only kind allowed outside of Schema Objects in 3.1), all that is needed is to evaluate the pointer against the document.

### OAS 3.1 Schema Objects and internal references

### Static references to plain-name URI fragments

With OAS 3.1 Schema Objects, it is also possible to use plain-name URI fragments in both static (`"$ref"`) and dynamic (`"$dynamicRef"`) references.  Furthermore, it is possible to use `"$id"` to embed a Schema Object with a different [absolute-URI](https://www.rfc-editor.org/rfc/rfc3986#section-4.3) from the overall document inside that document.  While these references are still internal to the document, they require that the whole document has been parsed, and the keywords that declare the absolute-URIs (`"$id"`) or plain-name URI fragments (`"$anchor"` and `"$dynamicAnchor"`) have been recognized.

As we will see, these scenarios add complexity to resolving external references, as the correct document must be identified and parsed in full before the reference can be resolved.

### Dynamic references

In the case of `"$dynamicAnchor"` and `"$dynamicRef"`, all schema documents containing Schema Objects with `"$dynamicAnchor"` along the evaluation path (following `"$ref"` and `"$dynamicRef"` rather than the literal file structure) of any given instance validation must be parsed and recognized in order to properly resolve the `"$dynamicRef"` for that instance validation.  Dynamic references cannot be fully resolved except in the context of instance evaluation/validation.

This is true for both internal and external dynamic references.  In particular, a `"$dynamicRef"` will always be statically resolvable (treating it like `"$ref"`) to a `"$dynamicAnchor"` in the same document, making all `"$dynamicRef"`s appear to be internal references.  However, if the `"$dynamicRef"` is reached through any external documents on a particular evaluation path, then it will at least potentially function as an external reference.

## Resolving external references

External references, which are references with a target URI pointing to a different document than the one containing the reference, can be handled in several different ways.  The OpenAPI Specification is not clear on the exact requirements, although the JSON Schema Specification makes it clear that references are done through _identifiers_ (URIs) rather than _locators_ (URLs) ([draft-wright-00](https://datatracker.ietf.org/doc/html/draft-wright-json-schema-00#autoid-19) for OAS 3.0; [draft-bhutton-00](https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.3) for OAS 3.1).

Not all tools support external references at all, and some that do only support handling them as URLs.  This guide will examine different approaches, but check your tool documentation for what is supported in your environment.

### Treating reference URIs as URLs

The simplest way to resolve external references is to just treat the URIs as URLs.  This works if either your OAD documents are always located in the same place, or if you can use relative URI-references to handle the difference between (for example) local check-outs of your files vs various development, testing, and production deployments.

However, some use cases make treating reference identifiers as locators challenging:

* Maintaining both JSON and YAML formats, when using file extensions to differentiate them
* OADs that reference 3rd-party schemas from disparate sources

### Use cases for separating identity (URIs) and location (URLs)

There are many reasons to separate reference identity and location.  This section will briefly list a few, while the next section will use an analogy to make the benefits more concrete for those who have only worked with relatively simple OpenAPI Descriptions (OADs).

Note that the versions of JSON Schema referenced by OAS [3.0](https://datatracker.ietf.org/doc/html/draft-wright-json-schema#section-8) and [3.1](https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.3) explicitly state that reference use URIs as identifiers, not necessarily locators.

Tools that support separating reference identity and location provide various ways to map reference URIs to actual URLs to resolve the references.  These interfaces vary widely, so check your tool's documentation to determine what reference resolution configuration it supports.

Use cases for mapping references to locations other than that given by their URI include:

* Abstracting JSON vs YAML representaitons by omitting any file extension (otherwise you need different reference values in each format, or you will change formats as you follow references which is allowed but may be surprising to users)
* Using an internal mirror of a 3rd-party schema repository in a high-security environment
* Managing references that are too complex to handle with relative URI-references alone, such as when you are mixing shared production schemas or other components with local development or tests schemas or components

### An analogy with programming language package managers

TBD; see [OAI/moonwalk#49 (comment)](https://github.com/OAI/moonwalk/discussions/49#discussioncomment-6621150) for a first pass at this example.
