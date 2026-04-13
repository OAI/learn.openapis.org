---
layout: default
title: Add OpenAPI Descriptions to Source Control
parent: Best Practices
nav_order: 3
---

# Add OpenAPI Descriptions to Source Control

OpenAPI Descriptions are **not** just a documentation artifact: they are **first-class source files** which can drive a great number of automated processes, including boilerplate generation, unit testing and documentation rendering.

As such, OADs should be committed to source control, and, in fact, they should be among the first files to be committed. From there, they should also participate in Continuous Integration processes.
