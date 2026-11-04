---
layout: default
title: Composing Workflows
parent: The Arazzo Specification
nav_order: 10
---

# Composing Workflows

Tasks often share common parts. Several workflows may start with the same login sequence, or a larger task may consist of smaller tasks that already have workflows of their own. Repeating these Steps means that any change needs to be made in several places.

Arazzo allows a workflow to reuse another workflow in three ways: a Step can call a workflow, a workflow can state that another workflow **must** complete first, and an action can transfer control to a workflow. The target can be in the same document or in another Arazzo Description.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-workflow-composition.svg"></object>
  <figcaption>A <a href="steps.html">Step</a> can target a Workflow, and both Workflows and Steps can depend on others of their own kind.</figcaption>
</figure>

## Calling a Workflow from a Step

A Step uses the `workflowId` field to target a workflow rather than an operation. The `playOpening` workflow in our Tic Tac Toe example plays the center square by calling `playMove`:

```yaml
stepId: takeCenter
description: Play the center square
workflowId: playMove
parameters:
  - name: row
    value: 2
  - name: column
    value: 2
  - name: mark
    value: $inputs.mark
  - name: bearerToken
    value: $inputs.bearerToken
  - name: apiKey
    value: $inputs.apiKey
outputs:
  winner: $workflows.playMove.outputs.winner
```

The parameters of this Step differ from those in [Providing Parameters and Payloads](parameters.html) in two ways. They do not have an `in` field, because each one maps by name to an input of the target workflow. They also operate at the level of the workflow, so the caller doesn't need to know that `playMove` uses a bearer token in one Step and an API key in another.

The Step publishes a result of the workflow using a `$workflows` expression. This expression names the workflow rather than the Step that called it, so we call `playMove` only once in `playOpening` to keep it unambiguous.

From the perspective of the rest of `playOpening`, `takeCenter` is a Step like any other:

```yaml
outputs:
  winner: $steps.takeCenter.outputs.winner
  centerMark: $steps.confirmCenter.outputs.centerMark
```

## Depending on a Workflow

The `dependsOn` field of a workflow lists workflows that **must** complete before it is processed. Our `reviewOpening` workflow reads the board once the opening move has been played:

```yaml
workflowId: reviewOpening
summary: Report the state of the game after the opening move
dependsOn:
  - playOpening
```

This differs from calling a workflow, as it passes no parameters and returns no outputs directly. It states an ordering requirement between two workflows. Use a Step with a `workflowId` if a workflow needs to provide inputs or use the result of the other workflow.

Each value in the list is a `workflowId`. If the workflow is in another Arazzo Description, the value **must** be a `$sourceDescriptions` expression.

## Depending on a Step

A Step has its own `dependsOn` field, which lists Steps that **must** complete before it can be executed. This only establishes a prerequisite and does not trigger the execution of the referenced Steps.

The form of each value depends on where the Step is defined:

```yaml
dependsOn:
  - checkSquare
  - $workflows.playMove.steps.readBoard
  - $sourceDescriptions.sharedWorkflows.login.steps.getToken
```

These refer to a Step in the current workflow, a Step in another workflow in the same document, and a Step in another Arazzo Description.

This field is primarily intended for coordinating asynchronous work, which we discuss in [Coordinating Asynchronous Steps](async.html). The specification recommends ordering the `steps` list without `dependsOn` for a workflow that only contains synchronous Steps, which is how all the workflows in our main example work.

## Transferring Control to a Workflow

An [action](actions.html) can also target a workflow. A success or failure action with a `goto` type transfers control and doesn't return. A failure action with a `retry` type runs the workflow and then retries the current Step, which suits a task such as refreshing a credential:

```yaml
onFailure:
  - name: refreshCredential
    type: retry
    workflowId: refreshToken
    retryLimit: 1
    parameters:
      - name: refreshToken
        value: $inputs.refreshToken
    criteria:
      - condition: $statusCode == 401
```

As with a Step, the parameters of an action map to the inputs of the workflow and **must not** use `in`. Parameters can only be used in an action if it has a `workflowId`.

## Using Workflows from Other Documents

Workflows in another Arazzo Description are available if that document is listed as a [source description](sources.html) with a `type` of `arazzo`:

```yaml
sourceDescriptions:
  - name: sharedWorkflows
    url: https://example.com/workflows/arazzo.yaml
    type: arazzo
```

A Step then **must** use a `$sourceDescriptions` expression to reach them. The value of `workflowId` needs the same form in an action:

```yaml
stepId: login
workflowId: $sourceDescriptions.sharedWorkflows.login
```

Each document is self-contained in one respect, which is that [components](components.html) are scoped to the document that defines them. A workflow in another document uses its own components, and not those of the calling document.

How tooling shares state or credentials between workflows, beyond the parameters and outputs we have described, is not defined by the specification and we therefore do not cover it in this topic.

> The complete `playOpening` and `reviewOpening` workflows are in our [example Arazzo Description](../examples/arazzo/v1.1/tictactoe/arazzo.yaml).

## Summary

In this topic we've learned that:

- A Step can call a workflow, passing parameters that map to its inputs and using its outputs.
- The `dependsOn` field states that a workflow or Step must complete first, without triggering it or passing data.
- Actions can transfer control to a workflow, or run one before retrying a Step.
- Workflows in other documents are available through source descriptions with a `type` of `arazzo`, and each document uses its own components.
