# {{ include.name }}

{% assign json_file = include.name | append: ".json" %}
{% assign yaml_file = include.name | append: ".yaml" %}

{{ include.description }}

## JSON

```json
{% include_relative {{ json_file }} %}
```

## YAML

```yaml
{% include_relative {{ yaml_file }} %}
```
