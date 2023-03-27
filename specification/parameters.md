---
layout: default
title: Parameters and Payload of an Operation
parent: The OpenAPI Specification Explained
nav_order: 4
---

# Parameters and Payload of an Operation

[The previous page](content) has shown how to describe an operation's response format, this is, the **output data** of an operation. On the other hand, this page shows how to specify the **input data**, this is, the additional information that complements the endpoint and the operation to fully detail a request.

OpenAPI provides two mechanisms to specify input data, **parameters** and **request body** (message payload). Parameters are typically used to identify a resource, whereas the message payload provides content for that resource.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/parameter-object.svg"></object>
  <figcaption>
    The edges marked with an asterisk are arrays.<br/>
    The Path Item and Operation Objects are explained in the <a href="paths.html">API Endpoints</a> page.<br/>
    The Media Type and Schema Objects are explained in the <a href="content.html">Content of Message Bodies</a> page.
  </figcaption>
</figure>

## The Parameter Object

The `parameters` field in the [Path Item](https://spec.openapis.org/oas/v3.1.0#path-item-object) and [Operation](https://spec.openapis.org/oas/v3.1.0#operation-object) Objects is an **array** containing [Parameter Objects](https://spec.openapis.org/oas/v3.1.0#parameter-object). When provided in the Path Item Object, the parameters are **shared by all operations** on that path (which can override individual parameters at the Operation Object level but not remove them).

Each [Parameter Object](https://spec.openapis.org/oas/v3.1.0#parameter-object) describes one parameter with the following **mandatory** fields:

- `in` (string): Location of the parameter as shown below.
- `name` (string): Case-sensitive. Must be unique in each location.

Additional optional fields include:

- `description` (string): Useful for documentation. Might contain usage examples, for instance.
- `required` (boolean): Whether this parameter **must** be present or not. The default value is `false`.

The type of the parameters, their format and their serialization can be specified using additional fields as shown in the next sections.

### Parameter Location

Parameters can reside in different locations, indicated by the `in` field. The most common ones are:

- `path`: The parameter is part of the route of this operation (and hence of its URL). The parameter's name **must** appear in the path as a [template expression](https://spec.openapis.org/oas/v3.1.0#path-templating), i.e., delimited by curly braces `{}`.

  For example, the path `/users/{id}` must contain at least one parameter described with:

  ```yaml
  paths:
    /users/{id}:
      get:
        parameters:
        - name: id
          in: path
          required: true
  ```

  > **NOTE**:
  > When using path parameters, the `required` field **must** be present and it **must** be `true`.

- `query`: The parameter is appended to the **query string** part of the operation's URL.

  For example, the URL `/users?id=1234` can be parsed using:

  ```yaml
  paths:
    /users:
      get:
        parameters:
        - name: id
          in: query
  ```

- `header`: The parameter is sent in a custom HTTP header as part of the request. Header names are **case-insensitive**.

### Parameter Type

Most of the time a parameter's type can be specified by using a [Schema Object](https://spec.openapis.org/oas/v3.1.0#schemaObject) in the `schema` field. Schema objects allow defining primitive or complex types (like arrays or objects) and impose additional restrictions on them. For example:

```yaml
parameters:
- name: id
  in: query
  schema:
    type: integer
    minimum: 1
    maximum: 100
```

The [Content of Message Bodies](content) page describes Schema objects in greater detail.

In more advanced scenarios the `content` field can be used instead. It provides a **single-entry map** of Media Types to [Media Type Objects](https://spec.openapis.org/oas/v3.1.0#media-type-object) (More details can be found in the [Content of Message Bodies](content) page).

> **NOTE**:
> Exactly one of `schema` or `content` **must** be present. They cannot appear at the same time.

### Parameter Serialization Control

The `style` field defines how a parameter is to be serialized and its effect depends on the **type** of the parameter. The resulting matrix is therefore rather complex and can be consulted in the [Parameter Object](https://spec.openapis.org/oas/v3.1.0#style-examples) specification page.

The tables given below exemplify the most common styles `simple`, `form`, `label`, and `matrix`:

- **Primitive types**: For example, an integer named `id` with value 1234.

  | style: | `simple` | `form`    | `label` | `matrix`   |
  | ------ | -------- | --------- | ------- | ---------- |
  |        | `1234`   | `id=1234` | `.1234` | `;id=1234` |

- **Array types**: For example, an array named `ids` containing the integers 1, 2 and 3.

  The `explode` field can be used to separate each element of the array into a separate parameter.

  | style:               | `simple` | `form`              | `label`  | `matrix`             |
  | -------------------- | -------- | ------------------- | -------- | -------------------- |
  | with `explode=false` | `1,2,3`  | `ids=1,2,3`         | `.1.2.3` | `;ids=1,2,3`         |
  | with `explode=true`  | `1,2,3`  | `ids=1&ids=2&ids=3` | `.1.2.3` | `;ids=1;ids=2;ids=3` |

- **Object types**: For example, an object named `color` containing integer fields R, G and B with values 1, 2 and 3.

  Again, `explode` can be used to separate each field into a separate parameter.

  | style:               | `simple`      | `form`              | `label`        | `matrix`             |
  | -------------------- | ------------- | ------------------- | -------------- | -------------------- |
  | with `explode=false` | `R,1,G,2,B,3` | `color=R,1,G,2,B,3` | `.R.1.G.2.B.3` | `;color=R,1,G,2,B,3` |
  | with `explode=true`  | `R=1,G=2,B=3` | `R=1&G=2&B=3`       | `.R=1.G=2.B=3` | `;R=1;G=2;B=3`       |

For more serialization options see the [Parameter Object](https://spec.openapis.org/oas/v3.1.0#style-examples) specification.

## The Request Body Object

When updating a record on a database, the parameters are typically used to identify the record whereas the message body provides its new content.

The message body of a request is specified through the `requestBody` field in the [Operation Object](https://spec.openapis.org/oas/v3.1.0#operationRequestBody), which is a [Request Body Object](https://spec.openapis.org/oas/v3.1.0#request-body-object).

```yaml
paths:
  /board:
    put:
      requestBody:
        ...
```

The only mandatory field in the [Request Body Object](https://spec.openapis.org/oas/v3.1.0#request-body-object) is `content` which is described in detail in the [Content of Message Bodies](content) page.

As a reminder, the snippet below describes an operation with a JSON request body containing a single integer with values between 1 and 100.

```yaml
      requestBody:
        content:
          application/json:
            schema:
              type: integer
              minimum: 1
              maximum: 100
```

The Request Body Object also has a `description` string and a `required` boolean to state whether the message payload is mandatory.

## Tic Tac Toe Example

The [Tic Tac Toe sample API](/examples/tictactoe.yaml) contains two endpoints, one without parameters or request body (`/board`) and another one with both (`/board/{row}/{column}`). The relevant code snippet for the second endpoint is shown below and it should be easy to understand after reading this page.

```yaml
paths:
  # Single square operations
  /board/{row}/{column}:
    parameters:
      - name: row
        in: path
        required: true
        schema:
          type: integer
          minimum: 1
          maximum: 3
      - name: column
        in: path
        required: true
        schema:
          type: integer
          minimum: 1
          maximum: 3
    get:
      summary: Get a single board square
      responses:
        ...
    put:
      summary: Set a single board square
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: string
              enum: [".", "X", "O"]
      responses:
        ...
```

- Both operations (`get` and `put`) have the same parameters, since they are defined at the Path Item level.
- The parameters are two integers, named `row` and `column` which are located in the path of the operation. This matches the path name which contains `{row}` and `{column}`.
- The `put` operation, additionally, must provide a request body which must be one of the three provided strings: `.`, `X` and `O`.

The complete [Tic Tac Toe sample API](/examples/tictactoe.yaml) does not look exactly like the above snippet because it reuses portions of the document to remove redundancy. This technique is explained in the [Reusing Descriptions](components) page.

## Summary

This page has shown:

- How to specify the two types of input data an operation can provide: `parameters` and `requestBody`.
- Parameters can be located in different places (`path`, `query`, `headers`) and their content (`schema`) and serialization (`style`) is highly customizable.
- The request body is specified, much like responses are, using the `content` field.

[The next page](components) explains how to reuse portions of an OpenAPI document to remove redundancy, reducing file size and maintenance cost.
