---
layout: default
title: Defining Workflows
parent: The Arazzo Specification
nav_order: 3
---

# Defining Workflows

An API consumer starts a task with some information, makes a series of calls, and expects a result. The [Workflow Object](https://spec.openapis.org/arazzo/v1.1.0.html#workflow-object) describes this as a single unit, with declared inputs, an ordered list of [Steps](steps.html), and named outputs. Tooling or an API consumer can then treat the workflow much like a function, without needing to know the details of each call.

An Arazzo Description **must** contain at least one workflow and can contain as many as its author needs.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-workflow-object.svg"></object>
  <figcaption>Workflows are implemented in the <a href="structure.html">Arazzo Specification Object</a>. The objects shown in gray are explained in their own topics.</figcaption>
</figure>

Only `workflowId` and `steps` are required. The `workflowId` **must** be unique among the workflows of the Arazzo Description and is case sensitive. The optional `summary` and `description` fields state the objective of the workflow, and `description` can use CommonMark.

Our Tic Tac Toe example has a `playMove` workflow that identifies itself as follows:

```yaml
workflowId: playMove
summary: Play a move and report the state of the game
description: Places a mark if the requested square is empty, then reads the board.
```

The `steps` field lists the Steps in the order they are executed, which we discuss in [Describing Steps](steps.html).

## Declaring Inputs

Values supplied by the caller are declared in the `inputs` field, which is a JSON Schema 2020-12 object. Our `playMove` workflow needs a position, a mark, and the credentials for its operations:

```yaml
inputs:
  type: object
  required:
    - row
    - column
    - mark
    - bearerToken
    - apiKey
  properties:
    row:
      type: integer
      minimum: 1
      maximum: 3
    column:
      type: integer
      minimum: 1
      maximum: 3
    mark:
      type: string
      enum:
        - X
        - O
```

The fragment above leaves out the two credential properties, which are defined in the same way. Steps refer to these values using [Runtime Expressions](runtime-expressions.html) such as `$inputs.row`.

Using JSON Schema means that a value can be validated before any API is called. The schema does not have to match the corresponding schema in the OpenAPI Description. In our case `mark` only allows `X` and `O`, because a player cannot play the `.` value that the API uses for an empty square.

## Returning Outputs

The `outputs` field is a Map that names the values a workflow returns. Our `playMove` workflow returns the values published by its final Step:

```yaml
outputs:
  winner: $steps.readBoard.outputs.winner
  board: $steps.readBoard.outputs.board
```

Each key **must** contain only letters, numbers, periods, hyphens, and underscores. Each value is either a Runtime Expression or a [Selector object](selecting-data.html).

A caller that uses only these outputs does not depend on individual Steps, so a workflow author can reorganize the Steps without affecting that caller.

## Applying Values to Every Step

Some values apply to all the Steps in a workflow. The `parameters` field provides them in one place, and each one is passed to the operation or workflow that each Step calls. Our `reviewOpening` workflow supplies an API key this way, using a [reference to a reusable parameter](components.html):

```yaml
parameters:
  - reference: $components.parameters.apiKey
```

A Step can override a workflow-level parameter with its own definition, but cannot remove it. This means every Step in the workflow receives the parameter, so it is only appropriate if all the target operations accept it. Two of the Steps in `playMove` use a bearer token and one uses an API key, so `playMove` defines its parameters on each Step instead.

The remaining fields are explained in other topics:

- `successActions` and `failureActions` define actions for all Steps, which we discuss in [Controlling Workflow Flow](actions.html#workflow-level-actions).
- `dependsOn` lists workflows that **must** complete first, which we discuss in [Composing Workflows](composing.html).

> The complete example is in our [example Arazzo Description](../examples/arazzo/v1.1/tictactoe/arazzo.yaml).

The specification does not state how tooling should execute a workflow or how a caller should supply its inputs, and these are therefore out-of-scope for this topic.

## Summary

In this topic we've learned that:

- A workflow describes a task as a single unit, with inputs, ordered Steps, and outputs.
- Inputs are described using JSON Schema, and can be stricter than the operations they are passed to.
- Outputs name the values a workflow returns to its caller.
- Workflow-level parameters apply to all Steps, and can be overridden but not removed.
