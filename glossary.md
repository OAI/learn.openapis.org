---
layout: default
title: Glossary
nav_order: 3
---

This page defines concepts that are important to understanding OpenAPI, as well as terms and acronyms you are likely to encounter if you want to contribute to the specification discussions.

# Acronyms

These acronyms are commonly used in OpenAPI discussions, and are defined in the following section.

- **BGB**: Business Governance Board
- **OAD**: OpenAPI Description
- **OAI**: OpenAPI Initiative
- **OAS**: OpenAPI Specification
- **SIG**: Special Interest Group
- **TDC**: Technical Developer Community
- **TSC**: Technical Steering Committee
- **TOB**: Technical Oversight Board

# Definitions

- **Business Governance Board** (BGB): The group representing OAI members responsible for the initiatives budgets, trademarks, and possible future certification programs, as described in the [OAI Charter](https://www.openapis.org/participate/how-to-contribute/governance)
- **document**: A local file, network resource, or other distinct entity in a particular format such as JSON or YAML
  - **entry document**: The document in an OAD where processing begins, starting with an OpenAPI Object ([3.0](https://spec.openapis.org/oas/v3.0.3#openapi-object), [3.1](https://spec.openapis.org/oas/v3.1.0#openapi-object))
  - **referenced documents**: The documents in an OAD that are not the entry document
- **the Learn site**: This site, [learn.openapis.org](learn.openapis.org) ([repository](https://github.com/OAI/learn.openapis.org))
- **Moonwalk**: Codename and SIG for the next (post-3.x) major release of the OAS ([announcement](https://www.openapis.org/blog/2023/12/06/openapi-moonwalk-2024), [repository](https://github.com/OAI/sig-moonwalk))
- **OpenAPI Description** (OAD): One or more documents written according to a specific version of the OpenAPI Specification, that together describe an API
- **OpenAPI Initiative** (OAI): The organization responsible for the development of the OpenAPI Specification _(not to be confused with the unrelated and more recent "OpenAI")_, [website](https://openapis.org/)
- **OpenAPI Specification** (OAS): The formal requirements for the OpenAPI format, which exists in several versions (e.g., 3.0.3, 3.1.0) ([repository](https://github.com/OAI/OpenAPI-Specification))
- **Outreach Committee**: The group of volunteers dedicated to furthering the reach and impact of the OAS ([repository](https://github.com/OAI/Outreach))
- **Overlay Specification**: A proposed specification from the overlays SIG ([repository](https://github.com/OAI/Overlay-Specification))
- **Special Interest Group** (SIG): OpenAPI working groups focused on [specific topics](https://github.com/OAI/OpenAPI-Specification/blob/main/SPECIAL_INTEREST_GROUPS.md) related to the OAS or possible additional companion specifications
- **Technical Developer Community** (TDC): The community of developers and specification-writers who work on and provide feedback to OpenAPI projects ([weekly Zoom calls](https://github.com/OAI/OpenAPI-Specification/issues?q=is%3Aissue+is%3Aopen+%22Open+Community+%28TDC%29+Meeting%22) are on Thursdays from 9-10 AM US-Pacific)
- **Technical Steering Committee** (TSC): The [group of people](https://github.com/OAI/OpenAPI-Specification/blob/main/MAINTAINERS.md) charged with stewarding the OAI's specification work, as described in the [OAI Charter](https://www.openapis.org/participate/how-to-contribute/governance)
- **Workflows Specification**: A proposed specification from the workflows SIG ([repository](https://github.com/OAI/sig-workflows))

## Documents and OpenAPI Descriptions

An OpenAPI Description, or OAD, can be structured as one or more documents, connected by references.  Those documents are typically stored as local files with `.json` or `.yaml` (or `.yml`) extensions, or as HTTP-accessible network resources of type `application/openapi+json` or `application/openapi+yaml`.

## A note on the history of "document", "definition", and "description"

Up through OAS 3.0.3 and 3.1.0, the OAS contained a section titled "OpenAPI Document", with differing definitions depending the OAS version.  The terms "OpenAPI Definition", "OpenAPI Description", and other variations and combinations were also used within the specification and/or the [learn.openapips.org](learn.openapis.org) site.

In September 2023, the OAI Technical Steering Committee (TSC) agreed to standardize on "OpenAPI Description" for the complete logical entity that describes an API, and to reserve the term "document" (lower-cased) for its common meaning.  Resolving the debate between "OpenAPI Description" and "OpenAPI Definition" hinged on the observation that while "definition" is appropriate when the API code is generated from the OAD, it is not accurate when an OAD is written for an existing API.  The term "description" is accurate in both cases.
