---
layout: default
title: Referencing API Descriptions
parent: The Arazzo Specification
nav_order: 2
---

# Referencing API Descriptions

A workflow calls operations, but it does not define them. Those definitions are in API descriptions that are usually written and published separately, so an Arazzo Description needs a way to state which documents it depends on and to refer to each of them by name.

This is the purpose of the `sourceDescriptions` field, which holds a list of [Source Description Objects](https://spec.openapis.org/arazzo/v1.1.0.html#source-description-object). An Arazzo Description **must** have at least one.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-source-description-object.svg"></object>
  <figcaption>Source Descriptions are implemented in the <a href="structure.html">Arazzo Specification Object</a> and locate OpenAPI, AsyncAPI, and other Arazzo documents.</figcaption>
</figure>

Our Tic Tac Toe example has a single source description, which points at the OpenAPI Description used throughout [The OpenAPI Specification Explained](../specification/):

```yaml
sourceDescriptions:
  - name: ticTacToe
    url: ../../../v3.1/tictactoe.yaml
    type: openapi
```

The object has three fields:

- `name` is required and identifies the source description within the Arazzo Description. It **must** be unique, and the specification recommends limiting it to letters, numbers, hyphens, and underscores.
- `url` is required and locates the document. It can be absolute or relative.
- `type` is optional and states the kind of document, which is `openapi`, `asyncapi`, or `arazzo`.

## Resolving the URL

Our `url` value is a relative reference, which is resolved against the base URI of the Arazzo Description. As we saw in [Establishing Identity with `$self`](structure.html#establishing-identity-with-self), the base URI is the value of `$self` if it is present, and is otherwise usually the location the document was retrieved from.

A `url` value identifies the document that describes an API, not the location of the API itself. The endpoint that a Step calls is determined by the [Server Object](https://spec.openapis.org/oas/latest.html#server-object) of the OpenAPI Description, and the base URI of the Arazzo Description plays no part in it.

If an absolute `url` value refers to another Arazzo Description, tooling **must** match it against the `$self` value of that document rather than relying on its location alone.

## Using More Than One Source

A workflow can span several APIs. Our [asynchronous example](../examples/arazzo/v1.1/tictactoe-events/arazzo.yaml) submits a move as a message and then reads the board using the Tic Tac Toe API, so it has two source descriptions:

```yaml
sourceDescriptions:
  - name: ticTacToe
    url: ../../../v3.1/tictactoe.yaml
    type: openapi
  - name: ticTacToeEvents
    url: asyncapi.yaml
    type: asyncapi
```

The same `operationId` could exist in both documents. When an Arazzo Description has more than one non-Arazzo source description, a Step **must** therefore name the source of its `operationId` using a [Runtime Expression](runtime-expressions.html):

```yaml
operationId: $sourceDescriptions.ticTacToe.get-board
```

## Resolving `$sourceDescriptions` Expressions

The part of the expression after the source name is resolved in a fixed order:

1. It is matched against the operations of an OpenAPI Description or the workflows of an Arazzo Description.
2. If there is no match, it is matched against the fields of the Source Description object, such as `url` and `type`.

This is what allows `operationPath` to use the location of the source:

```yaml
operationPath: "{$sourceDescriptions.ticTacToe.url}#/paths/~1board/get"
```

An operation with an `operationId` of `url` would take precedence over the field, so the expression above would no longer return the location of the document. Our Tic Tac Toe API does not have such an operation.

How tooling retrieves a source description, including any authentication this requires, is not described by the specification and we therefore do not cover it in this topic.

## Summary

In this topic we've learned that:

- An Arazzo Description refers to its API descriptions through named Source Description objects.
- A source description locates a document that describes an API. The API endpoint itself comes from that document.
- A Step must name the source of an operation if there is more than one non-Arazzo source description.
- `$sourceDescriptions` expressions resolve to an operation or workflow first and to a Source Description field second.
