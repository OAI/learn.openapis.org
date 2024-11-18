---
layout: default
parent: Overlays
nav_order: 2
title: 'Example: add a license'
has_toc: false
---

# Example: add a license

Every API needs a license so people know they can use it, but what if your OpenAPI descriptions don't have a license?
This example shows an Overlay that adds a license to an OpenAPI description.

Here's here's the overlay file, with just one action to add or change the `info.license` fields:

```yaml
overlay: 1.0.0
info:
  title: Add MIT license
  version: 1.0.0
actions:
  - target: '$.info'
    update:
      license:
        name: MIT
        url: https://opensource.org/licenses/MIT        
``` 

You can use this Overlay with different OpenAPI files to make the same change to a batch of files.
 
