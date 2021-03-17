---
"layout": "page",
"title": "ctrl-ing"
---

<script src="./bin/canvasInteractor.js"></script>

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

## Number <span id="number">

```HTML
<ctrl-ing ref="numberExample">
{
    "add": [
        { "input":{ "label":"velocity","min":10,"max":100,"step":0.5 },
          "path":"x","on":{"change":"myFunc"} }
    ]
}
</ctrl-ing>
```

<canvas id="numberDemo" width="750" height="100" style="border:1px solid black;"></canvas>

<script>
    var circle =  {x:0,y:0,r:60,fs:'lightgreen'};
    const ctxNumEx = document.getElementById('numberDemo').getContext('2d');
    const interactor = canvasInteractor.create(ctxNumEx,{x:175,y:50,cartesian:true});
    const cir = g2().clr().view(interactor.view).grid().cir(circle);
    interactor.on('tick', (e) => { cir.exe(ctxNumEx); })
              .startTimer();
</script>

<ctrl-ing ref="circle">
{
    "add": [ { "input":{"label":"Radius","min":10,"max":100,"step":0.5},"path":"r" } ]
}
</ctrl-ing>

## Slider <span id="slider">

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

<ctrl-ing ref="rangeExample">
{
    "add": [ { "slider":{"label":"velocity","min":10,"max":100,"step":0.5},"path":"x" } ]
}
</ctrl-ing>

## Dropdown <span id="dropdown">

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

<ctrl-ing ref="dropdownExample">
{
    "add": [
        { "dropdown":{ "label":"Geometry Selection", "default":"triangle", "circle":"circle", "rectangle":"rectangle","pentagon":"pentagon" }, "path":"geometry"}
    ]
}
</ctrl-ing>

## Toggle <span id="toggle">

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

<ctrl-ing ref="toggleExample">
{
    "add": [ { "toggle":{ "label":"Run Animation" }, "path":"runAnimation" } ]
}
</ctrl-ing>

## Button <span id="button">

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

<ctrl-ing ref="buttonExample">
{
    "add": [ { "button":{ "label":"Add mass" }, "on":{ "click":"addMass" } } ]
}
</ctrl-ing>

## Output <span id="output">

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

<ctrl-ing ref="outputExample">
{
    "add": [{ "output": { "label":"Moment of Inertia","unit":"kg m^2", "accuracy":2 }, "path": "momentOfInertia" }]
}
</ctrl-ing>

## Color <span id="color">

```HTML
<ctrl-ing ref="points">
{
    "add": [ 
        { "color": { "label": "Color of linestroke", "color":"#DE3163" }, "path": "ls" }
    ]
}
</ctrl-ing>
```

<canvas id="colorDemo" width="750" height="100" style="border:1px solid black;"></canvas>

<script>
    const ctxColor = document.getElementById('colorDemo').getContext('2d');
    var points = {pts:[{x:200,y:0}],ls:'#DE3163',lw:3};
    //const ply = g2().ply({pts:points,ls:colorExample.color,lw:3});
    const ply = g2().del().clr().view(interactor.view).grid().ply(points);
    let i = 0;
    let forward = true;
    interactor.on('tick', (e) => {
        i+=0.5;
        forward ? points.pts.push({x: Math.cos(Math.PI * i / 60 ) * 200, y: Math.sin(Math.PI * i / 20) * 40}) : points.pts.shift();
        if(points.pts.length === 240 || points.pts.length === 0) { forward = !forward; };
        ply.exe(ctxColor);
        }).startTimer();
</script>

<ctrl-ing ref="points">
{
    "add": [ 
        { "color": { "label": "Color of linestroke", "color":"#DE3163" }, "path": "ls" }
    ]
}
</ctrl-ing>