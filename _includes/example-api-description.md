# {{ include.name }}

{{ include.description }}

## JSON

```json
{% include_relative {{ include.name | append: ".json" }} %}
```

## YAML

```yaml
{% include_relative {{ include.name | append: ".yaml" }} %}
```
