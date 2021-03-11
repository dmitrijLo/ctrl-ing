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

Until now the component object accepts the following properties:

* `type` or name of component: `input`, `slider`, `dropdown`, `toggle`, `button`, `output`, `color`
> **Note:** Value of type is an object that accepts some optional settings. For now left it empty (`{}`), possible settings will be explained in the examples.
* `path` accepts a string which represents the way to the targeted value
> **e.g.:** Let the targeted object be
> ```JavaScript
> var model = {
>   nodes: [ 
>       { id: 'A', x:100, y:50 },
>       { id: 'B', x:0, y:100 },
>       { id: 'C', x:75, y:75 }
>   ]
> }
> ```
> then the path to the y-value of node C is `"nodes/2/y"`. Don't forget since `nodes` is an array its index begins at `0`.
* `on` takes an object whose property match an event and the value match a function that will be executed.
> **e.g.:** `"on": { "click": "myFunction" }`<br>
> **Note:** Until now the events `click`, `input` and `change` are implemented. If there is no function to execute `on` can be ommited.

## Input

<script>var inputExample = { x:10 }</script>

```HTML
<ctrl-ing ref="inputExample">
{
    "add": [
        { "input":{ "label":"velocity","min":10,"max":100,"step":0.5 },
          "path":"x","on":{"change":"myFunc"} }
    ]
}
</ctrl-ing>
```

<ctrl-ing ref="inputExample" xOffset=20 yOffset=-15>
{
    "add": [ { "input":{"label":"velocity","min":10,"max":100,"step":0.5},"path":"x" } ]
}
</ctrl-ing>

## Slider

<script>var rangeExample = { x:10 }</script>

```HTML
<ctrl-ing ref="rangeExample">
{
    "add": [
        { "slider":{ "label":"velocity","min":10,"max":100,"step":0.5 },
          "path":"x","on":{"input":"myFunc"} }
    ]
}
</ctrl-ing>
```

<ctrl-ing ref="rangeExample" xOffset=20 yOffset=-15>
{
    "add": [ { "slider":{"label":"velocity","min":10,"max":100,"step":0.5},"path":"x" } ]
}
</ctrl-ing>

## Dropdown

<script>var dropdownExample = { geometry: 'triangle' }</script>

```HTML
<ctrl-ing ref="dropdownExample">
{
    "add": [
        { "dropdown":{ "label":"Geometry Area", "default":"triangle", "circle":"circle", "rectangle":"rectangle","pentagon":"pentagon" }, "path":"geometry" }
    ]
}
</ctrl-ing>
```

<ctrl-ing ref="dropdownExample" xOffset=20 yOffset=-15>
{
    "add": [
        { "dropdown":{ "label":"Geometry Selection", "default":"triangle", "circle":"circle", "rectangle":"rectangle","pentagon":"pentagon" }, "path":"geometry"}
    ]
}
</ctrl-ing>

## Toggle

<script>var toggleExample = { runAnimation: false }</script>

```HTML
<ctrl-ing ref="toggleExample">
{
    "add": [ 
        { "toggle":{ "label":"Animation" }, "path":"runAnimation" } 
    ]
}
</ctrl-ing>
```

<ctrl-ing ref="toggleExample" xOffset=20 yOffset=-15>
{
    "add": [ { "toggle":{ "label":"Run Animation" }, "path":"runAnimation" } ]
}
</ctrl-ing>

## Button

<script>var buttonExample = {}</script>

```HTML
<ctrl-ing ref="buttonExample">
{
    "add": [ 
        { "button":{ "label":"Add mass" }, "on":{ "click":"addMass" } } 
    ]
}
</ctrl-ing>
```

<ctrl-ing ref="buttonExample" xOffset=20 yOffset=-15>
{
    "add": [ { "button":{ "label":"Add mass" }, "on":{ "click":"addMass" } } ]
}
</ctrl-ing>

## Output

<script>var outputExample =  {momentOfInertia: 1000.123456789 }</script>

```HTML
<ctrl-ing ref="outputExample">
{
    "add": [ 
        { "output": { "label":"Moment of Inertia",
          "unit":"kg m^2", "accuracy":2 }, "path": "momentOfInertia" }
    ]
}
</ctrl-ing>
```

<ctrl-ing ref="outputExample" xOffset=20 yOffset=-15>
{
    "add": [{ "output": { "label":"Moment of Inertia","unit":"kg m^2", "accuracy":2 }, "path": "momentOfInertia" }]
}
</ctrl-ing>

## Color

<script>var colorExample =  { color: '#DE3163' }</script>

```HTML
<ctrl-ing ref="colorExample">
{
    "add": [ 
        { "color": { "label": "Fill", "color":"#DE3163" }, "path": "color" }
    ]
}
</ctrl-ing>
```

<ctrl-ing ref="colorExample" xOffset=20 yOffset=-15>
{
    "add": [ 
        { "color": { "label": "Fill", "color":"#DE3163" }, "path": "color" }
    ]
}
</ctrl-ing>