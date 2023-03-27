---
layout: default
title: Reusing Description
parent: The OpenAPI Specification Explained
nav_order: 5
---

# Reusing Descriptions

As is often the case, the example built through the previous pages has grown too large to be easily manageable. This page introduces a mechanism to remove redundancy from an OpenAPI document by reusing portions of it.

## The Components Object

The [Components Object](https://spec.openapis.org/oas/v3.1.0#components-object),
accessible through the `components` field in the root [OpenAPI Object](https://spec.openapis.org/oas/v3.1.0#openapi-object), contains definitions for objects to be reused in other parts of the document.

<figure style="text-align:center">
   <object type="image/svg+xml" data="{{site.baseurl}}/img/components-object.svg"></object>
  <figcaption>The OpenAPI Object is explained in the <a href="structure.html">Structure of an OpenAPI Document</a> page.<br/>The Schema Object is explained in the <a href="content.html">Content of Message Bodies</a> page.<br/>The Response Object is explained in the <a href="paths.html">API Endpoints</a> page.<br/>The Parameter Object is explained in the <a href="parameters.html">Parameters and Payload of an Operation</a> page.</figcaption>
</figure>

Most objects in an OpenAPI document can be replaced by a **reference** to a **component**, drastically reducing the document's size and maintenance cost (just like methods do in programming languages).

Not all objects can be referenced, though, only those listed as fields of the [Components Object](https://spec.openapis.org/oas/v3.1.0#components-object) like `schemas`, `responses` and `parameters` to name a few.

Each field in the [Components Object](https://spec.openapis.org/oas/v3.1.0#components-object) is a map pairing component names with objects to be reused. The type of these objects must match the parent field, e.g. objects in the `schemas` map must be [Schema Objects](https://spec.openapis.org/oas/v3.1.0#schema-object).

```yaml
components:
  schemas:
    coordinate:
      type: integer
      minimum: 1
      maximum: 3
  parameters:
    rowParam:
      name: row
      in: path
      required: true
```

The above example defines two components:

- `coordinate` is a schema component, usable wherever a [Schema Object](https://spec.openapis.org/oas/v3.1.0#schema-object) is expected.
- `rowParam` is a parameter component, usable wherever a [Parameter Object](https://spec.openapis.org/oas/v3.1.0#parameter-object) is expected.

The next section explains how to reference these components.

## The Reference Object

Any OpenAPI object of the types supported by the [Components Object](https://spec.openapis.org/oas/v3.1.0#components-object) can be replaced by a [Reference Object](https://spec.openapis.org/oas/v3.1.0#reference-object) pointing to a component.

[Reference Objects](https://spec.openapis.org/oas/v3.1.0#reference-object) are actually [JSON References](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03): they contain a single field named `$ref` and its string value is a URI pointing to the referenced object:

```yaml
  $ref: 'https://gigantic-server.com/schemas/Monster/schema.yaml'
```

References can be absolute or relative, and they can include a fragment identifier

```yaml
$ref: './another_file.yaml#rowParam'
```

To complete the example from the previous section:

```yaml
components:
  schemas:
    coordinate:
      type: integer
      minimum: 1
      maximum: 3
  parameters:
    rowParam:
      name: row
      in: path
      required: true
      schema:
        $ref: "#/components/schemas/coordinate"
    columnParam:
      name: column
      in: path
      required: true
      schema:
        $ref: "#/components/schemas/coordinate"
paths:
  /board/{row}/{column}:
    parameters:
      - $ref: "#/components/parameters/rowParam"
      - $ref: "#/components/parameters/columnParam"
```

Note how all references point to different fragments inside the same document (the one being processed).

Note also how the `coordinate` schema is used twice (in the `rowParam` and `columnParam` parameters), and how these two parameters are referenced from the `/board/{row}/{column}` path.

## Tic Tac Toe Example

The complete [Tic Tac Toe sample API](/examples/tictactoe.yaml) (not included here for brevity) makes heavy use of components. Note for example how different endpoints return a `#/components/schemas/status` on success, or a `#/components/schemas/errorMessage` on error.

## Summary

Whenever the same piece of JSON or YAML is repeated in an OpenAPI document, it is probably worth converting it into a component and referencing it everywhere else.

Furthermore, [Reference Objects](https://spec.openapis.org/oas/v3.1.0#reference-object) allow splitting a document into several files to keep them organized and their individual size manageable.

This page has shown that:

- Reusable [Components Objects](https://spec.openapis.org/oas/v3.1.0#components-object) can be defined by using the `components` field of the root [OpenAPI Object](https://spec.openapis.org/oas/v3.1.0#openapi-object).
- Components can be referenced from any place where an object of the same type is expected using `$ref`.
- References are actually URIs so they are very flexible.

[The next page](docs) explains how to include documentation and examples in an OpenAPI document.
