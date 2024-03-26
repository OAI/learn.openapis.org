---
layout: default
title: Providing Webhooks
parent: The OpenAPI Specification Explained
nav_order: 9
---

# Providing Webhooks

Webhooks are a style of communication common in the API economy. Their purpose is to provide bi-directional communications from the API provider to the API consumer to support out-of-band events that do not fit into the pattern of REST APIs or Callbacks. Webhooks fulfill similar purposes to Callbacks in that they support transmitting information about asynchronous or long-running communications. The example of payments APIs discussed in the Callbacks topic also provides an example of the real-world implementations of Webhooks. Many payments API providers implement webhooks to communicate the result of payment operations. API consumers can implement a webhook at a URL of their choosing to receive out-of-band updates on a previously submitted, long-running request. This avoids implementing polling patterns, which many API providers find onerous to support.

Implementing Webhooks typically involves a registration step, which can be defined using regular Operations and allows API consumers to only consume the events they want to receive. [GitHub](https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks) provides a great example of an API provider who makes extensive use of Webhooks and the means to register for specification events.

API providers still need to define the shape of a given webhook, however. They can do this using the `webhooks` property which is found at the root of the [OpenAPI document](https://spec.openapis.org/oas/v3.1.0#openapi-object).

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/webhook-object.svg"></object>
  <figcaption>Webhooks are implemented at the root of the OpenAPI object</figcaption>
</figure>

A webhook is, in fact, simply a Path Item Object and can support one or more Operation objects. The key difference is that Webhooks are not encapsulated by a Paths Object, as the expectation is that an API consumer will host the webhook at a URL of their choosing. Webhooks therefore define a template, expressed as a Path Item, for API consumers to follow in how they implement the webhook and validate incoming events.

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

The timing and periodicity of events sent over a webhook are typically defined outside of the OAD and described in an API provider's documentation. That said, OpenAPI provides a convenient mechanism for describing webhooks alongside the description of the APIs.

## Summary

In this topic we've learned that:

- Webhooks are a style of API that facilitates bi-directional communication between API providers and API consumers.
- OpenAPI provides the means for API providers to describe their webhooks for API consumers to use as a template for implementation.
- Webhooks in an OAD use Path Items but are not allied to a specific path through a Paths object.
