---
layout: default
title: HTTP Methods
parent: The OpenAPI Specification Explained
nav_order: 10
---

# HTTP Methods

OpenAPI supports describing operations using HTTP methods. This page covers the standard HTTP methods available in all OpenAPI versions, and the enhanced method support introduced in OpenAPI 3.2.

## Standard HTTP Methods (All Versions)

OpenAPI has always supported standard HTTP methods as operation keys in path items:

```yaml
paths:
  /users:
    get:      # Retrieve users
      summary: List users
      responses:
        '200':
          description: User list
    post:     # Create user
      summary: Create a new user
      responses:
        '201':
          description: User created
    put:      # Replace user collection
      summary: Replace all users
    delete:   # Delete users
      summary: Delete all users
    options:  # Get allowed methods
      summary: Get allowed methods for users endpoint
    head:     # Get headers only
      summary: Get user list headers
    patch:    # Update users
      summary: Update users
    trace:    # Diagnostic trace
      summary: Trace users endpoint
```

Each method corresponds to a specific HTTP verb and follows REST conventions for the expected behavior.

## Enhanced HTTP Method Support in OpenAPI 3.2

### QUERY Method Support
{: .d-inline-block }
OpenAPI 3.2+
{: .label .label-green }

OpenAPI 3.2 adds native support for the [QUERY HTTP method](https://www.ietf.org/archive/id/draft-ietf-httpbis-safe-method-w-body-11.html), designed for complex queries that don't fit in URL query strings.

### QUERY Method Example

```yaml
# OpenAPI 3.2
paths:
  /products:
    query:
      summary: Advanced product search
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                filter:
                  type: object
                sort:
                  type: array
                  items:
                    type: string
      responses:
        '200':
          description: Search results
```

### Additional Operations for Custom Methods
{: .d-inline-block }
OpenAPI 3.2+
{: .label .label-green }

Use `additionalOperations` for HTTP methods not covered by standard OpenAPI operations:

### Additional Operations Example

Add the method names in upper case, any supported HTTP method name can be used.

```yaml
# OpenAPI 3.2
paths:
  /documents/{id}:
    additionalOperations:
      LINK:
        summary: Link related documents
        parameters:
          - name: id
            in: path
            required: true
            schema: { type: string }
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  targetDocument:
                    type: string
                  relationship:
                    type: string
        responses:
          '204':
            description: Link created successfully
```

This approach makes it easier to adopt new methods as the HTTP landscape evolves.
