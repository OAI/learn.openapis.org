---
layout: default
title: Resolve References
nav_order: 2
parent: Using References
---

## Resolve References

A reference is said to be _resolved_ within a tool if:

* Its target has been identified
* Any modifications to the target required by the OAS (e.g. because of fields adjacent to `"$ref"`) have been performed on a copy of the target
* The resulting target value has been associated with the reference source in some way that the tool can easily use when needed

A reference is said to be _removed_ if it has been replaced by its (possibly modified) target.

Reference resolution usually preserves the referencing information such as the URI used to identify the target, while reference removal usually discards it.  In many cases this is not significant, except that not knowing how the parsed OAD relates to the references in your JSON or YAML document may make debugging more difficult.

While plain JSON documents form a [tree](https://en.wikipedia.org/wiki/Tree_%28data_structure%29) structure, an OpenAPI Description with resolved references is not _necessarily_ a tree, but a [graph](https://en.wikipedia.org/wiki/Graph_%28abstract_data_type%29).

Tools that resolve references in-memory and work with the graph structure can process all OADs. Tools that rely on reference removal, either as part of the tool or by a separate pre-processing tool, can only support OADs that form trees.

