---
layout: default
title: Enhanced Tags
parent: The OpenAPI Specification Explained
nav_order: 9
---

# Enhanced Tags
{: .d-inline-block }
OpenAPI 3.2+
{: .label .label-green }

Tags provide a way to group and organize operations in your API documentation. OpenAPI 3.2 significantly enhances tag functionality with hierarchical organization, classification, and improved display options.

## Basic Tag Usage (All Versions)

Tags have been available since OpenAPI 2.0 for basic operation grouping:

```yaml
openapi: 3.1.0
tags:
  - name: users
    description: User management operations
  - name: orders
    description: Order processing operations

paths:
  /users:
    get:
      tags: [users]
      summary: List users
```

## Enhanced Tags in OpenAPI 3.2

OpenAPI 3.2 introduces powerful new fields that make tags more useful for API organization and navigation.

### New Tag Fields

#### Summary Field

The `summary` field provides a short display name for tags, useful in navigation and lists. This replaces the need for the `x-displayName` extension:

```yaml
# OpenAPI 3.2
tags:
  - name: user-management
    summary: Users
    description: Complete user lifecycle management including registration, authentication, and profile management
```

#### Parent Field for Hierarchical Organization

Create tag hierarchies using the `parent` field, which enables a tag to be nested inside another tag.
If you used the `x-tagGroups` extension in OpenAPI < 3.2, nesting provides a first-class way to build a tags structure.

```yaml
# OpenAPI 3.2
tags:
  - name: products
    summary: Products
    description: All product-related operations

  - name: cakes
    summary: Cakes
    description: Cake catalog and customization
    parent: products

  - name: pastries
    summary: Pastries
    description: Pastries and small baked goods
    parent: products

  - name: seasonal-cakes
    summary: Seasonal
    description: Limited-time seasonal cake offerings
    parent: cakes
```

#### Kind Field for Tag Classification

The `kind` field allows you to use different sets of tags for different purposes.
The goal here is to enable arbitrary grouping and labeling of endpoints, for multiple use cases.

```yaml
# OpenAPI 3.2
tags:
  - name: products
    summary: Products
    description: Core product operations
    kind: nav 

  - name: deprecated-v1
    summary: Legacy V1
    description: Deprecated version 1 endpoints
    kind: lifecycle 

  - name: beta-features
    summary: Beta
    description: Experimental features
    kind: lifecycle

  - name: mobile-optimized
    summary: Mobile
    description: Mobile-optimized endpoints
    kind: device
```

See the [Tag Kind Registry](https://spec.openapis.org/registry/tag-kind/index.html) for values commonly used with tags and generally supported by tooling.
However this field is free text, so you can extend its use as you need to.

### Complete Enhanced Tags Example

```yaml
openapi: 3.2.0
info:
  title: Bakery API
  version: 2.0.0

tags:
  # Main navigation categories
  - name: products
    summary: Products
    description: All bakery product operations
    kind: nav

  - name: orders
    summary: Orders
    description: Order management and tracking
    kind: nav

  # Product subcategories
  - name: cakes
    summary: Cakes
    description: Custom cakes and layer cakes
    parent: products
    kind: nav

  - name: breads
    summary: Breads
    description: Artisan breads and rolls
    parent: products
    kind: nav

  # Special categories
  - name: seasonal
    summary: Seasonal
    description: Limited-time seasonal offerings
    kind: badge
    externalDocs:
      description: Seasonal menu planning
      url: https://docs.bakery.com/seasonal

paths:
  /cakes:
    get:
      tags: [cakes]
      summary: List available cakes

  /cakes/seasonal:
    get:
      tags: [cakes, seasonal]
      summary: List seasonal cake offerings

  /orders/wholesale:
    post:
      tags: [orders, wholesale]
      summary: Create wholesale order
```

## Best Practices

1. **Use hierarchical organization** for complex APIs with many operations
2. **Provide summary fields** for all tags to improve navigation clarity
3. **Use consistent kind values** - follow registry conventions
4. **Combine tags thoughtfully** - operations can have multiple tags for cross-cutting concerns
5. **Consider your audience** - use audience-specific tags when serving multiple user types

Enhanced tags in OpenAPI 3.2 provide powerful tools for creating well-organized, navigable API documentation that scales with your API's complexity.
