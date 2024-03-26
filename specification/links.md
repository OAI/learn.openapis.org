---
layout: default
title: Implementing Links
parent: The OpenAPI Specification Explained
nav_order: 10
---

# Implementing Links

As the API economy has grown the number of ways to indicate a relationship between one-or-more operations has grown with it. Most approaches equate to something loosely resembling the REST constraint of hypermedia as the engine of state (HATEOAS), and this has been replayed in many standards-based approaches like HAL and `json:api`.

There has, however, always been a need to _describe_ how the relationships are manifested and how to process such information. This is because the promise of dynamically consuming links returned from an API has rarely been born out in the practicalities of both publishing APIs and software development for API consumers. The Link Object is a feature of OAS that attempts to address this. Links are designed to describe a relationship between two operations _at design time_.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/link-object.svg"></object>
  <figcaption>Links are implemented in an <a href="paths.html#the-response-object">Response</a> and also be described by reference using a Reference Object.</figcaption>
</figure>

A Link provides a reference to another operation through either an `operationRef` - which uses [References](../referencing/) to resolve a target operation - or through an unqualified `operationId` value that must be resolved to an Operation object locally. Links allow API providers to decouple the data they return in response payloads from properties specific to resolving a relationship, a pattern that is generally manifested in returning URLs in the response payload encapsulated in properties like `links`. The Link object instead uses [Runtime Expressions](https://spec.openapis.org/oas/v3.1.0#runtime-expressions) to provide the relationship, which can reference any part of the request, response, and the headers and parameters therein. Runtime Expressions are important in this context as they allow the binding of design-time information to runtime data in a very flexible way. A Link can also implement a specific [Server object](https://spec.openapis.org/oas/v3.1.0#server-object) that is only applicable to that Link.

Our Tic Tac Toe description includes a very simple example of a Link object that indicates a relationship between the `get` and `put` Operations on the Path Item `/board/{row}/{column}`. The Link object is a property of a Response object, and is therefore always qualified by a specific HTTP return code from a given Operation:

```yaml
/board/{row}/{column}:
  parameters:
    - $ref: "#/components/parameters/rowParam"
    - $ref: "#/components/parameters/columnParam"
  get:
    summary: Get a single board square
    description: Retrieves the requested square.
    tags:
      - Gameplay
    operationId: get-square
    responses:
      "200":
        description: "OK"
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/mark"
        links:
          markSquare:
            description: Operation to use if the mark value returned indicates the square is empty
            operationId: put-square
            parameters:
              row: $request.path.row
              column: $request.path.column
```

The Link object indicates a relationship to the `put-square` operation and identifies the required `row` and `column` parameters through Runtime Expressions referencing the same values in the request. This is (obviously) a trivial example as the API consumer would almost certainly understand this relationship without the additional information. However, it serves the purpose of showing how this information _could_ be used by an API consumer if they did not understand the link between the two operations. This is especially valuable _across Path Items_ where logical groupings by operation do not exist.

It should be noted that API consumers are under no obligation to follow Links as doing so should be based on understanding its effect. The API consumer also needs to be aware of any constraints that may be applied, such as permission to access a given Operation.

## Summary

In this topic we've learned that:

- There has long been a need to indicate relationships between the operations of an API.
- The Link object provides the means to indicate a relationship at design time.
- The relationship can be to an operation in the same OAD or a remote OAD.
- Links are expressed using Runtime Expressions that resolve to dynamic values at runtime.
