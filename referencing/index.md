---
layout: default
title: Using References
nav_order: 5
has_children: true
has_toc: false
---

# Using References in OpenAPI Descriptions

OpenAPI Referencing is a powerful tool.  It allows managing document size and complexity, and allows re-using shared components and avoiding copy-paste or change management errors.

However, the history of referencing and the `"$ref"` keyword is complex, leading to slightly different behavior depending on the version of the OpenAPI Specification (OAS) that you are using, and on where in your OpenAPI Description (OAD) the reference occurs.  There are also other `"$ref"`-like keywords (`"operationRef"`, `"mapping"`) and behaviors (referencing by component name or operation ID) that are related but somewhat different.  Referencing can also be challenging to use due to incomplete and inconsistent support across different tools, some of which require references to be pre-processed before they can read the OAD.

This guide explains how to use referencing, and what to look for when assessing the referencing support in your OpenAPI tools.

- [Referencing FAQ](faq)
- [What are References?](what)
- Resolving References (forthcoming)
