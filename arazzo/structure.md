---
layout: default
title: Structure of an Arazzo Description
parent: The Arazzo Specification
nav_order: 1
---

# Structure of an Arazzo Description

Most tasks an API consumer performs take more than one call. Playing a move in our Tic Tac Toe API, for example, means checking a square, placing a mark, and reading the board. An OpenAPI Description describes each of these operations, and [Links](../specification/links.html) can indicate that two of them are related, but neither describes the whole sequence. That knowledge is usually written in prose documentation, where tooling cannot use it.

An Arazzo Description makes this knowledge explicit in a format that is both human-readable and machine-readable. It does not replace an OpenAPI Description. It refers to operations that one or more API descriptions already define.

An Arazzo Description is a JSON object, represented in either JSON or YAML, and uses the same data types as JSON Schema Draft 2020-12. All field names are case sensitive. All examples in these pages are given in YAML, and [Structure of an OpenAPI Description](../specification/structure.html) compares the two formats.

An Arazzo Description can be split across several documents. The specification recommends naming the entry document `arazzo.yaml` or `arazzo.json`.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-object.svg"></object>
  <figcaption>The Arazzo Specification Object is the root of an Arazzo Description, and contains its source descriptions and workflows.</figcaption>
</figure>

## Minimal Arazzo Description Structure

The root of the document is the [Arazzo Specification Object](https://spec.openapis.org/arazzo/v1.1.0.html#arazzo-specification-object). Four of its fields are required, which we can see in a minimal description for our Tic Tac Toe API:

```yaml
arazzo: 1.1.0
info:
  title: Tic Tac Toe Workflows
  version: 1.0.0
sourceDescriptions:
  - name: ticTacToe
    url: ../../../v3.1/tictactoe.yaml
    type: openapi
workflows:
  - workflowId: playMove
    steps:
      - stepId: readBoard
        operationId: get-board
```

- `arazzo` is the version of the Arazzo Specification the description uses. Tooling **must** use this field to interpret the description.
- `info` provides metadata about the description.
- [`sourceDescriptions`](sources.html) lists the API descriptions the workflows apply to. There **must** be at least one.
- [`workflows`](workflows.html) lists the workflows themselves. There **must** be at least one, and each one has at least a `workflowId` and a list of `steps`.

The remaining fields are optional. [`components`](components.html) holds definitions that can be reused across workflows, and `$self` is explained later in this topic.

## The Info Object

The [Info Object](https://spec.openapis.org/arazzo/v1.1.0.html#info-object) describes the Arazzo Description for the people and tooling that consume it. Only `title` and `version` are required. The `summary` and `description` fields explain what the workflows are for. The `description` field can use CommonMark:

```yaml
info:
  title: Tic Tac Toe Workflows
  summary: Common gameplay workflows for the Tic Tac Toe API
  description: |
    This Arazzo Description shows how the operations of the Tic Tac Toe API
    work together to play a move and report the state of the game.
  version: 1.0.0
```

The `version` field is the version of this document, and `arazzo` is the version of the specification. Neither is the version of the API the description refers to.

## Establishing Identity with `$self`

Arazzo Descriptions refer to other documents, as our `url` value above shows, and relative references such as this one need a base URI to resolve against. By default, this is the location the document was retrieved from. A relative reference can therefore break if a description is copied, bundled, or served from more than one location.

The `$self` field states the URI of the description, which also serves as its base URI:

```yaml
arazzo: 1.1.0
$self: https://learn.openapis.org/examples/arazzo/v1.1/tictactoe/arazzo.yaml
```

The URI **must not** contain a fragment. With this value in place, our `url` value resolves to the same OpenAPI Description wherever the Arazzo document is stored. Our Tic Tac Toe example does not need `$self` as its relative reference only has to work within this repository, so it is not included in the complete example.

## Security Considerations

Unlike OpenAPI, Arazzo has no equivalent of the [Security Scheme object](../specification/security.html), and the specification does not enforce a security mechanism. The security requirements of an operation are stated in its API description, and a workflow author provides the credentials those operations need in the same way as any other value, which we show in [Describing Steps](steps.html#supplying-credentials).

> Processing an Arazzo Description can cause tooling to call arbitrary network resources, including unsafe operations. Do not treat Arazzo Descriptions from third parties as trusted. The consumer of a description is responsible for checking what it will do before executing it.

## Summary

In this topic we've learned that:

- An Arazzo Description describes how API operations are used together, and refers to the API descriptions that define those operations.
- The Arazzo Specification Object requires a specification version, metadata, at least one source description, and at least one workflow.
- A description can use `$self` to state its own identity, making its relative references independent of where it is stored.
- Security is not described by Arazzo, so descriptions should be checked before tooling executes them.
