---
layout: default
title: API Servers
parent: The OpenAPI Specification Explained
nav_order: 7
---

# API Servers

This page shows how to specify the server where the API can be accessed, which can contain multiple URLs and even variable portions.

## The Server Object

The [Server Object](https://spec.openapis.org/oas/v3.1.0#server-object) provides the base URLs where the API is being served. It can be found in the `servers` array present in the root [OpenAPI Object](https://spec.openapis.org/oas/v3.1.0#oasServers), the [Path Item Object](https://spec.openapis.org/oas/v3.1.0#pathItemServers) and the [Operation Object](https://spec.openapis.org/oas/v3.1.0#operationServers).

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/server-object.svg"></object>
  <figcaption>The edges marked with an asterisk are arrays.<br/>The OpenAPI Object is explained in the <a href="structure.html">Structure of an OpenAPI Document</a> page.<br/>The Paths, Path Item and Operation Objects are explained in the <a href="paths.html">API Endpoints</a> page.</figcaption>
</figure>

Each element in a `servers` array is a [Server Object](https://spec.openapis.org/oas/v3.1.0#server-object) providing, at least, a `url` field with the base URL for that server. An optional `description` aids in keeping server lists organized:

```yaml
servers:
- url: https://europe.server.com/v1
  description: Server located in Germany.
- url: https://america.server.com/v1
  description: Server located in Atlanta, GA.
- url: https://asia.server.com/v1
  description: Server located in Shenzhen
```

Individual API endpoints (as specified in the [Paths Object](https://spec.openapis.org/oas/v3.1.0#paths-object)) are then appended to this URL to construct the full endpoint URL. For example:

```yaml
servers:
- url: https://server.com/v1
paths:
  /users:
    get:
```

The above operation can be accessed by executing a GET request on the URL `https://server.com/v1/users`.

When multiple `servers` arrays are specified at different levels for a given operation, only the lowest level one is taken into account. For example, in this case:

```yaml
servers:
- url: https://server1.com
paths:
  /users:
    get:
      servers:
      - url: https://server2.com
```

GET requests to the `/users` endpoint are served from `https://server2.com` and **not** from `https://server1.com`.

> **NOTE:**
> When providing multiple servers in an OpenAPI document keep in mind that they should all **provide the same API** (since they are being listed in the same document).
>
> If the servers are used for different environments (for example Testing and Production), chances are that their APIs will be different and describing them in a single document will be complicated.
>
> In these cases it is probably better to use different documents, and even different API versions. Read the [Reusing Descriptions](components) page to learn how to avoid code duplication and maintenance costs in these scenarios.

Conversely, if no servers are provided, it is assumed that all API endpoints are relative to the location where the OpenAPI document is being served.

Finally, the server URLs can contain variable portions, as shown next.

## Server Variables

Server URLs can contain variables, delimited by curly braces `{}`:

```yaml
servers:
- url: https://{username}.server.com:{port}/{version}
```

These variables **must** then be further detailed in the `variables` field. This field is a map pairing variable names (matching the ones in curly braces in the server's `url`) and [Server Variable Objects](https://spec.openapis.org/oas/v3.1.0#server-variable-object).

The [Server Variable Object](https://spec.openapis.org/oas/v3.1.0#server-variable-object) has the following fields:

- `default` (string): This is a **mandatory** field and it is the value that should be used if there is no other value to provide.
- `enum` (array of strings): If present, this array lists the valid values for the variable (and the `default` value must be in the array).
- `description` (string): Documentation always helps understand the purpose of a variable.

Therefore, the above example could be extended like this:

```yaml
servers:
- url: https://{username}.server.com:{port}/{version}
  variables:
    username:
      default: demo
      description: This value is assigned by the service provider.
    port:
      enum:
        - "8443"
        - "443"
      default: "8443"
    version:
      default: v1
```

> **NOTE**:
> The `default` variable value works differently than the default [Schema Object](https://spec.openapis.org/oas/v3.1.0#schema-object) value used in other parts of the OpenAPI Specification. The latter is optional, meaning that if a [Schema Object](https://spec.openapis.org/oas/v3.1.0#schema-object) value is not provided it should be assumed to be the default value. On the other hand, server variables **must always be provided**.

## Summary

This page has shown that:

- Server lists can be provided through the `servers` array.
- This array is present at different levels ([OpenAPI Object](https://spec.openapis.org/oas/v3.1.0#oasServers), [Path Item Object](https://spec.openapis.org/oas/v3.1.0#pathItemServers) and  [Operation Object](https://spec.openapis.org/oas/v3.1.0#operationServers)) and only the innermost one is used.
- Server URLs can contain `variables` for further customization like `https://{username}.server.com:{port}/{version}`
