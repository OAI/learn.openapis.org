---
layout: default
title: Defining Success
parent: The Arazzo Specification
nav_order: 8
---

# Defining Success

An HTTP return code in the 2xx range shows that an API accepted a request, but not that a workflow can continue. A search can return a 200 with no results, and an operation can return a 200 with a body that reports an error. A workflow author therefore needs to state which outcomes count as a success.

The [Criterion Object](https://spec.openapis.org/arazzo/v1.1.0.html#criterion-object) expresses these conditions. It is used in the `successCriteria` of a [Step](steps.html#determining-success) to determine the result of the Step, and in the `criteria` of an [action](actions.html) to determine whether the action applies.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/arazzo-criterion-object.svg"></object>
  <figcaption>Criteria are implemented in a <a href="steps.html">Step</a> and in <a href="actions.html">Success and Failure Actions</a>.</figcaption>
</figure>

A Criterion object has three fields:

- `condition` is required and is the condition to evaluate.
- `type` states how to evaluate it, and is `simple`, `regex`, `jsonpath`, or `xpath`. It is `simple` if omitted.
- `context` is a [Runtime Expression](runtime-expressions.html) that provides the value to apply the condition to. It **must** be provided if `type` is provided.

## Simple Conditions

A `simple` condition combines Runtime Expressions, literals, and operators, and is the type used throughout our `playMove` workflow:

```yaml
successCriteria:
  - condition: $statusCode == 200 || $statusCode == 202
```

The literals are `true`, `false`, `null`, numbers, and strings. A string **must** use single quotes, and a literal single quote is written as two single quotes.

The operators are:

- `<`, `<=`, `>`, `>=`, `==`, and `!=` for comparison.
- `!`, `&&`, and `||` for logic.
- `()` for grouping.
- `[]` for a zero-based index and `.` to dereference a property.

A condition passes if it evaluates to true, and fails if it evaluates to false or `null`. Three type rules can affect the result:

- String comparisons **must** be case insensitive, so `$response.body == 'x'` matches a mark of `X` in our Tic Tac Toe API.
- Numeric strings should be converted to numbers when compared with a numeric operator.
- `null` is only equal to itself. Comparing it with any other value evaluates to false.

## Regular Expressions

A `regex` condition applies a regular expression to the `context` value and passes if the expression matches. Our `reviewOpening` workflow uses this type to accept any 2xx HTTP return code:

```yaml
- context: $statusCode
  condition: '^2\d{2}$'
  type: regex
```

The condition fails if `context` evaluates to null or is undefined.

## JSONPath

A `jsonpath` condition applies a JSONPath expression to the `context` value and passes if the expression returns at least one node. It therefore tests whether matching data exists, rather than the value of that data. Our `reviewOpening` workflow uses it to confirm that the response contains a board:

```yaml
- context: $response.body
  condition: $.board[*]
  type: jsonpath
```

A filter expression allows a condition to test values as well. This fragment passes if any row of the board has an `X` in its first column:

```yaml
- context: $response.body
  condition: $.board[?@[0] == 'X']
  type: jsonpath
```

The condition fails if `context` evaluates to null or is undefined, or if the expression isn't valid.

## XPath

An `xpath` condition applies an XPath expression to the `context` value, typically an XML response. The Tic Tac Toe API returns JSON, so this fragment uses a hypothetical response:

```yaml
- context: $response.body
  condition: count(/board/square) > 0
  type: xpath
```

The condition passes if the expression returns true, a non-zero number, a non-empty string, or at least one node. These rules follow the Effective Boolean Value semantics of the XPath version in use, which is XPath 3.1 by default.

To use a different version of JSONPath or XPath, replace the string value of `type` with an [Expression Type object](selecting-data.html#the-expression-type-object).

## Using Expressions in Conditions

A `simple` condition uses Runtime Expressions directly, as we've seen. For the other types, an expression **must** be embedded in curly braces, and the whole condition **must** be quoted so that it can be parsed as YAML:

```yaml
- context: $response.body
  condition: '$.board[?@[0] == "{$inputs.mark}"]'
  type: jsonpath
```

Embedded expressions are evaluated and converted to strings first. The resulting string is then evaluated as the condition.

## Combining Criteria

All the criteria in a list **must** pass, which is equivalent to a logical AND. Our `confirmCenter` Step requires both a successful call and a square that is no longer empty:

```yaml
successCriteria:
  - condition: $statusCode == 200
  - condition: $response.body != '.'
```

If `successCriteria` is provided, it **must** contain at least one Criterion object. For an alternative between two values, use `||` within a single `simple` condition.

## Evaluation Errors

A condition that cannot be evaluated **must** fail, whether the cause is a syntax error, an invalid context such as JSONPath applied to XML, or an error at runtime. The specification recommends that tooling logs or reports the error.

A mistake in a condition can therefore appear as a failed Step rather than as an error in the description. Whether the Step then stops the workflow, retries, or transfers control depends on its [actions](actions.html).

The syntax of regular expressions, JSONPath, and XPath is defined elsewhere, so we do not cover it in this topic. The specification does not state which regular expression dialect to use, so keep patterns to syntax that is widely supported.

## Summary

In this topic we've learned that:

- Criteria state which outcomes count as a success and determine whether an action applies.
- Criteria can be simple conditions, regular expressions, JSONPath, or XPath, and all types other than `simple` need a `context`.
- All the criteria in a list must pass.
- A condition that cannot be evaluated fails.
