# Structure of an OpenAPI Document

An OpenAPI document describes an HTTP-like API in one or more machine-readable files. This page describes the syntax of these files and the minimal structure they must contain.

## Document Syntax

An OpenAPI document is a text file, commonly called `openapi.json` or `openapi.yaml`, representing a [JSON](https://en.wikipedia.org/wiki/JSON) object, in either JSON or [YAML](https://en.wikipedia.org/wiki/YAML) format. This file is called the **root document** and it can be split into multiple JSON or YAML files, for clarity.

This section very briefly describes these two formats and compares them.

JSON can represent **Numbers**, **Strings**, **Booleans**, **`null` values**, **Arrays** and **Objects**. An array is an ordered list of values which can have different types. An object (also called a Map) is a collection of name-value pairs where the names (also called Keys or Fields) are unique within the object and the values can have any of the supported types (including other objects or arrays).

Here's a comparison showing the different syntaxes.

<table style="border-style:none;width:100%"><tr style="vertical-align:top"><td>

JSON:

```json
{
  "anObject": {
    "aNumber": 42,
    "aString": "This is a string",
    "aBoolean": true,
    "nothing": null,
    "arrayOfNumbers": [
      1,
      2,
      3
    ]
  }
}
```

</td><td>

YAML:

```yaml
# Anything after a hash sign is a comment
anObject:
  aNumber: 42
  aString: This is a string
  aBoolean: true
  nothing: null
  arrayOfNumbers:
    - 1
    - 2
    - 3
```

</td></tr></table>

Basically, JSON does not support comments and requires: **commas** separating fields, **curly brackets** around objects, double **quotation marks** around strings and **square brackets** around arrays. On the other hand, YAML requires **hyphens** before array items and relies heavily on **indentation**, which can be cumbersome on large files (indentation is entirely optional in JSON).

YAML is typically preferred because of its slightly reduced file size, but the two formats are completely interchangeable (as long as [YAML 1.2](https://en.wikipedia.org/wiki/YAML#Comparison_with_JSON) is used). All examples in these pages will be given in YAML.

However, YAML being a superset of JSON means that **both syntaxes can be mixed**. While this is not recommended in general, it can come in handy sometimes. For example:

```yaml
anObject:
  aString: This is a string
  arrayOfNumbers: [ 1, 2, 3 ] # Abbreviated array representation
```

Finally, object field names are case-sensitive: `openapi` is not the same thing as `OpenAPI`.

> **NOTE:**
> Ellipses (...) are used throughout this guide to indicate an incomplete code snippet. Ellipses are not part of JSON or YAML.

## Minimal Document Structure

To be entirely precise, an OpenAPI document is a single JSON object containing fields adhering to the structure defined in the [OpenAPI Specification](http://spec.openapis.org/oas/v3.0.3) (OAS).

The OAS structure is long and complex so this section just describes the minimal set of fields it must contain, while following pages give more details about specific objects. The [OpenAPI Map](http://openapi-map.apihandyman.io/) is a nice visual tool that can help familiarize the reader with this long specification.

The root object in any OpenAPI document is the [OpenAPI Object](http://spec.openapis.org/oas/v3.0.3#oasObject) and only three of its fields are mandatory: `openapi`, `info` and `paths`.

* `openapi` (**string**): This indicates the version of the OAS this document is using, e.g. "3.0.3". Using this field tools can check that the document correctly adheres to the spec.
* `info` ([Info Object](http://spec.openapis.org/oas/v3.0.3#infoObject)): This provides general information about the API (like its description, author and contact information) but the only mandatory fields are `title` and `version`.
  * `title` (**string**): A human-readable name for the API, like "GitHub REST API", useful to keep API collections organized.
  * `version` (**string**): Indicates the version **of the API document** (not to be confused with the OAS version above). Tools can use this field to generate code that ensures that clients and servers are interacting through the same version of the API, for example.
* `paths` ([Paths Object](http://spec.openapis.org/oas/v3.0.3#pathsObject)): This describes all the **endpoints** of the API, including their parameters and all possible server responses. Server and client code can be generated from this description, along with its documentation.

<figure style="text-align:center">
  <img src="img/openapi-object.svg"/>
  <figcaption>Diagrams are used in this guide to show the relationship between the different objects.</figcaption>
</figure>

Here's an example of a minimal OpenAPI document:

```yaml
openapi: 3.0.3
info:
  title: A minimal OpenAPI document
  version: 0.0.1
paths: # No endpoints defined
```

This API is not very useful because it **defines no operations** (it has no endpoints). [The next page](specification-paths.md) remedies that.

## Summary

This page has shown that:

* The syntax (language) used to write OpenAPI documents can be **JSON**, **YAML** or **both**.
* An OpenAPI document is a JSON object including the fields described in the [OpenAPI Specification](http://spec.openapis.org/oas/v3.0.3).
* Every OpenAPI document must contain a root object with at least the fields `openapi`, `info` and `paths`.

[The following page](specification-paths.md) describes the contents of the `paths` field so endpoints can be added to the above minimal snippet.
