---
"layout": "page",
"title": "ctrl-ing"
---

# Attributes

`<ctrl-ing>` provides several attributes.

## Required

* `ref`: Reference to the target object.

## Optional

* `id`: Set a custom id. Omit for default id `ctrl`.
* `header`: Label the header of the element. Otherwise the header will be set to `ctrl-ing`.
* `xOffset`: Shift the element a number of `px` to the left.
* `yOffset`: Shift the element a number of `px` down.

## Minimal example

```HTML
<ctrl-ing ref="model" header="Headline" xOffset=100 yOffset=50>
//...
</ctrl-ing>
```