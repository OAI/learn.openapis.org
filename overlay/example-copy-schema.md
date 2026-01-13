---
layout: default
parent: Overlays
nav_order: 6
title: 'Example: copy a schema'
has_toc: false
---

# Example: copy a schema

Copying a schema helps you avoid maintaining a duplicate that could become stale in your overlay document. This example shows how the Foo component schema is duplicated to create a new Bar component schema.

```yaml
overlay: 1.1.0
info:
  title: Copy a schema component
  version: 1.1.0
actions:
  - target: '$.components.schemas'
    description: Ensure the target schema is present
    update:
      Bar: {}
  - target: '$.components.schemas['Bar']'
    copy: '$.components.schemas['Foo']'
    description: Copy the Foo Schema to Bar
```

If the target OpenAPI document contains a Foo component schema, it'll be duplicated as a Bar component schema. You may also combine these two actions with a third remove action to perform a rename of the component schema instead of a copy.
