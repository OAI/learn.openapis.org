---
layout: default
title: Best Practices
nav_order: 5
has_children: true
has_toc: false
---

# Best Practices

This page contains general pieces of advice which do not strictly belong to the [Specification Explained](../specification) chapter because they are not directly tied to the OpenAPI Specification (OAS).

However, they greatly simplify creating and maintaining OpenAPI Descriptions (OADs), so they are worth keeping in mind.

This section is split into topic-specific pages:

{% assign section_pages = site.pages
	| where_exp: "p", "p.dir == page.dir and p.url != page.url and p.title"
	| sort: "nav_order" %}

{% for p in section_pages %}
- [{{ p.title }}]({{ p.url | relative_url }})
{% endfor %}
