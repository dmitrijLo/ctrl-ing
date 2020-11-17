---
"layout": "page",
"title": "About"
---

### Abstract

Als Human-Machine Interface (Abkürzung HMI) wird im allgemeinen Sprachgebrauch eine Benutzerschnittstelle eines meist komplexen Systems verstanden, mit dem ein Mensch interagieren kann. Ein alltägliches Beispiel stellt das Lenkrad zur Steuerung eines Autos dar. Während dieses Beispiel ... befasst sich diese Studienarbeit mit der Programmierung einer JavaScript micro library (zu deutsch Mikrobibliothek)

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

<hm-i ref="model" header="Steuerung eines Dreiecks" id="hmi">
{
    "add": [
        { "slider":{ },"path":"nodes/0/x","on":{ "input":"render" } }, 
        { "input":{ "label":"A0.y" },"path":"nodes/0/y","on":{ "input":"render" } }, 
        { "input":{ "label":"B0.x" },"path":"nodes/1/x","on":{ "input":"render" } }, 
        { "input":{ "label":"B0.y" },"path":"nodes/1/y","on":{ "input":"render" } }, 
        { "input":{ "label":"C0.x" },"path":"nodes/2/x","on":{ "input":"render" } }, 
        { "input":{ "label":"C0.y" },"path":"nodes/2/y","on":{ "input":"render" } } 
        ]
}
</hm-i>

Zur Implementierung einer Steuerung für das einfache Beispiel eines Dreiecks genügt dieser HTML-Code:

```json
<hm-i ref="model" header="Steuerung eines Dreiecks" id="hmi">
{
    "add":[
        { "number":{ "label":"A0.x" },"path":"nodes/0/x","on":{ "input":"render" } },
        { "number":{ "label":"A0.y" },"path":"nodes/0/y","on":{ "input":"render" } },
        { "number":{ "label":"B0.x" },"path":"nodes/1/x","on":{ "input":"render" } },
        { "number":{ "label":"B0.y" },"path":"nodes/1/y","on":{ "input":"render" } },
        { "number":{ "label":"C0.x" },"path":"nodes/2/x","on":{ "input":"render" } },
        { "number":{ "label":"C0.y" },"path":"nodes/2/y","on":{ "input":"render" } }
    ]
}
</hm-i>
```

## Funktionale Anforderungen

* Das Interface muss die nachfolgenden Elemente beinhalten:
    * Standard Input
    * Slider
    * Dropdown Menü
    * Checkbox
    * Button
    * ...?
* Der Nutzer soll die Möglichkeit haben die Position des Interface alternativ einzustellen.
