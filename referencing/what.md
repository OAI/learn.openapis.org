---
layout: default
title: What Are References?
nav_order: 2
parent: Using References
---

# What are references?

A *reference* is a keyword and value that identifies a *reference target* with a URI.  In some cases, this URI can be treated as a URL and de-referenced directly.  In other cases, as we will see in the [resolving references](resolving) guide, it is helpful to separate the target's *identity* from its *location*.

External references are how multiple documents are linked into an OAD.  This means that referencing impacts how other linkages, such as those that use Components Object names, or values such as `operationId` in the Path Item Object, work.  These other linkages can only work if the document (or with many tools, the specific JSON object) containing the name or other identifier has been referenced.

## A taxonomy of references

References exist in several variations in the OpenAPI Specification (OAS) versions 3.0 and 3.1, as shown in the following table.  Note that an *adjacent keyword* is a keyword in the same JSON Object (whether it is written in JSON or YAML) as the reference keyword.

| OAS Version | Object | Reference Keyword | Adjacent Keywords | Behavior |
| ----------- | ------ | ----------------- | ----------------- | -------- |
| 3.0         | Reference Object | `"$ref"`       | ignored           | logically replace the Reference Object with the reference target |
| 3.1         | Reference Object | `"$ref"`       | `"summary"` and `"description"` allowed; others ignored | logically replace the Reference Object with a coply of the target, overwriting the target's `"summary"` and/or `"description"` fields with those of the Reference Object if they are present |
| 3.x         | Path Item Object | `"$ref"`       | allowed under some circumstances | logically replace the Path Item Object containing the `"$ref"` with a Path Item Object that combines the fields of the target Path Item Object with the non-`"$ref"` fields of the Path Item Object containing the `"$ref"`, as long as none of those fields conflict |
| 3.1         | Schema Object | `"$ref"`   | allowed | Apply the target Schema Object to the same instance location as the Schema Object containing the `"$ref"`, and combine the results with the results of other keywords in the Schema Object containing the `"$ref"` just as you would any other keyword results; this is more-or-less equivalent to using a one-element `"allOf"` |
| 3.x         | Link Object   | `"operationRef"` | allowed, except `"operationId"` | Treat the reference target as the target of the link described by the Link Object |
| 3.x         | Descriminator Object | `"mapping"` | n/a | for each name under `"mapping"`, if the value is not the name of a Schema Object under the Components Object, treat it as a reference to the schema to use when the discriminator field matches the mapping name |

Note that not all references are handled by replacing the source with the target.  Some are defined in terms of behavior, and **cannot** be replaced with an inline value.

### URIs, URLs, and URI-references

All of the above keywords take a *[URI-reference](https://www.rfc-editor.org/rfc/rfc3986.html#section-4.1)* as a value, which can be either a *[URI](https://www.rfc-editor.org/rfc/rfc3986.html#section-3)* (which MUST include a [scheme](https://www.rfc-editor.org/rfc/rfc3986.html#section-3.1)) or a *[relative reference](https://www.rfc-editor.org/rfc/rfc3986.html#section-4.2)*, which must be resolved against a [base URI](https://www.rfc-editor.org/rfc/rfc3986.html#section-5.1) to produce a full URI.  In this guide, the term ***URI-reference resolution*** is always used for the process of resolving a URI-reference against a base URI.  

Somewhat confusingly, the OAS uses the the terms "URI" and "URL" to mean "URI or URI-reference" and "URL or URL-reference", respectively.  In this guide, whenever a reference's "URI" is mentioned, it is always refers to the proper URI after any necessary URI-reference resolution has been performed.

Also, in this guide the term "reference" alone *always* means reference as defined in the table above, and the words "resolve", "resolved", and "resolution" on their own *always* refer to the OAS-defined process that occurs *after* URI-reference resolution.

## Non-reference linkages

The following connections between parts of the OAS require that some name or identifier has been seen.  Due to ambiguities in the specification (which the OAI will hopefully be able to clarify in future patch releases), it is not always clear how to handle identifiers that are present in a _document_ that has been referenced, but are not present in the _exact JSON object_ targeted by any single reference.

Note that some of the identifiers are not in objects that can be referenced, but are included for completeness.

| OAS Version | Identifying Object | Identifying Field | Object of Identifier Use |
| ----------- | ------------------ | ----------------- | ------------------------ |
| 3.x         | Components Object  | Schema name       | Discriminator Object     |
| 3.x         | Components Object  | Security Scheme name | Security Requirement Object |
| 3.x         | Tag Object         | `name`            | Operation Object |
| 3.x         | Operation Object   | `operationId`     | Link Object |
| 3.x         | Server Object      | n/a               | Paths Object |

## JSON Schema referencing and identification in OAS 3.1

In OAS 3.1, JSON Schema combines some of the concerns of referencing and non-reference linkage.  This is because in JSON Schema draft 2020-12 as included in OAS 3.1, the dialect can be set within the OAD, or through the `"$schema"` keyword in a parent Schema Object.  Schemas can also be referenced by URIs declared in-schema by certain keywords.  These can be URIs that cannot be used as URLs as they are not hosted separately from the containing document, or plain-name fragments that, unlike JSON Pointer fragments, can only be resolved if their delcaring keyword has been parsed.

| Identifier Purpose | Identifying Object | Identifying Field |
| ------------------ | ------------------ | ----------------- |
| dialect id         | OpenAPI Object   | `jsonSchemaDialect` |
| dialect id         | Schema Object      | `$schema`         |
| static reference target | Schema Object | `$id`             |
| static reference target | Schema Object | `$anchor`         |
| dynamic reference target | Schema Object | `$dynamicAnchor` |
