---
"layout": "page",
"title": "ctrl-ing"
---

# Inputs

Add components by writing into the innerHtml of the `ctrl-ing`-element. The `ctrl-ing`-element interprets its innerHTML using the [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) format.

Start with:

```HTML
<ctrl-ing ref="targetObject">
{
    "add": [

    ]
}
</ctrl-ing>
```

> **Note:** `"add"` defines the array containing all components which are in turn represented as objects.

## Input

<script>var targetObject = { x:10 }</script>

```HTML
<ctrl-ing ref="targetObject">
{
    "add": [
        { "input":{ "label":"velocity","min":10,"max":100,"step":0.5 },
          "path":"x","on":{"change":"myFunc"} }
    ]
}
</ctrl-ing>
```

<ctrl-ing ref="targetObject" xOffset=20 yOffset=-15>
{
    "add": [ { "input":{"label":"velocity","min":10,"max":100,"step":0.5},"path":"x" } ]
}
</ctrl-ing>

## Slider

<script>var targetObject = { x:10 }</script>

```HTML
<ctrl-ing ref="targetObject">
{
    "add": [
        { "slider":{ "label":"velocity","min":10,"max":100,"step":0.5 },
          "path":"x","on":{"input":"myFunc"} }
    ]
}
</ctrl-ing>
```

<ctrl-ing ref="targetObject" xOffset=20 yOffset=-15>
{
    "add": [ { "slider":{"label":"velocity","min":10,"max":100,"step":0.5},"path":"x" } ]
}
</ctrl-ing>

## Dropdown

## Toggle

## Button

## Output

## Color

