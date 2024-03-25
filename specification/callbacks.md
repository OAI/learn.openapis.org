---
layout: default
title: Providing Callbacks
parent: The OpenAPI Specification Explained
nav_order: 9
---

# Providing Callbacks

Callbacks are a feature of OAS that provides a relationship between a given [Operation](https://spec.openapis.org/oas/v3.1.0#operation-object) and a [Path Item](https://spec.openapis.org/oas/v3.1.0#path-item-object). A callback allows an API provider to describe this relationship at design time, indicating that an API consumer can call a given URL based on the definition of the Callback and dynamic values they receive in the response from a given Operation. These are described as "out-of-band" by the specification as the expectation is the API consumer can call such URLs independently of the Operation in which they are defined.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/callback-object.svg"></object>
  <figcaption>Callbacks are implemented in an <a href="paths.html#the-operation-object">Operation</a> and also be described by reference using a Reference Object.</figcaption>
</figure>

A common use case for callbacks is to provide information on the success or failure of long-running operations that cannot be completed synchronously. An example is in the context of payments API, where payments backend systems are asynchronous and therefore cannot always return a definitive response within the typical timeout period for an HTTP request. Callbacks are therefore implemented to allow an immediate, synchronous response to be made so that the API consumer can check on the status of the payment out-of-band. This supports polling patterns that are often implemented by API providers.

A Callback object is defined as part of an Operation. Our Tic Tac Toe example implements a Response object that indicates an asynchronous response to a requested move on the board. A 202 HTTP response is returned - indicating the request has been accepted but the operation has yet to complete - along with the `Location` header that provides the callback URL:

```yaml
put:
  summary: Set a single board square
  description: Places a mark on the board and retrieves the whole board and the winner (if any).
  tags:
    - Gameplay
  operationId: put-square
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/mark"
  responses:
    "200":
      description: "OK"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/status"
    "202":
      description: Mark operation has not completed. Use callback to check for progress
      headers:
        Location:
          description: Callback URL
          schema:
          type: string
```

This operation also describes the callback, which is implemented as a [Runtime Expression](https://spec.openapis.org/oas/v3.1.0#runtime-expressions) that points at the `Location` header from the 202 response. The `callbacks` object is defined as a Map. Each callback is defined with a name that uniquely identifies the Callback object, including the expression value:

```yaml
callbacks:
  statusCallback:
    "{$response.header.Location}":
      get:
        summary: Status of mark operation
        description: Provides the status of the ongoing mark operation
        operationId: markOperationCallback
        responses:
          "200":
            description: Mark operation has completed successfully
            content:
              application/json:
                schema:
                  $ref: "#/components/schemas/status"
          "202":
            description: Mark operation has not completed
          default:
            description: Error returning information on mark operation progress
            content:
              application/json:
                schema:
                  $ref: "#/components/schemas/errorMessage"
```

The object defines or references a Path Item, qualified by the Runtime Expression. The API consumer will use this Runtime Expression to resolve the value of the URL to call. In the example OAD we've defined several response codes in the Path Item defined by the Callback object, namely:

- A 200, indicating the move operation has been completed. This callback returns the same status information as a synchronous response.
- A 202, indicating the move operation is still ongoing. The API consumer will need to call the URL again to check on the state of the move.
- Any other responses returned by the callback URL are defined based on the `errorMessage` Schema Object, indicated using the `default` keyword.

The behaviors that govern how frequently an API consumer should call a callback URL are largely based on the type of operation being supported and the specifics of the API provider's implementation. We therefore do not cover such considerations in this topic.

## Summary

In this topic we've learned that:

- Callbacks provide the means to associate a given Operation with a Callback that provides additional, out-of-band information.
- An API provider can use Callbacks to support features like long-running operations that are completed asynchronously.
- API consumers can resolve a Callback URL using a Runtime Expression, which resolves to attributes of the request or response messages.
