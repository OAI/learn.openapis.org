---
layout: default
title: API Endpoints
parent: The OpenAPI Specification Explained
nav_order: 2
---

# API Endpoints

[The previous page](structure) showed the minimal structure of an OpenAPI document but did not add any operation to the API. This page explains how to do it.

## The Endpoints list

API Endpoints (also called Operations or Routes) are called **Paths** in the OAS. The [Paths Object](https://spec.openapis.org/oas/v3.1.0#paths-object), accessible through the `paths` field in the root [OpenAPI Object](https://spec.openapis.org/oas/v3.1.0#openapi-object), is the container for all operations supported by the API:

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/paths-object.svg"></object>
  <figcaption>The OpenAPI Object is explained in the <a href="structure.html">Structure of an OpenAPI Document</a> page.</figcaption>
</figure>

Every field in the [Paths Object](https://spec.openapis.org/oas/v3.1.0#paths-object) is a [Path Item Object](https://spec.openapis.org/oas/v3.1.0#path-item-object) describing one API endpoint. Fields are used instead of an Array because they enforce endpoint name uniqueness at the syntax level (any JSON or YAML parser can detect mistakes without requiring an OpenAPI validator).

Paths **must start with a forward slash** `/` since they are directly appended to the server URL (described in the [API Servers](servers) page) to construct the full endpoint URL.

The [Tic Tac Toe sample API](/examples/tictactoe.yaml) is used in this guide to exemplify each concept and it is built piece by piece as the guide progresses. Here's the first snippet already containing a single endpoint:

```yaml
openapi: 3.1.0
info:
  title: Tic Tac Toe
  description: |
    This API allows writing down marks on a Tic Tac Toe board
    and requesting the state of the board or of individual squares.
  version: 1.0.0
paths:
  /board:
    ...
```

## The Path Item Object

The [Path Item Object](https://spec.openapis.org/oas/v3.1.0#path-item-object) describes the HTTP operations that can be performed on a path with a separate [Operation Object](https://spec.openapis.org/oas/v3.1.0#operation-object) for each one. Allowed operations match HTTP methods names like `get`, `put` or `delete`, to list the most common (find the complete list in the [Path Item Object](https://spec.openapis.org/oas/v3.1.0#path-item-object) specification).

This object also accepts common properties for all operations on the path like `summary` or `description`. The details of each operation are given in each child Operation object.

```yaml
paths:
  /board:
    get:
      ...
    put:
      ...
```

## The Operation Object

Besides giving the operation a `summary` and a `description`, the [Operation Object](https://spec.openapis.org/oas/v3.1.0#operation-object) basically describes the operation's parameters, payload and possible server responses. The rest of this page explains the `responses` field, whereas parameters and payload are dealt with in [another page](parameters).

```yaml
paths:
  /board:
    get:
      summary: Get the whole board
      description: Retrieves the current state of the board and the winner.
      parameters:
        ...
      responses:
        ...
```

## The Responses Object

The [Responses Object](https://spec.openapis.org/oas/v3.1.0#responses-object) is a container for  the expected answers the server can give to this request. Each field name is an HTTP response code **enclosed in quotation marks** and its value is a [Response Object](https://spec.openapis.org/oas/v3.1.0#response-object) (note there is no 's' at the end) containing details about the response.

At least one response must be given and it is recommended that it corresponds to the success case (typically HTTP response code 200). 5 wildcards are allowed: `1XX`, `2XX`, `3XX`, `4XX` and `5XX` (explicit codes take preference over wildcards).

```yaml
paths:
  /board:
    get:
      responses:
        "200":
          ...
        "404":
          ...
```

## The Response Object

The [Response Object](https://spec.openapis.org/oas/v3.1.0#response-object) contains a **mandatory** `description` of the meaning of the response in the context of this operation, complementing the sense of the HTTP response codes (which are generic in nature). This helps developers understand better how to react to this particular code.

The most important field, though, is `content` because it describes the possible payloads of the response. Due to its complexity, this field's format is detailed next, in [its own page](content).

```yaml
paths:
  /board:
    get:
      responses:
        "200":
          description: Everything went fine.
          content:
            ...
```

## Tic Tac Toe Example

Here's a fragment of the example, containing only the objects that have been defined so far in the guide. At this point the reader should be able to understand every line of this snippet.

```yaml
openapi: 3.1.0
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
            ...
```

The complete document can be found in the [Tic Tac Toe sample API](/examples/tictactoe.yaml).

## Summary

This page has shown how to specify endpoints (`paths`), their available operations (`get`, `put`, ...) and their possible outcomes (`responses`).

The [next page](content) shows how to specify the `content` of the responses.
