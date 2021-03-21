---
"layout": "page",
"title": "ctrl-ing"
---

<script src="./bin/canvasInteractor.js"></script>
<script>
    g2.prototype.mass = function(args) { return this.addCommand({c:'mass',a:args}); }
    g2.prototype.mass.prototype = g2.mix(g2.prototype.cir.prototype, {
    m: 1,
    isSolid: true,
    draggable: true,
    lbloc: 'se',
    get lsh() { return this.state & g2.OVER; },
    get sh() { return this.state & g2.OVER ? [0,0,10,"black"] : false },
    get r() { return 12 + 8*Math.atan(this.m-10)/Math.PI },
    g2() {
        const {x,y,r,ls='black',fs='#ccc',sh} = this,
              pi_2 = Math.PI/2
        return g2().cir({x,y,r,ls,fs,sh}).ins((g)=>this.label && this.drawLabel(g))
                   .arc({x,y,r:r/4,w:pi_2,dw:pi_2})
                   .arc({x,y,r:r/2,w:pi_2,dw:pi_2})
                   .arc({x,y,r:3*r/4,w:pi_2,dw:pi_2})
    }
});
</script>

# Components

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

A simple number element accepts numeric input. Optional settings are `label`, `min`, `max` and `step`. The following example shows a circle that changes its size depending on user input.

