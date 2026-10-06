---
layout: default
title: Keep a Single Source of Truth
parent: Best Practices
nav_order: 2
---

# Keep a Single Source of Truth

Regardless of your design approach (design-first or code-first) always keep a single source of truth, i.e., information should **not** be duplicated in different places. It is really the same concept used in programming, where repeated code should be moved to a common function.

Otherwise, eventually one of the places will be updated while the other won't, leading to headaches... in the best of cases.

For instance, it is also commonplace to use code annotations to generate an OpenAPI description and then commit the latter to source control while the former still lingers in the code. As a result, newcomers to the project will not know which one is actually in use and mistakes will be made.

Alternatively, you can use a Continuous Integration test to ensure that the two sources stay consistent.
