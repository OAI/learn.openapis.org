---

parent: The OpenAPI Specification Explained
nav_order: 3

---

# Content of Message Bodies

[The previous page](specification-paths.md) showed how to define API endpoints but it didn't explain how to describe the content of the responses through the `content` field. This page clarifies this important field, which can also be used to describe queries, as shown in the [Parameters page](specification-parameters.md).

## The `content` Field

This field can be found both in [Response Objects](https://spec.openapis.org/oas/v3.0.3#responseObject) and [Request Body Objects](https://spec.openapis.org/oas/v3.0.3#requestBodyObject). It is a map pairing standard [RFC6838 Media Types](https://tools.ietf.org/html/rfc6838) with OpenAPI [Media Type Objects](https://spec.openapis.org/oas/v3.0.3#mediaTypeObject).

<figure style="text-align:center">
  <object type="image/svg+xml" data="img/content-field.svg"></object>
  <figcaption>The Response Object is explained in the <a href="specification-paths.md">API Endpoints</a> page.<br/>The Request Body Object is explained in the <a href="specification-parameters.md">Parameters and Payload of an Operation</a> page.</figcaption>
</figure>

This allows returning content (or accepting content) in **different formats**, each one with a different structure described by the Media Type Object. **Wildcards** are accepted for the media types, with the more specific ones taking precedence over the generic ones.

```yaml
content:
  application/json:
    ...
  text/html:
    ...
  text/*:
    ...
```

## The Media Type Object

The [Media Type Object](https://spec.openapis.org/oas/v3.0.3#mediaTypeObject) describes the structure of the content and provides examples for documentation and mocking purposes (examples are dealt with in the [Documentation page](specification-docs.md)).

The structure is described in the `schema` field explained next.

```yaml
content:
  application/json:
    schema:
      ...
```

## The Schema Object

The [Schema Object](https://spec.openapis.org/oas/v3.0.3#schemaObject) defines a data type which can be a primitive (integer, string, ...), an array or an object depending on its `type` field.

`type` is a string and its possible values are: `number`, `string`, `boolean`, `array` and `object`. Depending on the selected type a number of other fields are available to further specify the data format.

For example, for `string` types the length of the string can be limited with `minLength` and `maxLength`. Similarly, `integer` types, accept `minimum` and `maximum` values. No matter the type, if the amount of options for the data is limited to a certain set, it can be specified with the `enum` array. All these properties are listed in the [Schema Object](https://spec.openapis.org/oas/v3.0.3#schemaObject) specification.


Example integer with limited range:

```yaml
content:
  application/json:
    schema:
      type: integer
      minimum: 1
      maximum: 100
```

Example string with only three valid options:

```yaml
content:
  application/json:
    schema:
      type: string
      enum:
      - Alice
      - Bob
      - Carl
```

Array types must have an `items` field, which is a [Schema Object](https://spec.openapis.org/oas/v3.0.3#schemaObject) itself, and defines the type for each element of the array. Additionally, the size of the array can be limited with `minItems` and `maxItems`.

```yaml
content:
  application/json:
    schema:
      type: array
      minItems: 1
      maxItems: 10
      items:
        type: integer
```

Finally, object types must have a `properties` field listing the properties of the object. This field is a map pairing property names with a [Schema Object](https://spec.openapis.org/oas/v3.0.3#schemaObject) defining their type. This allows building data types as complex as required.

Here's an example defining an object with two fields: a `productName` string and a `productPrice` number:

```yaml
content:
  application/json:
    schema:
      type: object
      properties:
        productName:
          type: string
        productPrice:
          type: number
```

## Tic Tac Toe Example

The [Tic Tac Toe sample API](examples/tictactoe.yaml) given so far has one endpoint with one unspecified response. The snippet below adds the description of this content:

```yaml
openapi: 3.0.3
info:
  title: Tic Tac Toe
  description: |
    This API allows writing down marks on a Tic Tac Toe board
    and requesting the state of the board or of individual squares.
  version: 1.0.0
paths:
  # Whole board operations
  /board:
    get:
      summary: Get the whole board
      description: Retrieves the current state of the board and the winner.
      responses:
        "200":
          description: "OK"
          content:
            application/json:
              schema:
                type: object
                properties:
                    winner:
                      type: string
                      enum: [".", "X", "O"]
                      description: |
                        Winner of the game. `.` means nobody has won yet.
                    board:
                      type: array
                      maxItems: 3
                      minItems: 3
                      items:
                          type: array
                          maxItems: 3
                          minItems: 3
                          items:
                            type: string
                            enum: [".", "X", "O"]
                            description: |
                              Possible values for a board square.
                              `.` means empty square.
  ...
```

The response contains an object is JSON format with two fields:

- `winner` is a string with only three possible values: `.`, `X` and `O`.
- `board` is a 3-element array where each item is another 3-element array, effectively building a 3x3 square matrix. Each element in the matrix is a string with only three possible values: `.`, `X` and `O`.

This document is starting to grow too big and complex. The [Reusing Descriptions](specification-components.md) page explains how to name sections of an OpenAPI document in order to reuse them (like the strings with three options above, which appear twice).

## Summary

This page has shown how to describe the content of the body of a response or query. More precisely:

- The `content` field maps Media Types to [Media Type Objects](https://spec.openapis.org/oas/v3.0.3#mediaTypeObject).
- Each [Media Type Object](https://spec.openapis.org/oas/v3.0.3#mediaTypeObject) has a `schema` field describing a [Schema Object](https://spec.openapis.org/oas/v3.0.3#schemaObject).
- [Schema Objects](https://spec.openapis.org/oas/v3.0.3#schemaObject) define a data `type` which can be customized through multiple properties like `minimum`, `maximum`, `items`, `properties` and many more.

[The next page](specification-parameters.md) explains how to define the parameters that an endpoint accepts.
