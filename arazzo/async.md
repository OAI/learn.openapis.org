---
layout: default
title: Coordinating Asynchronous Steps
parent: The Arazzo Specification
nav_order: 12
---

# Coordinating Asynchronous Steps

An HTTP operation returns a response to the same call, so a workflow can move to its next Step when the call completes. Message-based APIs don't behave like this. A workflow sends a message and later receives a separate message containing the result, possibly from a different channel. It therefore needs a way to match the two messages, a limit on how long to wait, and a way to stop later Steps from starting too early.

Arazzo supports these requirements through Steps that target an [AsyncAPI](https://www.asyncapi.com/) description. These use the fields of the [Step Object](https://spec.openapis.org/arazzo/v1.1.0.html#step-object) that we did not cover in [Describing Steps](steps.html).

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-async-step.svg"></object>
  <figcaption>A Step can target an AsyncAPI description through a <a href="sources.html">Source Description</a>. The fields for doing so are <code>operationId</code>, <code>channelPath</code>, <code>action</code>, <code>correlationId</code>, <code>timeout</code>, and <code>dependsOn</code>.</figcaption>
</figure>

## Our Example

The Tic Tac Toe API has no message-based operations, so we use a [small AsyncAPI description](../examples/arazzo/v1.1/tictactoe-events/asyncapi.yaml) that accepts moves on one channel and publishes the results on another. Our [example workflow](../examples/arazzo/v1.1/tictactoe-events/arazzo.yaml) submits a move, waits for the result, and then reads the board using the OpenAPI Description:

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-async-flow.svg"></object>
  <figcaption>The <code>playMoveByMessage</code> workflow. Solid arrows show messages and dashed arrows show dependencies between Steps.</figcaption>
</figure>

The Arazzo Description has two [source descriptions](sources.html#using-more-than-one-source), so each `operationId` names its source.

## Sending a Message

The first Step sends the move. The `action` field states whether a Step sends to or receives from a channel, and its values are `send` and `receive`:

```yaml
stepId: submitMove
description: Send a message containing the move
operationId: $sourceDescriptions.ticTacToeEvents.submitMove
action: send
parameters:
  - name: moveId
    in: header
    value: $inputs.moveId
requestBody:
  payload:
    row: $inputs.row
    column: $inputs.column
    mark: $inputs.mark
```

The `action` field describes what the workflow does, which can be the opposite of the `action` in the AsyncAPI description. Our AsyncAPI operation has an `action` of `receive` because the application receives the move, whereas the workflow sends it.

A `send` Step completes as soon as the message is sent. Arazzo does not model acknowledgment from a broker or confirmation of delivery, so a successful `send` Step shows only that the message was sent.

## Receiving a Message

The second Step waits for the result:

```yaml
stepId: receiveResult
description: Wait for the message containing the result of the move
operationId: $sourceDescriptions.ticTacToeEvents.publishMoveResult
action: receive
correlationId: $inputs.moveId
timeout: 6000
dependsOn:
  - submitMove
successCriteria:
  - condition: $message.payload#/accepted == true
outputs:
  winner: $message.payload#/winner
```

### Matching Messages with `correlationId`

Many messages can pass through a channel, including results for other moves. The `correlationId` field restricts the Step to messages with a matching identifier, and it only applies to a Step with an `action` of `receive`.

The value **must** be consistent with the correlation ID that the AsyncAPI description defines. Ours states that the identifier is in the `moveId` header of the message:

```yaml
correlationId:
  description: Identifies the move across its request and result messages
  location: $message.header#/moveId
```

Our workflow takes the value from its `moveId` input, and sends the same value as a header of the first message.

### Limiting the Wait with `timeout`

The `timeout` field is the maximum time to wait for a Step to complete, in milliseconds. If no matching message arrives in that time the Step fails, which triggers any `onFailure` actions and otherwise fails the workflow.

### Defining Success

A channel can carry more than one kind of message, and a message can report a failure in its payload. The specification therefore recommends that a `receive` Step defines `successCriteria` that evaluate the message. Ours requires that the move was accepted, as a rejected move still produces a result message.

A workflow author can omit `successCriteria` only if the channel defines a single message type that unambiguously represents success, and its payload has no fields that indicate an error. In this case, any message that matches the `correlationId` within the timeout counts as a success.

Message values are available through `$message.header` and `$message.payload`, which work in the same way as [`$response`](runtime-expressions.html#available-expressions).

## Waiting for Asynchronous Work

Step-level `dependsOn` is primarily intended for this situation. It creates a join point, so that a Step does not start until the asynchronous work it needs has finished. Our final Step reads the board and doesn't use any output from `receiveResult`, but it still needs the move to be complete:

```yaml
stepId: readBoard
description: Read the board once the move is complete
operationId: $sourceDescriptions.ticTacToe.get-board
dependsOn:
  - receiveResult
parameters:
  - name: api-key
    in: header
    value: $inputs.apiKey
successCriteria:
  - condition: $statusCode == 200
outputs:
  board: $response.body#/board
```

The specification recommends declaring `dependsOn` in this situation, whether or not the Step references the output of the other Step. Tooling **must** respect these dependencies, and **must** also treat an output reference such as `$steps.receiveResult.outputs.winner` as a dependency. A tool that only supports sequential execution **must** run Steps in an order that satisfies both.

## Using `channelPath`

As `operationPath` does for OpenAPI, the `channelPath` field references a channel by its location in the AsyncAPI description rather than by an `operationId`:

```yaml
stepId: receiveResult
channelPath: "{$sourceDescriptions.ticTacToeEvents.url}#/channels/moveResults"
action: receive
```

If the operation has an `operationId`, the specification recommends using that instead.

> Although the Arazzo Specification describes `action` as applicable to AsyncAPI Steps, the JSON Schema requires it on them. Always provide it.

The specification doesn't describe how tooling connects to a message broker or authenticates with it, so we do not cover this in this topic.

## Summary

In this topic we've learned that:

- Steps can target AsyncAPI descriptions, using `action` to state whether they send or receive a message.
- A `send` Step completes when the message is sent, and a `receive` Step waits for a matching message.
- `correlationId` matches a message to its request, `timeout` limits the wait, and `successCriteria` evaluates the message.
- Step-level `dependsOn` stops a Step from starting until the asynchronous work it needs has finished.
