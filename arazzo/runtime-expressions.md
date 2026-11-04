---
layout: default
title: Using Runtime Expressions
parent: The Arazzo Specification
nav_order: 5
---

# Using Runtime Expressions

An Arazzo Description is written at design time, but most of the values it needs do not exist until a workflow runs. A move depends on the input of the caller, and the winner of a game is only known once the API has responded. [Runtime Expressions](https://spec.openapis.org/arazzo/v1.1.0.html#runtime-expressions) bind the two together, by naming a value that tooling resolves during execution.

OpenAPI uses the same approach in [Callbacks](../specification/callbacks.html) and [Links](../specification/links.html). Arazzo uses it more widely, as data flow through a workflow depends on it.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-data-flow.svg"></object>
  <figcaption>Part of the data flow through our <code>playMove</code> workflow. Each label shows the expression that connects two stages.</figcaption>
</figure>

Our Tic Tac Toe example uses Runtime Expressions at each stage of this flow. Here they are in the final Step of the `playMove` workflow, and in the outputs of the workflow itself:

```yaml
stepId: readBoard
parameters:
  - name: api-key
    in: header
    value: $inputs.apiKey
outputs:
  winner: $response.body#/winner
```

```yaml
outputs:
  winner: $steps.readBoard.outputs.winner
```

The value of `$inputs.apiKey` comes from the caller, `$response.body#/winner` comes from the API response, and `$steps.readBoard.outputs.winner` comes from the Step. Each stage publishes a value that the next stage can refer to by name.

## Available Expressions

All expressions start with `$`. They are grouped by where the value comes from.

Values from the workflow:

- `$inputs.row` is an input of the current workflow.
- `$outputs.winner` is an output of the current workflow.
- `$steps.readBoard.outputs.winner` is an output of a Step in the current workflow.
- `$workflows.playMove.outputs.winner` and `$workflows.playMove.inputs.row` are the outputs and inputs of a named workflow.

Values from the current API call:

- `$url`, `$method`, and `$statusCode` are the URL, HTTP method, and HTTP return code.
- `$request.header.progressUrl`, `$request.query.name`, `$request.path.row`, and `$request.body` are parts of the request.
- `$response.header.Location` and `$response.body` are parts of the response.

Values from the current message, which are discussed in [Coordinating Asynchronous Steps](async.html):

- `$message.header.moveId` and `$message.payload` are parts of an AsyncAPI message.

Values from the Arazzo Description:

- `$sourceDescriptions.ticTacToe.url` is explained in [Referencing API Descriptions](sources.html#resolving-sourcedescriptions-expressions).
- `$components.parameters.apiKey` is explained in [Reusing Descriptions](components.html).
- `$self` is the URI set by the [`$self` field](structure.html#establishing-identity-with-self).

Names of inputs, outputs, and parameters are case sensitive, whereas header names are not.

## Selecting Part of a Value

The body of a response is often larger than the value a workflow needs. A JSON Pointer after a `#` character selects part of a body, payload, input, or output:

```yaml
outputs:
  winner: $response.body#/winner
```

JSON Pointer can also select an element of an array by its zero-based position, so `$response.body#/board/1/1` is the center square of the Tic Tac Toe board. For queries that a JSON Pointer can't express, or for data that isn't JSON, see [Selecting Data](selecting-data.html).

> The Arazzo Specification includes examples such as `$message.payload.orderId` that use a period instead of a JSON Pointer, which its expression grammar does not support for a body or payload. We use a JSON Pointer throughout these pages, as the grammar defines it. A period is available as an operator in [conditions](success-criteria.html).

## Embedding Expressions in Strings

An expression can be the entire value of a field, as in our examples above, or can be embedded in a longer string using curly braces. Our Tic Tac Toe example builds an `Authorization` header this way:

```yaml
- name: Authorization
  in: header
  value: Bearer {$inputs.bearerToken}
```

A string can contain several embedded expressions. The text surrounding them cannot contain literal `{` or `}` characters.

The two forms treat data types differently:

- An expression that is the entire value preserves the type of the value. `$inputs.row` remains an integer.
- An embedded scalar is converted to a string.
- An embedded string is inserted without change, which includes an XML response body that is stored as a string.
- An embedded object or array that has been parsed is serialized as JSON. This may not suit the target if the surrounding string isn't JSON.

Because of these rules, use the entire-value form wherever a type needs to be preserved.

## Execution Order and Expressions

An expression that refers to the output of a Step creates a dependency on that Step. Tooling **must** ensure that the Step completes before the expression is used, even if no [`dependsOn`](composing.html) field declares the dependency.

In a sequential workflow this means a Step cannot use the outputs of a Step listed after it, and the specification recommends that implementations report such a reference as an error.

The specification defines how an expression is resolved, but does not cover how tooling handles a value that is sensitive, such as our `bearerToken` input. We therefore do not cover the handling of such values in this topic.

## Summary

In this topic we've learned that:

- Runtime Expressions name values that are resolved while a workflow runs, which connects inputs, API responses, and outputs.
- Expressions can refer to the workflow, the current call or message, and the Arazzo Description.
- A JSON Pointer selects part of a value.
- An expression that is the entire value keeps its type, whereas embedding one in a string usually converts it to a string.
