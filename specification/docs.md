---
layout: default
title: Providing Documentation and Examples
parent: The OpenAPI Specification Explained
nav_order: 6
---

# Providing Documentation and Examples

Besides machine-readable descriptions, an OpenAPI document can also include traditional documentation meant to be read by developers. Automatic documentation generators can then merge both and produce comprehensive, nicely-structured reference guides, for example.

This page shows how to take full advantage of special documentation capabilities in OpenAPI like markdown syntax or example objects.

## The Documentation Fields

Almost every object in the OpenAPI Specification accepts a `description` field which can provide additional information for developers, beyond what can be automatically generated from the API descriptions.

For instance, a parameter's name, type and valid range of values are already present in the API definition. The `description` field can complement this information by explaining the **purpose** of this parameter, the **effect of each value** or possible **interactions** with other parameters:

```yaml
paths:
  /audio/volume:
    put:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: integer
              minimum: 0
              maximum: 11
              description:
                Current volume for all audio output.
                0 means no audio output (mute). 10 is the maximum value. 11 enables
                the overdrive system (danger!).
                When set to 0 all other audio settings have no effect.
              ...
```

Additionally, the [Path Item](https://spec.openapis.org/oas/v3.1.0#path-item-object), [Operation](https://spec.openapis.org/oas/v3.1.0#operation-object) and [Example](https://spec.openapis.org/oas/v3.1.0#example-object) objects, which usually have long descriptions, accept a `summary` field providing a short description. Documentation generators can use this field in the full list of paths, or in page headers, for example.

## Providing Long Descriptions in YAML

In JSON format all strings are enclosed in quotes and it is therefore clear where they begin and end. In YAML, though, strings more than one line long can be a bit confusing.

To begin with, long descriptions like the one above end when a YAML line is found with smaller indentation. Leading space is important!

Furthermore, the above example uses the **plain mode** for strings. It is easy to use because it does not require any special syntax, but it can confuse YAML-parsing tools if the string contains colon `:` or hash `#` characters. In these cases, the whole string must be enclosed in single or double quotes:

```yaml
description: "Beware of lines containing colons and hashes like this: #"
```

If precise control over the location of line breaks is required, two more string modes exist, enabled by an indicator character alone on the first line of the description:

- **Literal mode** (Pipe `|` indicator character): Line breaks in the source YAML file are preserved in the output.
- **Folded mode** (Greater-than sign `>` indicator character): Line breaks are removed so the output is a single string. Use an empty line to force a line break.


### YAML source - Literal mode

```yaml
description: |
  This is a string
  in multiple lines.

  And an extra one.
```

### Output - Literal mode

```text
This is a string
in multiple lines.

And an extra one.
```

### YAML source - Folded mode

```yaml
description: >
  This is a string
  in multiple lines.

  And an extra one.
```

### Output - Folded mode

```text
This is a string in multiple lines.
And an extra one.
```

The literal and folded modes do not need to use quotes.

## The CommonMark Syntax

`description` fields allow rich text formatting by using [CommonMark 0.27](https://spec.commonmark.org/0.27/). This section is a quick summary of the syntax of the most commonly used features.

Far more features than listed below are available (including HTML tags), but given that OpenAPI descriptions are meant to be included inside larger auto-generated documentation, using more advanced formatting is typically very complicated.

### Headings

```markdown
# Level 1
## Level 2
### Level 3
```

### Emphasis

```markdown
*Emphasis*
**Strong Emphasis**
***Both***
```

### Lists

```markdown
- Item 1
- Item 2
  - Item 2.1
```

### Code

<pre>
An inline `code span`.

```
A fenced code block
```
</pre>

### Links

```markdown
[Link text](Link URL)
![Alt text](Image URL)
```

## The Example Object

Finally, some OpenAPI objects can list examples explicitly instead of having them embedded in the `description` field, enabling automated processing by tools.

This allows, among other things:

- **Special rendering** of the examples inside the documentation.
- Example objects can be used by **mock servers** as return values.

Two different fields provide this functionality: `example` allows one sample whereas `examples` allows multiple. **Only one of the two fields can be present in each object**.

The content of the `example` field (found in [Parameter](https://spec.openapis.org/oas/v3.1.0#parameterExample), [Media Type](https://spec.openapis.org/oas/v3.1.0#mediaTypeExample) and [Schema](https://spec.openapis.org/oas/v3.1.0#schemaExample) Objects) must match the format of its parent object:

```yaml
schema:
  coordinate:
    type: integer
    minimum: 1
    maximum: 3
    example: 1
```

On the other hand, the `examples` field (found in [Parameter](https://spec.openapis.org/oas/v3.1.0#parameterExample) and [Media Type](https://spec.openapis.org/oas/v3.1.0#mediaTypeExample) Objects) is a map pairing an example name with an [Example Object](https://spec.openapis.org/oas/v3.1.0#example-object). This object provides a `summary` and a `description` for the example along with the actual code (inside the `value` field or as an external reference in the `externalValue` field, but not both).

This is a snippet from the [Tic Tac Toe sample API](/examples/tictactoe.yaml):

```yaml
responses:
  "400":
    description: The provided parameters are incorrect
    content:
      text/html: # This is a Media Type Object
        schema:
          type: string
        examples:
          illegalCoordinates:
            value: "Illegal coordinates."
          notEmpty:
            value: "Square is not empty."
          invalidMark:
            value: "Invalid Mark (X or O)."
```

Note how all examples match the schema provided (they are all strings).

## Summary

This page has shown the features provided by OpenAPI to aid in the documentation process. More specifically:

- Documentation can be added almost everywhere using a `description` field. Some objects also allow a `summary`.
- Text can use rich formatting using **CommonMark** syntax, quickly summarized in this page.
- Documentation can be extended with sample code using the `example` or `examples` fields.

[The next page](servers) shows how to specify the server where the API can be accessed.
