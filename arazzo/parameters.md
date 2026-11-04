---
layout: default
title: Providing Parameters and Payloads
parent: The Arazzo Specification
nav_order: 7
---

# Providing Parameters and Payloads

An OpenAPI Description states which parameters and payload an operation accepts, but not the values to send. A workflow supplies those values for a specific purpose, often using data from the caller or from an earlier call.

Arazzo provides the [Parameter Object](https://spec.openapis.org/arazzo/v1.1.0.html#parameter-object) and the [Request Body Object](https://spec.openapis.org/arazzo/v1.1.0.html#request-body-object) for this purpose. They differ from the OpenAPI objects with similar names, in that they provide values rather than describing a parameter or message.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-parameter-object.svg"></object>
  <figcaption>Parameters are implemented in a <a href="workflows.html">Workflow</a> or a <a href="steps.html">Step</a>. A Request Body is implemented in a Step.</figcaption>
</figure>

## The Parameter Object

A Parameter object has three fields:

- `name` is required and is case sensitive.
- `in` is the location of the parameter.
- `value` is required and is the value to pass.

A parameter is uniquely identified by the combination of `name` and `in`, which together identify a parameter of the target operation. The `placeMark` Step in our Tic Tac Toe example supplies the coordinates of the square and a credential:

```yaml
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
```

### Parameter Location

The `in` field has the following possible values, which correspond to those in [OpenAPI](../specification/parameters.html#parameter-location):

- `path` for a parameter that forms part of the URL path.
- `query` for a single parameter in the query string.
- `querystring` for the entire query string as one value, which requires a target operation that defines a `querystring` parameter.
- `header` for an HTTP header. The name of a header is case insensitive.
- `cookie` for a cookie value.

The `in` field **must** be provided when the target is an operation. It is not used when the target is a workflow, as the parameters then map to the inputs of that workflow. We show this in [Composing Workflows](composing.html#calling-a-workflow-from-a-step).

### Parameter Value

The `value` field can be a constant, a [Runtime Expression](runtime-expressions.html), a string with embedded expressions, or a [Selector object](selecting-data.html). Our examples use three of these:

```yaml
- name: row
  value: 2
```

```yaml
- name: row
  in: path
  value: $inputs.row
```

```yaml
- name: Authorization
  in: header
  value: Bearer {$inputs.bearerToken}
```

A `querystring` value **must** resolve to a complete query string in the format the operation defines. This fragment targets a hypothetical operation, as the Tic Tac Toe API has no query parameters:

```yaml
- name: search
  in: querystring
  value: "status=active&limit={$inputs.limit}"
```

A list of parameters **must not** contain duplicates. Parameters defined for a [workflow](workflows.html#applying-values-to-every-step) can be overridden by a Step, but cannot be removed.

## The Request Body Object

A Request Body object provides the content of a request. Our `placeMark` Step sends the mark that the caller provided:

```yaml
requestBody:
  contentType: application/json
  payload: $inputs.mark
```

All of its fields are optional:

- `contentType` is the media type of the content. If it is omitted, the target operation determines how to serialize the content.
- `payload` is the content.
- `replacements` lists changes to make to the payload.

The Tic Tac Toe API accepts a single string as its payload, so our example passes one value. The `payload` field accepts several forms for operations that need more than this, including an object that contains expressions. The fragments below target a hypothetical operation:

```yaml
requestBody:
  contentType: application/json
  payload:
    game:
      player: $inputs.player
      mark: $inputs.mark
      rated: false
```

It can also be a string template, which is the approach to use for formats such as XML that cannot be represented naturally in YAML:

```yaml
requestBody:
  contentType: application/xml
  payload: |
    <move>
      <player>{$inputs.player}</player>
      <mark>{$inputs.mark}</mark>
    </move>
```

Expressions and Selector objects in a payload **must** be evaluated before the operation is called.

The `requestBody` field is intended for HTTP methods with defined semantics for content, such as `POST`, `PUT`, and `PATCH`. It is permitted with `GET`, `HEAD`, and `DELETE`, but the specification states that this should be avoided where possible.

## Replacing Values in a Payload

A payload can come from somewhere the workflow author doesn't control, or can be a large template where only a few values change. In these cases, the [Payload Replacement Object](https://spec.openapis.org/arazzo/v1.1.0.html#payload-replacement-object) sets values in specific locations without rewriting the whole payload:

```yaml
requestBody:
  contentType: application/json
  payload: $inputs.gameTemplate
  replacements:
    - target: /game/mark
      value: $inputs.mark
    - target: /game/level
      value: casual
```

Both `target` and `value` are required. The `target` field identifies the location in the payload, and `value` can be a constant, an expression, or a Selector object.

The optional `targetSelectorType` field states the type of expression that `target` uses. If it is omitted, `target` is a JSON Pointer for an `application/json` payload, and an XPath expression for an XML payload. It is therefore needed if you want to use JSONPath:

```yaml
replacements:
  - target: $.players[?(@.id == 'guest')].mark
    targetSelectorType: jsonpath
    value: $inputs.mark
```

The specification does not state how tooling should behave if a `target` does not match a location in the payload, so we do not cover this in this topic.

> The complete `placeMark` Step is in our [example Arazzo Description](../examples/arazzo/v1.1/tictactoe/arazzo.yaml).

## Summary

In this topic we've learned that:

- Arazzo parameters and request bodies supply values, whereas the OpenAPI objects with similar names describe what an operation accepts.
- A parameter is identified by its `name` and `in`, and `in` is not used when the target is a workflow.
- A payload can be a value, an object containing expressions, or a string template.
- Payload Replacement objects set values in specific locations in a payload.
