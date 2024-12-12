---
layout: default
nav_order: 8
title: Overlays
has_children: true
has_toc: false
---

# Introduction to OpenAPI Overlay Specification

The [Overlay Specification](https://spec.openapis.org/overlay/latest.html) defines a document format for information that transforms an existing OpenAPI description yet remains separate from the OpenAPI description's source document(s).
The Overlay Specification defines a mechanism for providing consistent, deterministic updates to a given OpenAPI description, as an aid to automation throughout the API lifecycle.

An Overlay can be applied to an OpenAPI description, resulting in an updated OpenAPI description.

> **OpenAPI + Overlays = (better) OpenAPI**

One Overlay might be specific to one OpenAPI description, or general enough to be used with multiple OpenAPI descriptions.
Equally, one OpenAPI description pipeline might apply different Overlays during the workflow.

## Use cases for Overlays

Overlays support a range of scenarios, including:

- Translating documentation into another language
- Providing configuration information for different deployment environments
- Allowing separation of concerns for metadata such as gateway configuration or SLA information
- Supporting a traits-like capability for applying a set of configuration data, such as multiple parameters or multiple headers, for targeted objects
- Providing default responses or parameters where they were not explicitly provided
- Applying configuration data globally or based on filter conditions

## Resources for working with Overlays

The [GitHub repository for Overlays](https://github.com/oai/Overlay-Specification) is the main hub of activity on the Overlays project.
Check the issues and pull requests for what is currently in progress, and the discussions for details of future ideas and our regular meetings.

The project maintains a [list of tools for working with Overlays](https://github.com/OAI/Overlay-Specification/?tab=readme-ov-file#tools-that-support-overlays).

