---
layout: default
title: Selecting Data
parent: The Arazzo Specification
nav_order: 6
---

# Selecting Data

A JSON Pointer in a [Runtime Expression](runtime-expressions.html#selecting-part-of-a-value) selects a single location in a JSON document, and that location has to be known in advance. It cannot filter an array by the value of a property, and it does not apply to XML. A workflow may need to do either of these to extract a value from an API response.

The [Selector Object](https://spec.openapis.org/arazzo/v1.1.0.html#selector-object) addresses this by applying a JSONPath, XPath, or JSON Pointer expression to a value that a Runtime Expression provides. The [Expression Type Object](https://spec.openapis.org/arazzo/v1.1.0.html#expression-type-object) can then state which version of the query language an expression uses.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-selector-object.svg"></object>
  <figcaption>Selector objects can provide output, parameter, and payload values. Selector and <a href="success-criteria.html">Criterion</a> objects can both use an Expression Type object.</figcaption>
</figure>

## The Selector Object

A Selector object has three fields, all of which are required:

- `context` is a Runtime Expression that **must** evaluate to structured data.
- `selector` is the expression to apply to that data.
- `type` is the type of the expression, which is `jsonpath`, `xpath`, or `jsonpointer`.

Our Tic Tac Toe example has a `reviewOpening` workflow that reads the board and publishes two values using Selector objects:

```yaml
outputs:
  winner: $response.body#/winner
  centerMark:
    context: $response.body
    selector: $.board[1][1]
    type: jsonpath
  topRow:
    context: $response.body
    selector: /board/0
    type: jsonpointer
```

The `centerMark` output uses JSONPath to select the center square, as array positions start at zero. The `topRow` output uses a JSON Pointer to select the first row of the board.

These values could also be written as Runtime Expressions, as `$response.body#/board/1/1` and `$response.body#/board/0`. We use the shorter form in `winner`, which is the better choice for a fixed location in a JSON document. Our Selector objects show the syntax, but they are not necessary for a response this small.

## Choosing an Expression Type

A Selector object is needed when a Runtime Expression can't express the query. JSONPath can, for example, select items from a list based on their content. The Tic Tac Toe API does not return such a list, so this fragment uses a hypothetical `items` array:

```yaml
outputs:
  firstItemId:
    context: $response.body
    selector: $.items[?(@.available == true)].id
    type: jsonpath
```

XPath serves the same purpose for XML. This fragment selects a value from a hypothetical XML response:

```yaml
outputs:
  invoiceNumber:
    context: $response.body
    selector: /Invoice/Header/InvoiceNumber
    type: xpath
```

## Where Selector Objects Can Be Used

The fragments above are in `outputs`, which is the most common use. A Selector object can also provide:

- The `value` of a [Parameter object](parameters.html).
- A value in the `payload` of a [Request Body object](parameters.html#the-request-body-object).
- The `value` of a [Payload Replacement object](parameters.html#replacing-values-in-a-payload).

For example, a Step can pass a value selected from an earlier response as a parameter, without first publishing it as a separate output:

```yaml
parameters:
  - name: invoiceNumber
    in: query
    value:
      context: $steps.fetchInvoice.outputs.invoice
      selector: /Invoice/Header/InvoiceNumber
      type: xpath
```

## The Expression Type Object

Query languages have more than one version, and the same expression can behave differently in each. By default, `jsonpath` means RFC 9535, `xpath` means XPath 3.1, and `jsonpointer` means RFC 6901.

If an API or a tool needs a different version, an Expression Type object replaces the string value of `type`. Both of its fields are required:

```yaml
outputs:
  invoiceNumber:
    context: $response.body
    selector: /Invoice/Header/InvoiceNumber
    type:
      type: xpath
      version: xpath-30
```

The allowed values for `version` are:

- `rfc9535` or `draft-goessner-dispatch-jsonpath-00` for JSONPath.
- `xpath-31`, `xpath-30`, `xpath-20`, or `xpath-10` for XPath.
- `rfc6901` for JSON Pointer.

Implementations **must** apply the semantics of the stated version. Only declare a version if you need something other than the default.

The syntax of JSONPath and XPath is defined by their own specifications, so we do not cover it in this topic.

> The complete `reviewOpening` workflow is in our [example Arazzo Description](../examples/arazzo/v1.1/tictactoe/arazzo.yaml).

## Summary

In this topic we've learned that:

- A Selector object applies a JSONPath, XPath, or JSON Pointer expression to a value provided by a Runtime Expression.
- A Runtime Expression with a JSON Pointer is sufficient for a fixed location in JSON, and a Selector object is needed for queries and XML.
- Selector objects can provide outputs, parameter values, and payload values.
- An Expression Type object states the version of a query language if the default is not suitable.