```HTML
<ctrl-ing ref="circle">
{
    "add": [
        { "number":{ "label":"Radius","min":1,"max":250,"step":0.5 }, "path":"r" }
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
    "add": [ { "number":{"label":"Radius","min":1,"max":250,"step":0.5},"path":"r" } ]
}
</ctrl-ing>

## Slider <span id="slider">

The slider is suitable for adjustments within a range. The example below shows a spring-mass system. The slider allows to increase the angle of the pendulum and with it to tension the spring.

> **Note:** Optional settings are the same as for number element.

```HTML
<ctrl-ing ref="pendulum">
{
    "add": [
        { "slider":{ "label":"Angle &alpha;","min":10,"max":100,"step":0.5 },
          "path":"x","on":{"input":"myFunc"} }
    ]
}
</ctrl-ing>
```

<canvas id="rangeDemo" width="750" height="200" style="border:1px solid black;"></canvas>

<script>
    var pendulum =  {
        A: {x:0,y:0,label:'A'},
        B: {x:100,y:100,w:Math.PI,label:'B'},
        bar: {x1:0,x2:100,y1:0,y2:0},
        spring: {x1:100,x2:100,y1:100,y2:0},
        angle: {x:0,y:0,r:50,dw:0,lw:2,ls:'#DE3163'},
        m: {x:100,y:0,r:10,label:'m'},
        b: 100,
        _phi: "0",
        get phi () { return this._phi },
        set phi(num) {
            this._phi = num;
            this.m.x = Math.cos(-num*Math.PI/180) * this.b;
            this.m.y = Math.sin(-num*Math.PI/180) * this.b;
            this.B.x = this.m.x;
            this.bar.x2 = this.m.x;
            this.bar.y2 = this.m.y;
            this.spring.x1 = this.m.x;
            this.spring.x2 = this.m.x;
            this.spring.y2 = this.m.y;
            this.angle.dw = -num*Math.PI/180;
        }
    };
    const ctxRangeEx = document.getElementById('rangeDemo').getContext('2d');
    //const interactor = canvasInteractor.create(ctxNumEx,{x:175,y:50,cartesian:true});
    const spring = g2().clr().view(interactor.view).grid()
                       .lin({x1:-50,x2:150,y1:0,y2:0,ld:[10,3,2,3],ls:"green"})
                       .avec(pendulum.angle)
                       .bar2(pendulum.bar)
                       .spring(pendulum.spring)
                       .nodfix(pendulum.A)
                       .nodflt(pendulum.B)
                       .mass(pendulum.m);
    interactor.on('tick', (e) => { spring.exe(ctxRangeEx); })
              .startTimer();
</script>

<ctrl-ing ref="pendulum">
{
    "add": [ { "slider":{"label":"Angle &alpha;","min":0,"max":90,"step":0.5},"path":"phi" } ]
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

A toggle button or checkbox is an essential and very important element that allows switching between two states. In most cases it is used to toggle between boolean `true` and `false`, which is also the default behavior of `ctrl-ing` when implemented equal to the code listing. But `ctrl-ing` allows also to toggle between strings or numeric values. Use the optional `"switchTo":"<number or string>"` setting for this. `ctrl-ing` will store the value declared in the target object. When the toggle is pressed, the object's value will be changed to the `switchTo` value.

<script>var toggleExample = { runAnimation: false }</script>

```HTML
<ctrl-ing ref="pendulum2">
{
    "add": [ 
        { "toggle":{ "label":"Run Animation" }, "path":"dirty" } 
    ]
}
</ctrl-ing>
```

<canvas id="toggleDemo" width="750" height="200" style="border:1px solid black;"></canvas>

<script>
    var pendulum2 =  {
        A: {x:0,y:0,label:'A'},
        B: {x:100,y:100,w:Math.PI,label:'B'},
        bar: {x1:0,x2:100,y1:0,y2:0},
        spring: {x1:100,x2:100,y1:100,y2:0},
        angle: {x:0,y:0,r:50,dw:0,lw:2,ls:'#DE3163'},
        m: {x:100,y:0,m:10,label:'m'},
        b: 100,
        _phi: 30,
        L0: 100,
        t:0,
        dirty:false,
        get phi () { return this._phi },
        get omega() { return Math.sqrt( (this.D/this.m.m) - this.delta**2 ); },
        get k() { return 0.5 },
        get delta() { return this.k/(2*this.m.m); },
        get D() { return (4 * this.m.m * 9.81) / (this.b/1000) },
        get x0() {return Math.sin(-this.phi*Math.PI/180) * this.b;},

        init(){
            this.m.x = Math.cos(-this.phi*Math.PI/180) * this.b;
            this.m.y = Math.sin(-this.phi*Math.PI/180) * this.b;
            this.B.x = this.m.x;
            this.bar.x2 = this.m.x;
            this.bar.y2 = this.m.y;
            this.spring.x1 = this.m.x;
            this.spring.x2 = this.m.x;
            this.spring.y2 = this.m.y;
            this.angle.dw = -this.phi*Math.PI/180;
        },
        animation(){
            const y = (this.x0/1000*Math.cos(this.omega*this.t*Math.PI/180 + 15*Math.PI/180) * Math.exp(-this.delta*this.t)) * 1000;
            const x = Math.sqrt(this.b**2 - y**2);
            this.m.x = x;
            this.m.y = y;
            this.B.x = x;
            this.bar.x2 = x;
            this.bar.y2 = y;
            this.spring.x1 = x;
            this.spring.x2 = x;
            this.spring.y2 = y;

        }
    };
    pendulum2.init();
    const ctxTglEx = document.getElementById('toggleDemo').getContext('2d');
    //const interactor = canvasInteractor.create(ctxNumEx,{x:175,y:50,cartesian:true});
    const spring2 = g2().clr().view(interactor.view).grid()
                       .lin({x1:-50,x2:150,y1:0,y2:0,ld:[10,3,2,3],ls:"green"})
                       .avec(pendulum2.angle)
                       .bar2(pendulum2.bar)
                       .spring(pendulum2.spring)
                       .nodfix(pendulum2.A)
                       .nodflt(pendulum2.B)
                       .mass(pendulum2.m);
    interactor.on('tick', (e) => { 
        if(pendulum2.dirty){ 
            pendulum2.t+=1/60;
            pendulum2.animation()}
        spring2.exe(ctxTglEx); })
              .startTimer();
</script>

<ctrl-ing ref="pendulum2">
{
    "add": [ { "toggle":{ "label":"Run Animation" }, "path":"dirty" } ]
}
</ctrl-ing>

## Button <span id="button">

Buttons have the task to trigger a specific function. With `ctrl-ing` it does not take much to add a button. In the example the first button will trigger the `.addMass()` and the second button the `.deleteMass()` method of the targeted object.

> **Note:** It is possible to include normal functions as well as methods of the target object. Functions must also be available in the `window`- or rather the `globalThis`-object. Therefore arrow functions or function expressions declared with `let` or `const` will not work.

```HTML
<ctrl-ing ref="model">
{
    "add": [ 
        { "button":{ "label":"Add mass" }, "on":{ "click":"addMass" }},
        { "button":{ "label":"Delete mass"}, "on":{"click":"deleteMass" }} 
    ]
}
</ctrl-ing>
```

<canvas id="buttonDemo" width="750" height="200" style="border:1px solid black;"></canvas>
<script>
const ctxBtnEx = document.getElementById('buttonDemo').getContext('2d');
//const selector = g2.selector(interactor.evt);  // sharing 'evt' object ... !
//const ctrlUpdate = () => document.getElementById('ctrl').update(); //ctrl-ing API for manual update
var model = { 
    polygon: {
        pts: [ { x:0,y:0,m:10,label:'A' },{ x:100,y:0,m:16,label:'B' },{ x:0,y:-100,m:1,label:'C' }],
        closed:true,lw:2,ls:'darkslategray'
    },
    get a() { return { x: this.polygon.pts[1].x - this.polygon.pts[0].x ,y: this.polygon.pts[1].y - this.polygon.pts[0].y } },
    get b() { return { x: this.polygon.pts[2].x - this.polygon.pts[0].x ,y: this.polygon.pts[2].y - this.polygon.pts[0].y } },
    get area() {
        return 0.5 * Math.abs(this.tilde(this.a).x * this.b.x + this.tilde(this.a).y * this.b.y);
    },
    get centroid() {
        const faktor = 1 / 3;
        return { x: this.polygon.pts[0].x + faktor * (this.a.x + this.b.x), y: this.polygon.pts[0].y + faktor * (this.a.y + this.b.y ), label:"S" }
    },
    //not sure if right
    get momentOfInertia() {
        return (1/12) * this.scalar(this.tilde(this.a),this.b) * (this.scalar(this.a) + this.scalar(this.a, this.b) + this.scalar(this.b))
    },
    addMass(){
        const first = this.polygon.pts[0],
              last = this.polygon.pts[this.polygon.pts.length - 1],
              label = String.fromCharCode(last.label.charCodeAt() + 1),
              newMass = {x: Math.floor((Math.random() - 0.5)*200),
                         y: Math.floor((Math.random() - 0.5)*200), label: `${label}` };
        this.polygon.pts.push(newMass);
        polygon.mass(newMass);
    },
    deleteMass(){
        if(this.polygon.pts.length > 1){
            const last = this.polygon.pts.pop();
            polygon.commands.pop();
        }
    },
    tilde(vec) { return { x: - vec.y  , y: vec.x } },
    scalar(v1,v2 = v1){ return v1.x * v2.x + v1.y * v2.y },
}
const polygon = g2().clr()                          // important with 'interaction'
              .view({x:interactor.view.x,y:interactor.view.y + 100})           // view sharing ... !
              .grid()
              .ply(model.polygon)
              .mass(model.polygon.pts[0])
              .mass(model.polygon.pts[1])
              .mass(model.polygon.pts[2]);
interactor.on('tick', (e) => { polygon/* .exe(selector) */.exe(ctxBtnEx) } )
          .on('pan',  (e) => { interactor.view.x += e.dx; interactor.view.y += e.dy; })
          /* .on('drag', (e) => {
              if (selector.selection && selector.selection.drag) {
                  selector.selection.drag({x:e.xusr,y:e.yusr,dx:e.dxusr,dy:e.dyusr,mode:'drag'});
                  update(e);
                  centroid.del().gnd(model.centroid);
                  ctrlUpdate();
              }}) */
          .startTimer();
</script>

<ctrl-ing ref="model">
{
    "add": [ 
        { "button":{ "label":"Add mass" }, "on":{ "click":"addMass" }},
        { "button":{ "label":"Delete mass" }, "on":{ "click":"deleteMass"}}
    ]
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

Not much to say here. `ctrl-ing` provides an input of type color which is implemented as shown in the code listing. The display is strongly dependent on the browser used. The best appearance was found in chrome-browser.

> **Note:** It is also possible to use rgb or rgba values. The notation is rgb(100,50,200) respectively rgba(100,50,200,0.5).

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