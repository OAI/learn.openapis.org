---
layout: default
parent: Overlays
nav_order: 2
title: 'Example: copy a schema'
has_toc: false
---

# Example: copy a schema

Copying a schema helps you avoid maintaining a duplicate that could become stale in your overlay document. This example shows how the Foo component schema is duplicated to create a new Bar component schema.

```yaml
overlay: 1.0.0
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
