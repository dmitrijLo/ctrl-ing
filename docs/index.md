---
"layout": "page",
"title": "About"
---

### Abstract

## Problemstellung

<aside>
<g-2 width="250" height="200" x0="30" y0="50" cartesian>
{ 
"main": [
    { "c": "beam", "a": { "pts":[0,50,40,20,100,120], 
    "fs":"silver", "label":{"str":"b", "off": 5 }}},
    { "c": "bar", "a": { "x1":0, "y1":0, "x2":0, "y2":50, "label":{"str":"a", "off": -5 }}},
    { "c": "bar", "a": { "x1":0, "y1":50, "x2":100, "y2":120, "label":{"str":"b", "off": -5 }}},
    { "c": "bar", "a": { "x1":200, "y1":0, "x2":100, "y2":120, "label":{"str":"b", "off": 5 }}},
    { "c": "origin","a": {"x": 0,"y": 0,"lw": 1.5}},
    { "c": "nodfix", "a": { "x":0, "y":0, "label":{"str":"A0", "loc": "sw", "off": 15 } } },
    { "c": "nodfix", "a": { "x":200, "y":0, "label":{"str":"B0", "loc": "sw", "off": 15 } } },
    { "c": "nod", "a": { "x":0, "y":50, "label":{"str":"A", "loc": "nw", "off": 5 } } },
    { "c": "nod", "a": { "x":100, "y":120, "label":{"str":"B", "loc": "ne", "off": 5 } } },
    { "c": "nod", "a": { "x":40, "y":20, "label":{"str":"K", "loc": "n", "off": 5 } } }
    ]
}
</g-2>

#### **Abb. 1:** Webbasiertes Modell eines Viergelenks mit Koppelpunkt

</aside>

An der Fachhochschule Dortmund vermittelt das Wahlpflichtmodul Web-Kinematik den Studiereden des Fachbereichs Maschinenbau die fundamentalen Grundlagen moderner Webtechnologien. Dabei werden Problemstellungen der technischen Mechanik mittels HTML, CSS und JavaScript in eine einfache Form einer Webanwendung überführt. Abbildung 1 zeigt beispielhaft das webbasierte Modell eines Viergelenkgetriebes, welches einer typischen Aufgabenstellung entspricht. Ist das Modell einmal überführt, lassen sich beispielweise die Geschwindigkeit und Beschleunigung des ebenfalls dargestellten Koppelpunktes analysieren und mittels Vektoren sogar visualisieren.

Die webbasierten Modelle lassen sich mittels interaktiver Elemente steuern, so können unterschiedliche 

## Einleitung

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
        { "id":"A0x","slider":{ },"path":"nodes/0/x","on":{ "input":"render" } }, 
        { "id":"A0y","dropdown":{ "label":"A0.y", "low":0, "medium":75, "high":125 },"path":"nodes/0/y","on":{ "input":"render" } }, 
        { "toggle":{ "label":"B0.x", "closed": 220 },"path":"nodes/1/x","on":{ "click":"render" } }, 
        { "input":{ "label":"B0.y" },"path":"nodes/1/y","on":{ "input":"render" } }, 
        { "input":{ "label":"C0.x" },"path":"nodes/2/x","on":{ "input":"render" } }, 
        { "input":{ "label":"C0.y" },"path":"nodes/2/y","on":{ "input":"render" } } 
        ],
    "connect": [
        { "p1": "A0x", "p2": "A0y" }
    ]
}
</hm-i>

Zur Implementierung einer Steuerung für das einfache Beispiel eines Dreiecks genügt dieser HTML-Code:

```json
<hm-i ref="model" header="Steuerung eines Dreiecks" id="hmi">
{
    "add":[
        { "input":{ "label":"A0.x" },"path":"nodes/0/x","on":{ "input":"render" } },
        { "input":{ "label":"A0.y" },"path":"nodes/0/y","on":{ "input":"render" } },
        { "input":{ "label":"B0.x" },"path":"nodes/1/x","on":{ "input":"render" } },
        { "input":{ "label":"B0.y" },"path":"nodes/1/y","on":{ "input":"render" } },
        { "input":{ "label":"C0.x" },"path":"nodes/2/x","on":{ "input":"render" } },
        { "input":{ "label":"C0.y" },"path":"nodes/2/y","on":{ "input":"render" } }
    ]
}
</hm-i>
```

## Funktionale Anforderungen

* Das Interface muss die nachfolgenden Elemente beinhalten:
    * Standard Input
    * Slider
    * Dropdown Menü
    * Checkbox (Toggle)
    * Buttons
    * Output
    * constraints/connection
    * ...?
* Der Nutzer soll die Möglichkeit haben die Position des Interface alternativ einzustellen.
