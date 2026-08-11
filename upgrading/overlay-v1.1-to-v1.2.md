---
layout: default
title: Overlay - Upgrading Between Versions 1.1 and 1.2
parent: Upgrading Between Versions
nav_order: 2
---

# Overlay - Upgrading Between Versions 1.1 and 1.2

Overlay 1.2 adds reusable actions and clearer document identification rules. Most 1.1 documents can upgrade by updating the version number, but documents that use fragments in `extends` need a small adjustment because document-identifying fields now identify whole documents only.

## Update the version number

Begin by updating the version number in your Overlay document. Locate this line in your JSON or YAML file:

```yaml
overlay: 1.1.0
```

Update it to:

```yaml
overlay: 1.2.0
```

## Identify whole documents with `extends` and `$self`

Overlay 1.2 clarifies document identification and base URI behavior:

- `extends` identifies the whole target document.
- The new `$self` field identifies the Overlay document and establishes the base URI used to resolve relative references inside the overlay.
- `extends` and `$self` must not contain URI fragments.
- When the target OpenAPI description defines `$self`, the overlay's `extends` value should match that URI.

Add `$self` when the overlay needs portable relative references, such as when it may be copied between repositories or loaded from a system without a stable retrieval URL:

```yaml
overlay: 1.2.0
$self: https://example.com/overlays/petstore.overlay.yaml
info:
  title: Petstore overlay
  version: 1.0.0
extends: ../openapi/petstore.yaml
actions:
  - target: '$.info'
    update:
      x-overlay-applied: true
```

In this example, `../openapi/petstore.yaml` resolves against `$self`, producing `https://example.com/openapi/petstore.yaml`. Because URIs are identifiers and not necessarily network locations, tooling can also match an `extends` value to a target description's `$self` even when the target was retrieved from another location.

## Reuse common actions with `components.actions`

Overlay 1.2 adds reusable actions. Define shared action fields once under `components.actions`, then reference them from the top-level `actions` array with `$ref` and a local `target`.

This helps when several operations need the same update, copy, remove, or description logic.

```yaml
overlay: 1.2.0
info:
  title: Use reusable actions to insert error responses
  version: 1.0.0
components:
  actions:
    errorResponse:
      description: Adds an error response to an operation
      fields:
        description: Adds a 404 response
        update:
          '404':
            description: Not Found
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
actions:
  - target: "$.paths['/items'].get.responses"
    $ref: '#/components/actions/errorResponse'    
  - target: "$.paths['/some-items'].delete.responses"
    $ref: '#/components/actions/errorResponse'
```

Reusable actions have a few important rules:

- Action fields belong under the reusable action's `fields` property.
- `fields` must not include `target`; each reference supplies its own `target`.
- A reusable action has no effect until it is referenced from the top-level `actions` array.
- The reusable action's top-level `description` documents the reusable component itself. Use `fields.description` for the action description, or provide `description` on a reference to override it for that use.
- `$ref` must point to `#/components/actions/{name}`.
- If a component key contains `~` or `/`, escape it using JSON Pointer rules: `~` becomes `~0` and `/` becomes `~1`.

For example:

```yaml
overlay: 1.2.0
info:
  title: Reusable action with escaped key
  version: 1.0.0
components:
  actions:
    'error-response/v1~beta':
      fields:
        update:
          '404':
            description: Not Found
actions:
  - target: '$.paths.*.get.responses'
    $ref: '#/components/actions/error-response~1v1~0beta'
```

## Keep one-off actions as they are

You do not need to convert existing 1.1 actions to reusable actions. Existing actions with `target`, `update`, `remove`, `copy`, and `description` remain valid in Overlay 1.2.

Use `components.actions` when it removes duplication or makes intent clearer; otherwise, keep simple overlays simple.
