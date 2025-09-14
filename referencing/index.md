---
layout: default
title: Using References
nav_order: 7
has_children: true
has_toc: false
---

# Using References in OpenAPI Descriptions

OpenAPI Referencing is a powerful tool.  It allows managing document size and complexity, and allows re-using shared components and avoiding copy-paste or change management errors.

However, the history of referencing and the `"$ref"` keyword is complex, leading to slightly different behavior depending on the version of the OpenAPI Specification (OAS) that you are using, and on where in your OpenAPI Description (OAD) the reference occurs.  There are also other `"$ref"`-like keywords (`"operationRef"`, `"mapping"`) and behaviors (referencing by component name or operation ID) that are related but somewhat different.  Referencing can also be challenging to use due to incomplete and inconsistent support across different tools, some of which require references to be pre-processed before they can read the OAD.

The resources in this section explain how to use referencing, and what to look for when assessing the referencing support in your OpenAPI tools.

## The Future of References

There are plans to reduce the complexity around references in future OpenAPI Specifications.

The [Moonwalk project](https://github.com/OAI/sig-moonwalk/discussions) is considering a different approach that imports complete documents, associates them with namespaces, and only supports referencing by component name (not `"$ref"`).  A small example can be seen in the [Moonwalk deployments proposal](https://github.com/OAI/sig-moonwalk/blob/main/Deployments.md), and there are discussions around an [initial draft proposal for imports](https://github.com/OAI/sig-moonwalk/discussions/72) and a few ideas on [how to manage interactions with JSON Schema referencing](https://github.com/OAI/sig-moonwalk/discussions/73).

The [proposed Workflows Specification](https://github.com/OAI/sig-workflows/blob/main/versions/1.0.0.md) is already using a `"sourceDescription"` field that is not unlike the Moonwalk proposal.


