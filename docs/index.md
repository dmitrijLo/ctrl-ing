---
"layout": "page",
"title": "ctrl-ing"
---

<script src="./bin/canvasInteractor.js"></script>
<canvas id="c" width="750" height="401" style="left:0rem;border:1px solid black;"></canvas>
<div style="position:relative;width:20rem;top:-29rem;left:1rem">

# `<ctrl-ing>`

Take control over objects with this minimalistic panel designed as custom HTML element.

</div>

<ctrl-ing id="ctrl" ref="model" header="Federpendel">
{
    "add": [
        { "slider":{"label":"Federkraft"},"path":"loads/0/k"}, 
        { "toggle":{ "label":"Release" },"path":"release" }, 
        { "button": { "label":"Reset" }, "on":{ "click":"reset" } },
        { "output": { "label":"Angle", "unit":"rad","accuracy":3 }, "path": "constraints/0/_angle" }
    ]
}
</ctrl-ing>

<script>
    const ctx = document.getElementById("c").getContext("2d");
    const interactor = canvasInteractor.create(ctx,{ x:200,y:110,cartesian: true });
    console.log(document.getElementById('ctrl'));
    const ctrlUpdate = () => document.getElementById('ctrl').update(); //ctrl-ing API for manual update
    var model = {
        "release": false,
        "nodes": [
            { "id":"A","x":0,"y":0,"base":true },
            { "id":"B","x":100,"y":100,"idloc":"e" },
            { "id":"C","x":100,"y":-57.735,"idloc":"ne" },
            { "id":"D","base":true,"x":0,"y":100}
        ],
        "constraints": [
            { "id":"a","p1":"A","p2":"C","len":{ "type":"const","input":true } },
            { "id":"b","p1":"B","p2":"C","ori":{ "type":"const" } },
            { "id":"c","p1":"D","p2":"B","ori":{ "type":"const" },"lw":1, "ls":"black","ld":[20,4,2,4] }
        ],
        "loads": [
            { "type":"spring","id":"S1","p1":"B","p2":"C", "k":33.983576,"len0":100 },
            { "id":"mg","type":"force","p":"C","w0":-Math.PI/2,"value":9.81 }
        ],
        "shapes": [
            { "type":"flt","p":"B","w0":-Math.PI },
            { "type":"fix","p":"A" }
        ],
        "views": [
            { "show":"w","of":"a","as":"info","x":10,"y":75,"Dt":1.9,"id":"view1" }
        ]
    };
    
    mec.model.extend(model);
    model.init();
    const g = g2().clr().grid().view(interactor.view);
    model.draw(g);
    interactor.on('tick', e => {
        if(model.release) {
            model.tick(1/60);
            ctrlUpdate();
        }
        g.exe(ctx);
    })
    .startTimer();
</script>