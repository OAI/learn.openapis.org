---
layout: default
title: Use Overlays for Global Information
parent: Best Practices
nav_order: 7
---

# Use Overlays to Add Common Entries

When information or behavior should be applied across many operations, it is more maintainable to keep it in an [Overlay](../overlay) rather than repeating changes throughout the source OpenAPI description.

This works especially well for cross-cutting concerns, such as:

- A new status code that should be present everywhere (for example, a throttling response)
- A shared set of response headers (for example, request ID, region, and other telemetry headers)

Using an Overlay makes these changes systematic and easier to govern through automation. For related patterns, see [Example: Add multiple parameters to selected operations](../overlay/example-add-filter-parameters) in the Overlays section.

## Example source OpenAPI description (3 operations)

```yaml
openapi: 3.2.0
info:
  title: Orders API
  version: 1.0.0
paths:
  '/orders':
    get:
      summary: List orders
      responses:
        "200":
          description: Successful response
    post:
      summary: Create order
      responses:
        "201":
          description: Created
  '/orders/{orderId}':
    get:
      summary: Get one order
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Successful response
```

## Overlay that adds a 429 response to all operations

The following Overlay adds a `429` response to every operation and includes `Retry-After` plus `RateLimit-*` headers inspired by [draft-polli-ratelimit-headers-02](https://www.ietf.org/archive/id/draft-polli-ratelimit-headers-02.html):

```yaml
overlay: 1.0.0
info:
  title: Add global throttling response and rate limit headers
  version: 1.0.0
actions:
  - target: "$.paths.*.*"
    update:
      responses:
        "429":
          description: Too Many Requests
          headers:
            Retry-After:
              description: Number of seconds to wait before retrying.
              schema:
                type: integer
            RateLimit-Limit:
              description: Requests allowed in the current window.
              schema:
                type: integer
            RateLimit-Remaining:
              description: Remaining requests in the current window.
              schema:
                type: integer
            RateLimit-Reset:
              description: Seconds until the current rate limit window resets.
              schema:
                type: integer
```

## Resulting OpenAPI description

After applying the Overlay, each operation contains the new `429` response:

```yaml
openapi: 3.2.0
info:
  title: Orders API
  version: 1.0.0
paths:
  '/orders':
    get:
      summary: List orders
      responses:
        "200":
          description: Successful response
        "429":
          description: Too Many Requests
          headers:
            Retry-After:
              description: Number of seconds to wait before retrying.
              schema:
                type: integer
            RateLimit-Limit:
              description: Requests allowed in the current window.
              schema:
                type: integer
            RateLimit-Remaining:
              description: Remaining requests in the current window.
              schema:
                type: integer
            RateLimit-Reset:
              description: Seconds until the current rate limit window resets.
              schema:
                type: integer
    post:
      summary: Create order
      responses:
        "201":
          description: Created
        "429":
          description: Too Many Requests
          headers:
            Retry-After:
              description: Number of seconds to wait before retrying.
              schema:
                type: integer
            RateLimit-Limit:
              description: Requests allowed in the current window.
              schema:
                type: integer
            RateLimit-Remaining:
              description: Remaining requests in the current window.
              schema:
                type: integer
            RateLimit-Reset:
              description: Seconds until the current rate limit window resets.
              schema:
                type: integer
  '/orders/{orderId}':
    get:
      summary: Get one order
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Successful response
        "429":
          description: Too Many Requests
          headers:
            Retry-After:
              description: Number of seconds to wait before retrying.
              schema:
                type: integer
            RateLimit-Limit:
              description: Requests allowed in the current window.
              schema:
                type: integer
            RateLimit-Remaining:
              description: Remaining requests in the current window.
              schema:
                type: integer
            RateLimit-Reset:
              description: Seconds until the current rate limit window resets.
              schema:
                type: integer
```

This pattern lets API producers choose how to publish these changes based on audience capability: distribute the base OpenAPI description together with the Overlay, or distribute only the resulting OpenAPI description after applying the Overlay.
