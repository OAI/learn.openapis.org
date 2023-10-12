---
layout: default
title: Definitions
nav_order: 3
---

# Definitions

- **document**: A local file, network resource, or other distinct entity in a particular format such as JSON or YAML
- **entry document**: The document in an OAD where processing begins, starting with an OpenAPI Object ([3.0](https://spec.openapis.org/oas/v3.0.3#openapi-object), [3.1](https://spec.openapis.org/oas/v3.1.0#openapi-object))
- **OpenAPI Description** (**OAD**): One or more documents written according to a specific version of the OpenAPI Specification, that together describe an API
- **OpenAPI Initiative** (**OAI**): The standards body responsible for the development of the OpenAPI Specification _(not to be confused with the unrelated and more recent "OpenAI")_
- **OpenAPI Specification** (**OAS**): The formal requirements for the OpenAPI format, which exists in several versions (e.g. 3.0.3, 3.1.0)
- **reference**: A connection from one location in an OAD to another in which the reference target is identified by a URI; the `"$ref"` and `"operationRef"` keywords implement references in the OAS
- **reference removal**: The process of replacing references with their targets; not all references can be removed
- **reference resolution**: The process of associating all reference sources with their targets, typically in-memory, without needing to remove references; all references in a well-formed OAD are resolvable
- **Uniform Resource Identifier** (**URI**): An identifier for a resource of any kind, which may or may not indicate its location
- **Uniform Resource Locator** (**URL**): A URI intended to be used as a locator for retrieving or otherwise interacting with a resource
- **URI-reference resolution**: The process of resolving a [URI-reference](https://www.rfc-editor.org/rfc/rfc3986.html#section-4.1) against a [base URI](https://www.rfc-editor.org/rfc/rfc3986.html#section-5.1) to produce a full URI (which must include a [scheme](https://www.rfc-editor.org/rfc/rfc3986.html#section-3.1)); this must be done with the values of `"$ref"` and similar keywords before as the first step of reference resolution (or reference removal)

## A note on the history of "document", "definition", and "description"

Up through OAS 3.0.3 and 3.1.0, the OAS contained a section titled "OpenAPI Document", with differing definintions depending the OAS version.  The terms "OpenAPI Definition", "OpenAPI Description", and other variations and combinations were also used within the specification and/or the [learn.openapips.org](learn.openapis.org) site.

In September 2023, the OAI Technical Steering Committee (TSC) agreed to standardize on "OpenAPI Description" for the complete logical entity that descrribes an API, and to reserve the term "document" (lower-cased) for its common meaning.  Resolving the debate between "OpenAPI Description" and "OpenAPI Definition" hinged on the observation that while "definition" is appropriate when the API code is generated from the OAD, it is not accurate when an OAD is written for an existing API.  The term "description" is accurate in both cases.

## Documents and OpenAPI Descriptions

An OpenAPI Description, or OAD, can be structured as one or more documents.  Those documents are typically stored as local files with `.json` or `.yaml` (or `.yml`) extensions, or as HTTP-accessible network resources of type `application/openapi+json` or `application/openapi+yaml`.  The documents are connected by references, as described in the [Using References In OpenAPI Descriptions](references) guide.
