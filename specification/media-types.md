---
layout: default
title: Sequential Media Types
parent: The OpenAPI Specification Explained
nav_order: 11
---

# Sequential Media Types
{: .d-inline-block }
OpenAPI 3.2+
{: .label .label-green }

OpenAPI 3.2 introduces support for sequential and streaming media types, enabling description of data streams where individual items arrive over time.

## New Schema Field: itemSchema

The key addition is the `itemSchema` field, which describes the structure of a repeated item in a response:

```yaml
# OpenAPI 3.2
responses:
  '200':
    description: Stream of updates
    content:
      text/event-stream:
        itemSchema:
          type: object
          properties:
            id: { type: string }
            data: { type: object }
```

## Supported Sequential Media Types

OpenAPI 3.2 adds support for several streaming formats:

- **Server-Sent Events**: `text/event-stream`
- **JSON Lines**: `application/jsonl`
- **JSON Sequences**: `application/json-seq`
- **Multipart Mixed**: `multipart/mixed`

## Enhanced Multipart Support

OpenAPI 3.2 introduces new encoding fields for multipart content:

### itemEncoding

Applies encoding to each item in a sequence:

```yaml
# OpenAPI 3.2
content:
  multipart/form-data:
    itemEncoding:
      file:
        contentType: application/octet-stream
```

### prefixEncoding

Specifies encoding for items by position:

```yaml
# OpenAPI 3.2
content:
  multipart/mixed:
    prefixEncoding:
      - contentType: application/json
      - contentType: text/html
```

Sequential media type support in OpenAPI 3.2 enables documentation of streaming and real-time APIs using the `itemSchema` field to describe individual items in data streams.
