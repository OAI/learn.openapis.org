---
layout: default
title: Use a Design-First Approach
parent: Best Practices
nav_order: 1
---

# Use a Design-First Approach

Traditionally, two main approaches exist when creating OADs: **Code-first** and **Design-first**.

- In the Code-first approach, **the API is first implemented in code**, and then its description is created from it, using code comments, code annotations or simply written from scratch. This approach does not require developers to learn another language so it is usually regarded as the easiest one.

- Conversely, in Design-first, **the API description is written first** and then the code follows. The first obvious advantages are that the code already has a skeleton upon which to build, and that some tools can provide boilerplate code automatically.

There have been a number of heated debates over the relative merits of these two approaches but, in the opinion of the OpenAPI Initiative (OAI), the importance of using **Design-first** cannot be stressed strongly enough.

The reason is simple: **The number of APIs that can be created in code is far superior to what can be described in OpenAPI**. To emphasize: **OpenAPI is not capable of describing every possible HTTP API, it has limitations**.

Therefore, unless these descriptive limitations are perfectly known and taken into account when coding the API, they will rear their ugly head later on when trying to create an OpenAPI description for it. At that point, the right fix will be to change the code so that it uses an API which can be actually described with OpenAPI (or switch to Design-first altogether).

Sometimes, however, since it is late in the process, it will be preferred to twist the API description so that it matches *more or less* the actual API. It goes without saying that this leads to **unintuitive and incomplete descriptions**, that will rarely scale in the future.

Finally, there exist a number of [validation tools](https://tools.openapis.org/categories/data-validators) that can verify that the implemented code adheres to the OpenAPI description. Running these tools as part of a Continuous Integration process allows changing the OpenAPI Description with peace of mind, since deviations in the code behavior will be promptly detected.

> **Bottom line:**
> OpenAPI opens the door to a [wealth of automated tools](https://tools.openapis.org). Make sure you use them!
