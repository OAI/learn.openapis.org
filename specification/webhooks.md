---
layout: default
title: Providing Webhooks
parent: The OpenAPI Specification Explained
nav_order: 9
---

# Providing Webhooks

Webhooks are a style of API common in the API world. Their purpose is to provide bi-directional communications from the API provider to the API consumer, supporting out-of-band events that do not fit into the pattern of REST APIs. Webhooks fulfill similar purposes to Callbacks in that they support transmitting information about asynchronous or long-running communications. The example of payments APIs discussed in the Callbacks topic provides real-world implementations of Webhooks. Many payments API providers implement webhooks to communicate the result of payment operations as an alternative to callbacks. API consumers can implement a webhook at a URL of their choosing to receive out-of-band updates on a previously submitted, long-running request.

API providers still need to define the shape of a given webhook, however. They can do this using the `webhooks` property which is found at the root of the [OpenAPI document](https://spec.openapis.org/oas/v3.1.0#openapi-object).

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/webhook-object.svg"></object>
  <figcaption>Webhooks are implemented at the root of the OpenAPI object</figcaption>
</figure>

A webhook is, in fact, simply a Path Item Object and can support one or more Operation objects. The key difference is that Webhooks are not encapsulated by a Paths Object, as the expectation is that an API consumer will host the webhook at a URL of their choosing. Webhooks therefore define a template, expressed as a Path Item, for API consumers to follow in how they validate incoming events.

Our Tic Tac Toe example includes a webhook that communicates the status of the board. This is not linked to a specific Operation, but given asynchronous behaviors are supported it is implied that this may be received as a result of the API consumer receiving a 202 HTTP return code:

```yaml
webhooks:
  markStatus:
    post:
      summary: Status of mark operation
      description: Provides the status of the mark operation on completion
      operationId: markOperationWebhook
      responses:
        "200":
          description: Mark operation has completed successfully
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/status"
```

When events are sent over a webhook is, however, typically defined outside of the OAD and described in an API provider's documentation. That said, OpenAPI provides a convenient mechanism for describing webhooks alongside the description of the APIs.

## Summary

In this topic we've learned that:

- Webhooks are a style of API that facilitates bi-directional communication between API providers and API consumers.
- OpenAPI provides the means for API providers to describe their webhooks for API consumers to use as a template for implementation.
- Webhooks in an OAD use Path Items but are not allied to a specific path through a Paths object.
