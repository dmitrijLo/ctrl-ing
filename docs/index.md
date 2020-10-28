---
"layout": "page",
"title": "About"
---

### Abstract

<canvas id="cv" width="350" height="250"></canvas>

<script>
    const ctx = document.getElementById("cv").getContext("2d");
    var model = {
        "nodes": [
            { "id": "A0", "x": 75, "y": 50 },
            { "id": "B0", "x": 150, "y": 200 },
            { "id": "C0", "x": 250, "y": 10 }
        ],
        "constraints": [
        { "id": "a", "p1": "A0", "p2": "B0" }, 
        { "id": "b", "p1": "B0", "p2": "C0" }, 
        { "id": "c", "p1": "C0", "p2": "A0" }
        ]
    };
    mec.model.extend(model);
    model.init();
    function render() {
        const g = g2().del().clr().view({ cartesian: true });
        model.draw(g);
        g.exe(ctx);
    return g;
    }
    render()

</script>

<!--
<script>
    let hmi = new HMI(600, 100);

    hmi.addInput(model.nodes[0], 'x', {
        min: 10,
        max: 100,
        step: 0.5,
        label: 'r_a [x]'
    }).on('change', () => render() )
    .addInput(model.nodes[0], 'y', {
        label: 'r_a [y]'
    })
    .on('change', () => render() )
    .addInput(model.nodes[1], 'x', {
        label: 'r_b [x]'
    })
    .on('change', () => render() )
    .addInput(model.nodes[1], 'y', {
        label: 'r_b [y]'
    })
    .on('change', () => render() )
    .addInput(model.nodes[2], 'x', {
        label: 'r_c [x]'
    })
    .on('change', () => render() )
    .addInput(model.nodes[2], 'y', {
        label: 'r_c [y]'
    })
    .on('change', () => render() )
</script>

<script>
    let pane = new Tweakpane();
    pane.addInput(model.nodes[0], 'y');
</script>
-->


<hm-i id='hmi'>
{
    "model": "model",
    "addInput": [
        { "id": "A0", "param": "x", "options":{ "min": 10, "max": 100, "step": 0.5, "label": "r_a [x]" }},
        { "id": "A0", "param": "y" },
        { "id": "B0", "param": "x" },
        { "id": "B0", "param": "y" },
        { "id": "C0", "param": "x" },
        { "id": "C0", "param": "y" }
    ],
    "on": [
        {"change":"render", "of":"A0", "ref":"x"}
    ]
}
</hm-i>


## TODO

* width/height Einstellungsmöglichkeit
* Slider
* Buttons
* dropdown Listen
* Checkboxen
* +/- buttons überdenken...