---
layout: default
title: Describing API Security
parent: The OpenAPI Specification Explained
nav_order: 8
---

# Describing API Security

One feature of OpenAPI that can prove useful to API providers and consumers is the means to describe API security. Providing information about the security that protects a given API and its Operations is useful to humans, as they can understand security restrictions and account for them in their implementation, and for tooling that can generate code or provide features that facilitate submitting authorization parameters.

OpenAPI provides the [Security Scheme Object](https://spec.openapis.org/oas/latest.html#security-scheme-object), which contains security definitions that can be referenced either globally or per [Operation](https://spec.openapis.org/oas/v3.1.0#operation-object). Unlike other Component objects, Security Scheme objects are referenced by name using a [Security Requirement Object](https://spec.openapis.org/oas/latest.html#security-requirement-object). A security description for a given API or Operation therefore **must** be defined as a Security Scheme Object as they cannot be declared inline.

<figure style="text-align:center">
  <object type="image/svg+xml" data="{{site.baseurl}}/img/security-object.svg"></object>
  <figcaption>Security Scheme objects are referenced as Security Requirements, either <a href="structure.html#minimal-openapi-description-structure">globally</a> or by an <a href="paths.html#the-operation-object">Operation</a>.</figcaption>
</figure>

A Security Requirement declared for a given Operation takes precedence over global Security Requirements. A number of security mechanisms are supported. Each mechanism is indicated using the `type` property, which is shown in the examples below.

There is currently five supported security types, namely:

- API Keys
- HTTP Authentication
- Mutual TLS
- OAuth 2.0
- OpenID Connect

Each is discussed in the sections below.

## API Keys

An API key is - generally speaking - the API equivalent of a password and is used to supply a secret known only by a given API consumer and the API provider. There are no formal standards that govern API keys and the industry generally relies on accepted best practices for their definition. OpenAPI therefore provides flexibility in how they are defined.

For example, an API provider might use the HTTP header `api-key` as the means for API consumers to send their API keys with each request. A Security Scheme object can be defined to indicate in which HTTP header the API Key should be sent:

```yaml
components:
  securitySchemes:
    defaultApiKey:
      description: API key provided in console
      type: apiKey
      name: api-key
      in: header
```

The API provider can then use the name of this Scheme Scheme object to apply security either globally or for a given Operation (both are shown below for the sake of exemplar):

```yaml
openapi: 3.1.0
info:
  title: Tic Tac Toe
  description: |
    This API allows writing down marks on a Tic Tac Toe board
    and requesting the state of the board or of individual squares.
  version: 1.0.0
security:
  defaultApiKey: []
paths:
  /board:
    get:
      security:
        defaultApiKey: []
```

This method of referencing Security Scheme objects is valid for all types. The array shown as the value of `defaultApiKey` above is populated for OAuth Flow and OpenID Connect objects, which have some additional features that are discussed below. In all other cases an empty array is provided.

## HTTP Authentication

OpenAPI supports HTTP Authentication as defined in RFC7235, which implements the [`Authorization`](https://httpwg.org/specs/rfc7235.html#header.authorization) header as the means to send both the authorization scheme identifier and the parameter in the format `Authorization: Basic b3BlbmFwaTppc2dyZWF0`. The authorization scheme _should_ be defined in the [IANA registry for HTTP Authentication](https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml), but API providers can extend this to use custom values if required.

The example below shows a Security Scheme object that specifies both Basic Authentication and Bearer tokens. The Bearer token example includes an additional hint, the `bearerFormat` property, that gives the API consumer additional information on format of the token (in this case a [JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519) or JWT).

```yaml
components:
  securitySchemes:
    basicHttpAuthentication:
      description: Basic HTTP Authentication
      type: http
      scheme: Basic
    bearerHttpAuthentication:
      description: Bearer token using a JWT
      type: http
      scheme: Bearer
      bearerFormat: JWT
```

You'll note that in both cases the information provided is relatively terse. OpenAPI provides enough information to give humans and tooling the means to understand the basic security requirements, but deployment information such as onboarding or key exchange is out-of-scope.

## Mutual TLS

Mutual authentication over TLS (mTLS) is a very common API security approach in verticals such as financial services. This is due to its enhanced security posture through authentication of the HTTP Client at the transport layer.

Defining mTLS in OpenAPI is very simple:

```yaml
type: mutualTLS
```

As before the information provided is terse. Establishing the private key infrastructure used to govern communications between the API provider and consumer, together with the associated deployment information such as certificate signing and so on, is beyond the scope of OpenAPI.

## OAuth 2.0

OAuth 2.0 is a very popular authorization framework in the API world due to its support for delegated access without giving up End Users credentials to an untrusted application. It is described using a specific object, namely the [OAuth Flows Object](https://spec.openapis.org/oas/latest.html#oauth-flows-object). This object is provided due to the relative complexity of the protocol compared to other security types, with different grant types representing different mechanisms for obtaining authorization to access protected resources.

The OAuth Flows Object has properties representing the different OAuth 2.0 grant types, each of which references the [OAuth Flow Object](https://spec.openapis.org/oas/latest.html#oauth-flow-object). The OAuth Flow Object properties describe the Authorization Server URL, Token Endpoint and optionally the permitted OAuth scopes.

The example below shows the properties for the Client Credentials and Authorization Code grant types:

```yaml
components:
  securitySchemes:
    oauth2Profiles:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://learn.openapis.org/oauth/2.0/token
          scopes:
            board:read: Read the board
            board:write: Write to the board
        authorizationCode:
          authorizationUrl: https://learn.openapis.org/oauth/2.0/auth
          tokenUrl: https://learn.openapis.org/oauth/2.0/token
          scopes:
            board:read: Read the board
            board:write: Write to the board
```

These can then be applied globally or for a given Operation, with a list of required scopes:

```yaml
openapi: 3.1.0
info:
  title: Tic Tac Toe
  description: |
    This API allows writing down marks on a Tic Tac Toe board
    and requesting the state of the board or of individual squares.
  version: 1.0.0
security:
  oauth2Profiles:
    - board:read
    - board:write
paths:
  /board:
    get:
      security:
        oauth2Profiles: []
```

Note that if you want to segregate grant types - where, for example, Client Credentials is only supported for a specific Operation - you'll need to create a separate Security Scheme object that can be applied individually. This is also true if you want to differentiate the available scopes, for example:

```yaml
components:
  securitySchemes:
    app2AppOauth:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://learn.openapis.org/oauth/2.0/token
            # Only reading the board allow with delegated access
            board:read: Read the board
    user2AppOauth:
        authorizationCode:
          authorizationUrl: https://learn.openapis.org/oauth/2.0/auth
          tokenUrl: https://learn.openapis.org/oauth/2.0/token
          scopes:
            # Reads and writes permitted via authorization code flow
            board:read: Read the board
            board:write: Write to the board
```

These then be declared as separate Security Requirements:

```yaml
info:
  title: Tic Tac Toe
  description: |
    This API allows writing down marks on a Tic Tac Toe board
    and requesting the state of the board or of individual squares.
  version: 1.0.0

paths:
  /board:
    get:
      security:
        app2AppOauth:
        - board:read
      ...
  /board/{row}/{column}:
    put:
      security:
        user2AppOauth:
        - board:read
        - board:write
      ...
```

> Please refer to our [example OpenAPI document](../examples/tictactoe.yaml) for the complete example.

## OpenID Connect

The final Security Scheme type is OpenID Connect, which provides information for [OpenID Connect Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html).

OpenID Connect Core is obviously an OAuth 2.0 profile and is supported by some of properties the OAuth Flow Object. However, OpenID Connect is generally more complex than plain OAuth 2.0 and given OpenID Connect Discovery provides a machine-readable format at the discovery endpoint it makes sense to outsource this functionality entirely.

Specifying OpenID Connect is therefore straightforward in that you provide the discovery endpoint in the property `openIdConnectUrl`:

```yaml
components:
  securitySchemes:
    openIdConnect:
      type: openIdConnect
      openIdConnectUrl: https://learn.openapis.org/.well-known/openid-configuration
```

The neat trick here is that **_you do not need to declare scopes in your OpenAPI document_**. You can specify scopes in your discovery endpoint, and then use them in your OpenAPI document with the expectation that compatible tooling will have parsed and read them:

```yaml
openapi: 3.1.0
info:
  title: Tic Tac Toe
  description: |
    This API allows writing down marks on a Tic Tac Toe board
    and requesting the state of the board or of individual squares.
  version: 1.0.0
security:
  openIdConnect:
    - board:read
    - board:write
```

This approach allows OpenAPI to provide _just enough_ information for humans and tooling, whilst ensuring that OpenID Connect Discovery provides the system-or-record for security-related information.

## Summary

In this page we've learnt that:

- API security can be described in OpenAPI.
- Security properties must be described using a Security Scheme object.
- A Security Scheme object is referenced either globally or for a given Operation using a Security Requirement.
- OpenAPI supports a number of built-in security types, with different properties dependent on the type.
