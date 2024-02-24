---
layout: default
title: References Overview
nav_order: 1
parent: Using References
---

# What are references?

A *reference* is a keyword and value that identifies a *reference target* with a URI.  In some cases, this URI can be treated as a URL and de-referenced directly.  In other cases, as we will see in the (forthcoming) guide to resolving references, it is helpful to separate the target's *identity* from its *location*.

External references are how multiple documents are linked into a single OpenAPI Description (OAD).  This means that referencing impacts how other linkages, such as those that use Components Object names, or values such as `operationId` in the Path Item Object, work.  These other linkages can only work if the document (or with many tools, the specific JSON object) containing the name or other identifier has been referenced.

## A taxonomy of references

References exist in several variations in the OpenAPI Specification (OAS) versions 3.0 and 3.1, as shown in the following table.  Note that an *adjacent keyword* is a keyword in the same JSON Object (whether it is written in JSON or YAML) as the reference keyword.

| OAS Version | Object | Reference Keyword | Adjacent Keywords | Behavior |
| ----------- | ------ | ----------------- | ----------------- | -------- |
| 3.0         | Reference Object | `"$ref"`       | ignored           | logically replace the Reference Object with the reference target |
| 3.1         | Reference Object | `"$ref"`       | `"summary"` and `"description"` allowed; others ignored | logically replace the Reference Object with a copy of the target, overwriting the target's `"summary"` and/or `"description"` fields with those of the Reference Object if they are present |
| 3.x         | Path Item Object | `"$ref"`       | allowed under some circumstances | logically replace the Path Item Object containing the `"$ref"` with a Path Item Object that combines the fields of the target Path Item Object with the non-`"$ref"` fields of the Path Item Object containing the `"$ref"`, as long as none of those fields conflict |
| 3.1         | Schema Object | `"$ref"`   | allowed | Apply the target Schema Object to the same instance location as the Schema Object containing the `"$ref"`, and combine the results with the results of other keywords in the Schema Object containing the `"$ref"` just as you would any other keyword results; this is more-or-less equivalent to using a one-element `"allOf"` |
| 3.x         | Link Object   | `"operationRef"` | allowed, except `"operationId"` | treat the reference target as the target of the link described by the Link Object |
| 3.x         | Discriminator Object | `"mapping"` | n/a | for each name under `"mapping"`, if the value is not the name of a Schema Object under the Components Object, treat it as a reference to the schema to use when the discriminator field matches the mapping name |

Note that not all references are handled by replacing the source with the target.  Some are defined in terms of behavior, and **cannot** be replaced with an inline value.
