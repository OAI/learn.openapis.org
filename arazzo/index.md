---
layout: default
title: The Arazzo Specification
nav_order: 10
has_children: true
has_toc: false
---

# The Arazzo Specification

An OpenAPI Description tells us what each operation of an API does, but it says little about how to use those operations together to achieve something useful. The [Arazzo Specification](https://spec.openapis.org/arazzo/v1.1.0.html) addresses this by describing sequences of API calls, the data that flows between them, and what should happen as each call succeeds or fails.

This section provides an introduction for readers not yet familiar with Arazzo and is organized by topic. It explains version 1.1.0 of the specification and assumes you have some familiarity with the [OpenAPI Specification](../specification/).

The following pages introduce the structure of an Arazzo Description and its main building blocks.

- [Structure of an Arazzo Description](structure): `arazzo`, `$self`, and `info`.
- [Referencing API Descriptions](sources): `sourceDescriptions`.
- [Defining Workflows](workflows): `workflowId`, `inputs`, and `outputs`.
- [Describing Steps](steps): `stepId`, `operationId`, and `operationPath`.
- [Using Runtime Expressions](runtime-expressions): expression syntax and `outputs`.
- [Selecting Data](selecting-data): the Selector and Expression Type objects.
- [Providing Parameters and Payloads](parameters): `parameters` and `requestBody`.
- [Defining Success](success-criteria): `successCriteria` and the Criterion object.
- [Controlling Workflow Flow](actions): `onSuccess`, `onFailure`, `successActions`, and `failureActions`.
- [Composing Workflows](composing): step `workflowId` and `dependsOn`.
- [Reusing Descriptions](components): `components` and the Reusable object.
- [Coordinating Asynchronous Steps](async): `channelPath`, `action`, `correlationId`, and `timeout`.
