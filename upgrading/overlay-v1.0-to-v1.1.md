---
layout: default
title: Overlay - Upgrading Between Versions 1.0 and 1.1
parent: Upgrading Between Versions
nav_order: 1
---

# Overlay - Upgrading Between Versions 1.0 and 1.1

Overlay 1.1 introduces significant new functionality and improvements. This guide covers the changes required to migrate your Overlay 1.0 descriptions to version 1.1.

## Getting started

Begin by updating the version number in your Overlay document. Locate this line in your JSON or YAML file:

```yaml
overlay: 1.0.0
```

Update it to:

```yaml
overlay: 1.1.0
```

## Copy elements from the OpenAPI document

The following example illustrates how you can now use the copy action to update a target node with a value from the document being processed. Saving you from having duplicate definitions in your overlay document.

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

## Name the file according to the convention for better tooling integration

You might want to rename your overlay documents to end with `.overlay.yaml|json` to get better integration with tooling.

## Ensure your JSONPath are RFC 9535 for better interoperability

This example JSONPath query expression:

```jsonpath
$.paths.*.get[?(@.x-oai-traits[?(@ == 'paged')])]
```

Should in fact be:

```jsonpath
$.paths.*.get[?(@['x-oai-traits'][?(@ == 'paged')])]
```

## Removing/Updating primitive values is now fully supported

```yaml
overlay: 1.1.0
info:
  title: Targeted Overlay
  version: 1.0.0
actions:
  - target: $.paths['/foo'].get.description
    update: This is the new description
  - target: $.paths['/bar'].get.description
    update: This is the updated description
```

Before it used to require updating the parent object.

## Add a description to your overlay document

```yaml
overlay: 1.1.0
info:
  title: Overlay with description
  version: 1.0.0
  description: This overlay document has a long description thanks to the new field.
actions: []
```
