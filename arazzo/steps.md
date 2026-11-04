---
layout: default
title: Describing Steps
parent: The Arazzo Specification
nav_order: 4
---

# Describing Steps

A workflow is made up of individual calls, each of which needs to state its target, the values it needs, and how to tell whether it worked. In Arazzo this is the job of the [Step Object](https://spec.openapis.org/arazzo/v1.1.0.html#step-object), which holds most of the content of an Arazzo Description. A workflow is an ordered list of Steps along with their inputs and outputs.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-step-object.svg"></object>
  <figcaption>Steps are implemented in a <a href="workflows.html">Workflow</a>. The objects shown in gray are explained in their own topics.</figcaption>
</figure>

A Step references an operation rather than describing it. It does not repeat the path, HTTP method, or schemas of the API call, because the API description already provides them. It identifies the target, then supplies the values and expectations that are specific to this point in the workflow.

Our Tic Tac Toe example has a `playMove` workflow with three Steps. The first calls the `get-square` operation to find out whether the requested square is empty:

```yaml
stepId: checkSquare
description: Find out whether the requested square is empty
operationId: get-square
parameters:
  - name: row
    in: path
    value: $inputs.row
  - name: column
    in: path
    value: $inputs.column
  - name: Authorization
    in: header
    value: Bearer {$inputs.bearerToken}
successCriteria:
  - condition: $statusCode == 200
```

The `stepId` is the only field required of every Step. It **must** be unique within the workflow and is the name that other Steps use to refer to this one. The `description` field is optional. Use it to state why the workflow makes this call, which often differs from what the operation does in general.

## Choosing a Target

A Step identifies one target, using one of these fields:

- `operationId` references an operation by its `operationId` value.
- `operationPath` references an operation by its location in a source description.
- `workflowId` references another workflow rather than an operation, which is discussed in [Composing Workflows](composing.html).
- `channelPath` references an AsyncAPI channel, which is discussed in [Coordinating Asynchronous Steps](async.html).

### Using `operationId`

Our `checkSquare` Step uses the value `get-square`, which is the `operationId` of the corresponding operation in the Tic Tac Toe OpenAPI Description. This is the preferred approach, as it is short and doesn't depend on how the API description is organized.

Our Arazzo Description has only one source description, so the plain value is not ambiguous. If there is more than one non-Arazzo source description the value **must** instead be a [Runtime Expression](https://spec.openapis.org/arazzo/v1.1.0.html#runtime-expressions) that names the source:

```yaml
operationId: $sourceDescriptions.ticTacToe.get-square
```

### Using `operationPath`

An `operationId` is optional in OpenAPI, so not every operation has one. In such cases a Step can use `operationPath`, which combines a Runtime Expression identifying the source description with a JSON Pointer to the operation. A call to the `get-board` operation in our example would look like this:

```yaml
operationPath: "{$sourceDescriptions.ticTacToe.url}#/paths/~1board/get"
```

The slash in the path is escaped as `~1`, as JSON Pointer requires. This form is harder to read and is tightly coupled to the structure of the API description, which is why the specification recommends preferring `operationId` where one exists.

## Supplying Values

The `parameters` list provides values for the parameters of the target operation, each identified by `name` and `in`. Our example takes the values for `row` and `column` from the inputs of the workflow using Runtime Expressions. We'll discuss the expressions themselves in [Using Runtime Expressions](runtime-expressions.html), and parameters and payloads in more depth in [Providing Parameters and Payloads](parameters.html).

### Supplying Credentials

Arazzo does not have a means to apply a Security Scheme to a Step, so credentials are supplied in the same way as any other parameter. The operations on a single square of our Tic Tac Toe API accept a bearer token, which we provide by embedding an input value in a string:

```yaml
- name: Authorization
  in: header
  value: Bearer {$inputs.bearerToken}
```

The `get-board` operation accepts an API key instead, so our third Step supplies that using the header named by the corresponding Security Scheme object:

```yaml
- name: api-key
  in: header
  value: $inputs.apiKey
```

The workflow author therefore needs to read the security requirements of each operation and map them to parameters. How the API consumer obtains these credentials is out-of-scope for Arazzo.

## Determining Success

The `successCriteria` list states what must be true for the Step to be considered successful. Each entry is a [Criterion Object](https://spec.openapis.org/arazzo/v1.1.0.html#criterion-object) and all of them **must** be satisfied. Our `checkSquare` Step expects a 200 HTTP return code, while the Step that places a mark also accepts a 202, because the API may complete that operation asynchronously:

```yaml
successCriteria:
  - condition: $statusCode == 200 || $statusCode == 202
```

This allows a workflow author to be specific about the outcome the workflow needs, which may be narrower than the set of responses the operation can return. Criteria are explained further in [Defining Success](success-criteria.html).

## Producing Outputs

A Step can publish values for later Steps or for the workflow to use. The `outputs` field is a Map of names to values, usually taken from the response. Our final Step reads the board and extracts two properties from the response body using a JSON Pointer:

```yaml
stepId: readBoard
description: Read the board and the winner, if there is one
operationId: get-board
parameters:
  - name: api-key
    in: header
    value: $inputs.apiKey
successCriteria:
  - condition: $statusCode == 200
outputs:
  winner: $response.body#/winner
  board: $response.body#/board
```

Without outputs, the response of a Step is not available to anything outside it. Named outputs also mean later Steps do not depend on the shape of the response payload.

## Execution Order

Steps are executed in the order in which they are listed, unless an [action](actions.html) says otherwise. When a Step is successful and specifies no action the next Step is executed, and when a Step fails and specifies no action the workflow stops.

> The complete example is in our [example Arazzo Description](../examples/arazzo/v1.1/tictactoe/arazzo.yaml).

## Summary

In this topic we've learned that:

- A Step represents a single call in a workflow, and is identified by a `stepId` that is unique within that workflow.
- A Step references its target rather than repeating it, preferably with an `operationId`.
- A Step supplies parameters, including credentials, and states the criteria for its success.
- Outputs make values from a Step available to the rest of the workflow.
