---
layout: default
parent: Overlays
nav_order: 5
title: 'Example: add params selectively'
has_toc: false
---

# Example: Add multiple parameters to selected operations

One of the most requested features for OpenAPI is the ability to group parameters and easily apply all of them together, to either some or all operations in an OpenAPI description.
Especially for common parameters that always come as a set (pagination or filter parameters are a great example), it can be more maintainable to use them as a "trait" and apply the set as part of the API lifecycle rather than trying to maintain a source of truth with a lot of repetition.
This approach leads to good API governance, since if the collection of fields changes then the update is consistently applied through automation.

In the following example, any operations with the extension `x-supports-filters` set to `true` will have two inline parameters added to their parameter collection, and an `x-filters-added` tag for decoration/debugging.

```yaml
overlay: 1.0.0
info:
  title: Add filter parameters everywhere
  version: 1.0.0
actions:
- target: $.paths.*.*[?(@.x-supports-filters == true)]
  update:
    parameters:
      - name: month
        in: query
        description: Month number of event (1-12)
        required: false
        type: integer

      - name: time_start
        in: query
        description: Start time of event
        required: false
        type: string
    tags:
      - x-filters-added
```

You can adjust the target expression to apply only to certain paths or methods, or use another approach to identify which operations should be updated.

It might be more elegant to first update the `components.parameters` section of an OpenAPI description to add the parameters there, and then refer to those new entries when updating the existing operations.
The Overlay Specification requires that each action is processed in the order it is seen in the Overlay document.

The 1.0 specification has a [traits example](https://spec.openapis.org/overlay/latest#traits-example) that uses the `x-oas-traits` [Specification Extension](https://spec.openapis.org/oas/latest#specification-extensions).
This extension is a useful convention to consider when you use a pattern like the one described here.
