---
layout: default
title: Controlling Workflow Flow
parent: The Arazzo Specification
nav_order: 9
---

# Controlling Workflow Flow

Workflows often need to branch, repeat, or stop early. A call may show that the next call isn't needed, a temporary failure may justify another attempt, and some failures end the task. Without a way to describe these decisions, every API consumer has to work them out and implement them independently.

Arazzo describes such decisions using the [Success Action Object](https://spec.openapis.org/arazzo/v1.1.0.html#success-action-object) and the [Failure Action Object](https://spec.openapis.org/arazzo/v1.1.0.html#failure-action-object). A Step lists the actions that apply to it in `onSuccess` and `onFailure`, which are evaluated after its [success criteria](steps.html#determining-success) determine the outcome of the Step.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-action-objects.svg"></object>
  <figcaption>Actions are implemented in a <a href="steps.html">Step</a> and can also be defined for all the Steps in a Workflow.</figcaption>
</figure>

Both fields are optional. If `onSuccess` is omitted the next Step in the list is executed. If `onFailure` is omitted the workflow stops and returns. A sequence that only needs this behavior therefore doesn't need any actions.

Each action has a `name` and a `type`, and can have `criteria` that determine whether it applies. The types differ for success and failure:

- `end` is available to both, and ends the workflow.
- `goto` is available to both, and transfers control to another Step or workflow.
- `retry` is available only to failure actions, and runs the Step again.

Our Tic Tac Toe example uses each of these in the `playMove` workflow:

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-play-move-flow.svg"></object>
  <figcaption>The paths through the <code>playMove</code> workflow. Each label names the condition and, in brackets, what happens next.</figcaption>
</figure>

## Transferring Control with `goto`

Our `checkSquare` Step succeeds whenever the API returns the state of the square, but a mark can't be placed if the square is already taken. A success action with a `goto` type skips the next Step in this case:

```yaml
onSuccess:
  - name: squareTaken
    type: goto
    stepId: readBoard
    criteria:
      - condition: $response.body != '.'
```

In our Tic Tac Toe API the value `.` indicates an empty square. If the square has any other value, control transfers to `readBoard`. If it is empty, the criteria are not met, no action applies, and execution continues with the next Step.

The `markSquare` [Link](../specification/links.html) in our OpenAPI Description describes the same behavior: "Operation to use if the mark value returned indicates the square is empty". The Link states this in prose for a human reader, whereas Arazzo expresses it as a condition that tooling can evaluate.

A `goto` action targets either a `stepId` in the current workflow or a `workflowId`, but not both. A transfer is one-way, so control doesn't come back to the Step that made it.

## Stopping with `end`

Some failures can't be fixed by trying again. Our Tic Tac Toe API returns a 400 HTTP return code if the coordinates or mark are invalid or if the square is not empty, so the workflow stops:

```yaml
onFailure:
  - name: moveRejected
    type: end
    criteria:
      - condition: $statusCode == 400
```

The `end` type ends the workflow and returns context to the caller with any applicable outputs. A failure with no matching action has the same outcome, but an explicit action records that the workflow author has considered the case.

## Trying Again with `retry`

Other failures are temporary. The `retry` type runs the current Step again, and is the only type that uses the `retryAfter` and `retryLimit` fields:

```yaml
- name: tryAgain
  type: retry
  retryAfter: 1
  retryLimit: 3
  criteria:
    - condition: $statusCode >= 500
```

`retryAfter` is the delay in seconds before the next attempt, although a `Retry-After` header in the response should take precedence over this value. `retryLimit` is the number of times the Step may be retried and, if it is omitted, a single retry is attempted. Our Tic Tac Toe OpenAPI Description doesn't describe any 5xx responses, but they can be returned by almost any API, and they illustrate that actions are not limited to the responses a description defines.

Retrying is only safe if repeating the operation is safe. That is the case here because `put-square` uses the HTTP `PUT` method, which is idempotent, but a workflow author needs to check this for each operation.

A `retry` action can also name a `stepId` or `workflowId`. In this case the referenced Step or workflow is executed first and control then returns so the current Step can be retried, for example after refreshing an expired access token.

## Choosing Between Actions

An action list is evaluated in order, and when several actions have similar criteria the first one that matches is executed. All the criteria of an action **must** be satisfied for it to apply. In our `placeMark` Step both failure actions are in the same list, and their criteria don't overlap, so the order makes no difference:

```yaml
onFailure:
  - name: moveRejected
    type: end
    criteria:
      - condition: $statusCode == 400
  - name: tryAgain
    type: retry
    retryAfter: 1
    retryLimit: 3
    criteria:
      - condition: $statusCode >= 500
```

If a list contains further actions after a `retry`, the `retryLimit` **must** be exhausted before they are executed.

## Workflow-Level Actions

The `successActions` and `failureActions` fields of the [Workflow Object](https://spec.openapis.org/arazzo/v1.1.0.html#workflow-object) define actions for all the Steps in a workflow, such as retrying any Step on a temporary failure:

```yaml
workflows:
  - workflowId: playMove
    failureActions:
      - name: tryAgain
        type: retry
        retryAfter: 1
        retryLimit: 3
        criteria:
          - condition: $statusCode >= 500
```

A Step can override a workflow-level action with a new definition, but can never remove it. Our example doesn't use this approach as only `placeMark` should be retried. Actions can also be shared across workflows, which is discussed in [Reusing Descriptions](components.html).

## What Our Example Does Not Handle

As we noted in [Describing Steps](steps.html#determining-success), `placeMark` treats a 202 HTTP return code as a success, even though the API has only accepted the move at that point. Our workflow continues to `readBoard` immediately, so the board it returns may not yet include the new mark. Our example does not handle this case, which would require polling the board or using the [callback](../specification/callbacks.html) that the API provides.

## Summary

In this topic we've learned that:

- Steps run in sequence and a failure stops the workflow by default, so actions are only needed to change this behavior.
- Success actions can end a workflow or transfer control, and failure actions can also retry a Step.
- Criteria decide whether an action applies, and the first matching action in a list is the one executed.
- Actions defined for a workflow apply to all its Steps, and can be overridden but not removed.
