---
layout: default
parent: Overlays
nav_order: 3
title: 'Example: tag DELETE operations'
has_toc: false
---

# Example: tag DELETE operations

To add the same tag to all operations in an OpenAPI description that use `DELETE` methods, use an Overlay like the example below.
This example adds an `x-restricted` tag to all delete operations:

```yaml
overlay: 1.0.0
info:
  title: Tag delete operations as restricted
  version: 1.0.0
actions:
- target: $.paths.*.delete
  update:
    tags:
      - x-restricted
```

This overlay adds `x-restricted` to the tags array for each delete operation.
If the tags array doesn't exist, it'll be created; if it does, the new tag is added to the existing array.

You can use an approach like this to make other changes to all matching operations.
