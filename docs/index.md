---
"layout": "page",
"title": "ctrl-ing"
---

<canvas id="c" width="750" height="401" style="left:0rem;border:1px solid black;"></canvas>
<div style="position:relative;width:20rem;top:-29rem;left:1rem">

# `<ctrl-ing>`

Take control over objects with this minimalistic panel designed as custom HTML element.

</div>
<ctrl-ing ref="model" xOffset=50>
{
    "add":[ {"input":{}},{"dropdown":{}},{"toggle":{}},{"slider":{}},{"color":{}},{"output":{}},{"button":{}} ]
}
</ctrl-ing>

<script src="./bin/canvasInteractor.js"></script>
<script src="./bin/g2.core.js"></script>
<script src="./bin/g2.lib.js"></script>
<script src="./bin/g2.ext.js"></script>
<script src="./bin/g2.selector.js"></script>

<script>
const ctx = document.getElementById('c').getContext('2d');
const interactor = canvasInteractor.create(ctx, {x:200,y:200,cartesian:true});
const selector = g2.selector(interactor.evt);  // sharing 'evt' object ... !
const ctrlUpdate = () => document.getElementById('ctrl').update(); //ctrl-ing API for manual update
var model = { 
    mass: [ { x:0,y:0,m:10,label:'A' },
            { x:100,y:0,m:16,label:'B' },
            { x:0,y:-100,m:1,label:'C' }],
}
const g = g2().clr()                          // important with 'interaction'
              .view(interactor.view)           // view sharing ... !
              .grid()

interactor.on('tick', (e) => { g.exe(selector).exe(ctx) } )
          .on('pan',  (e) => { interactor.view.x += e.dx; interactor.view.y += e.dy; })
          .on('drag', (e) => {
              if (selector.selection && selector.selection.drag) {
                  selector.selection.drag({x:e.xusr,y:e.yusr,dx:e.dxusr,dy:e.dyusr,mode:'drag'});
                  update(e);
                  centroid.del().gnd(model.centroid);
                  ctrlUpdate();
              }})
          .startTimer();
</script>