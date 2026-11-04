---
layout: default
title: Reusing Descriptions
parent: The Arazzo Specification
nav_order: 11
---

# Reusing Descriptions

The Steps of a workflow often need the same values and behavior. Our `playMove` workflow defines the same `row`, `column`, and `Authorization` parameters on two Steps, and each new workflow for the Tic Tac Toe API would need them again. Each duplicate has to be updated whenever the definition changes.

The [Components Object](https://spec.openapis.org/arazzo/v1.1.0.html#components-object) holds definitions that can be reused anywhere in an Arazzo Description, and the [Reusable Object](https://spec.openapis.org/arazzo/v1.1.0.html#reusable-object) references them. This is the same approach as [Reusing Descriptions](../specification/components.html) in OpenAPI, with a different syntax for references.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-components-object.svg"></object>
  <figcaption>The Components Object is implemented in the <a href="structure.html">Arazzo Specification Object</a>. Reusable objects can replace parameters and actions in Workflows and Steps.</figcaption>
</figure>

## The Components Object

The Components object has four optional fields, each of which is a Map:

- `inputs` holds JSON Schema objects.
- `parameters` holds [Parameter objects](parameters.html).
- `successActions` and `failureActions` hold [Success and Failure Action objects](actions.html).

Each key **must** contain only letters, numbers, periods, hyphens, and underscores. A component has no effect unless something references it.

Our Tic Tac Toe example defines the following, along with a `column` parameter that matches `row`:

```yaml
components:
  inputs:
    credentials:
      type: object
      required:
        - bearerToken
        - apiKey
      properties:
        bearerToken:
          type: string
          description: JWT used by the single square operations
        apiKey:
          type: string
          description: API key used by the whole board operation
  parameters:
    row:
      name: row
      in: path
      value: $inputs.row
    bearerToken:
      name: Authorization
      in: header
      value: Bearer {$inputs.bearerToken}
    apiKey:
      name: api-key
      in: header
      value: $inputs.apiKey
  failureActions:
    tryAgain:
      name: tryAgain
      type: retry
      retryAfter: 1
      retryLimit: 3
      criteria:
        - condition: $statusCode >= 500
```

The key is the name used to reference the component, and is separate from any `name` field in the object. The key `bearerToken` refers to a parameter named `Authorization`, for example.

## The Reusable Object

Parameters and actions are referenced using a Reusable object, which has a required `reference` field containing a [Runtime Expression](runtime-expressions.html). Our `reviewOpening` workflow uses it for both a parameter and a failure action:

```yaml
parameters:
  - reference: $components.parameters.apiKey
failureActions:
  - reference: $components.failureActions.tryAgain
```

A Reusable object can be used in the `parameters` of a workflow, Step, or action, in `successActions` and `failureActions`, and in `onSuccess` and `onFailure`. It cannot be extended, and any additional properties **must** be ignored.

### Overriding a Parameter Value

A reference to a parameter can also provide a `value` field, which sets the value of the referenced parameter. Our `confirmCenter` Step always checks the center square, so it reuses the `row` and `column` parameters with fixed values, rather than the `$inputs` expressions defined in the component:

```yaml
parameters:
  - reference: $components.parameters.row
    value: 2
  - reference: $components.parameters.column
    value: 2
  - reference: $components.parameters.bearerToken
```

The `value` field only applies to references to parameters. A reference to an action can't change any part of the action.

## Reusing Inputs

Input schemas are the exception, as they use the standard JSON Schema `$ref` keyword rather than a Reusable object. Our `playOpening` workflow combines the shared credentials with an input of its own:

```yaml
inputs:
  $ref: "#/components/inputs/credentials"
  required:
    - mark
  properties:
    mark:
      type: string
      enum:
        - X
        - O
```

References **must** support both JSON Pointer fragments, as shown above, and the plain-name fragments defined by the JSON Schema `$anchor` keyword.

## Scope of Components

Components are scoped to the document that defines them. If a Step calls a workflow in [another Arazzo Description](composing.html#using-workflows-from-other-documents), the workflow uses the components of its own document. You therefore cannot use components to change the behavior of a workflow in another document.

## When to Use Components

Components need to be read in two places, so using them has a cost for the reader. This is why our `playMove` workflow defines its parameters and actions directly, as each earlier topic can show a complete Step. In a real description the choice depends on how often a definition repeats and how likely it is to change.

Credentials and retry policies are good candidates. They tend to repeat across many Steps, and they need to change together.

Which definitions to share across a set of Arazzo Descriptions is a design decision for each workflow author, and the specification provides no mechanism for sharing components across documents. We therefore do not cover this in this topic.

> The complete `components` object is in our [example Arazzo Description](../examples/arazzo/v1.1/tictactoe/arazzo.yaml).

## Summary

In this topic we've learned that:

- The Components object holds input schemas, parameters, and actions for reuse within a document.
- Parameters and actions are referenced using a Reusable object, and a reference to a parameter can set its value.
- Input schemas are referenced using the JSON Schema `$ref` keyword.
- Components are scoped to the document that defines them.
