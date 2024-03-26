---
layout: default
title: Providing Callbacks
parent: The OpenAPI Specification Explained
nav_order: 9
---

# Providing Callbacks

Callbacks are a feature of OAS that provides a relationship between a given [Operation](https://spec.openapis.org/oas/v3.1.0#operation-object) and a [Path Item](https://spec.openapis.org/oas/v3.1.0#path-item-object) that can be implemented by an API consumer. A callback allows an API provider to describe this relationship at design time, indicating that they can call an API consumer at a given URL based on the definition of both the Callback and dynamic values received during a given Operation. These are described as "out-of-band" by the specification as the expectation is the API provider can call such URLs independently of the Operation in which they are defined.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/callback-object.svg"></object>
  <figcaption>Callbacks are implemented in an <a href="paths.html#the-operation-object">Operation</a> and also be described by reference using a Reference Object.</figcaption>
</figure>

A common use case for callbacks is to provide information on the success or failure of long-running operations that cannot be completed synchronously. An example is in the context of payments API, where payments backend systems are asynchronous and therefore cannot always return a definitive response within the typical timeout period for an HTTP request. Callbacks are therefore implemented to allow an immediate, synchronous response to be made so that payment API providers can relay the status of the payment out-of-band. A Callback object is defined as part of an Operation. It differs from a [Webhook](webhooks.md) in that it is always allied to a specific Operation. Webhooks should be considered for more generic use cases as they define Path Items outside the context of a given Operation.

Our Tic Tac Toe example implements a Response object that indicates an asynchronous response to a requested move on the board. A 202 HTTP response is returned indicating the request has been accepted but the operation is not completed. The API consumer can send a URL in the HTTP header `progressUrl` so the API provider can send a notification when the move is complete. This header is optional, so if no value is supplied no callback will be made by the API provider:

```yaml
put:
  summary: Set a single board square
  description: Places a mark on the board and retrieves the whole board and the winner (if any).
  tags:
    - Gameplay
  operationId: put-square
  parameters:
    - name: progressUrl
      in: header
      description: Progress URL that should be called if asynchronous response is returned
      required: false
      schema:
        type: string
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
      description: Mark operation has not completed. Callback will be used to send notification once operation is complete
```

This operation also describes the callback, which is implemented as a [Runtime Expression](https://spec.openapis.org/oas/v3.1.0#runtime-expressions) that points at the `progressUrl` header from the parameter above. The `callbacks` object is defined as a Map. Each callback is defined with a name that uniquely identifies the Callback object and the runtime expression value:

```yaml
callbacks:
  statusCallback:
    "{$request.header.progressUrl}":
      post:
        summary: Status of mark operation
        description: Provides the status of the ongoing mark operation
        operationId: markOperationCallback
        requestBody:
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/status"
        responses:
          "200":
            description: Mark operation status received
```

The object defines or references a Path Item, qualified by the Runtime Expression. The API provider will use this Runtime Expression to resolve the value of the URL to call. The API consumer uses this object to define the implementation code for their callback API and perform activities like request payload schema validation.

The behaviors that govern when an API provider should call a callback URL are largely based on the type of operation being supported and the specifics of the implementation. We therefore do not cover such considerations in this topic.

## Summary

In this topic we've learned that:

- Callbacks provide the means to associate a given Operation with a Callback that provides additional, out-of-band information.
- An API provider can use Callbacks to support features like long-running operations that are completed asynchronously.
- API providers can resolve a Callback URL using a Runtime Expression, which resolves to attributes of the request or response messages and allows them to call the API consumer at the resolved URL.
