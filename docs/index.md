---
"layout": "page",
"title": "About",
"math": true
---

### Abstract

## Problemstellung

<aside>
<g-2 width="250" height="200" x0="30" y0="50" cartesian>
{ 
"main": [
    { "c": "beam", "a": { "pts":[0,50,40,20,100,120],"fs":"silver", "label":{"str":"b", "off": 5 }}},
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
<h4>Abb. 1: Webbasiertes Modell eines Viergelenks mit Koppelpunkt</h4>
</aside>

An der Fachhochschule Dortmund vermittelt das Wahlpflichtmodul Web-Kinematik den Studiereden des Fachbereichs Maschinenbau die fundamentalen Grundlagen moderner Webtechnologien. Dabei werden Problemstellungen der technischen Mechanik mittels HTML, CSS und JavaScript in eine einfache Form einer Webanwendung überführt. Abbildung 1 zeigt beispielhaft das webbasierte Modell eines Viergelenkgetriebes, welches einer typischen Aufgabenstellung entspricht. Ist das Modell einmal überführt, lassen sich zahlreiche Eigenschaften dessen analysieren. So kann beispielweise die Umlauffähigkeit, die zurückgelegte Bahn einzelner Punkte, die Geschwindigkeit oder Beschleunigung z.B des ebenfalls dargestellten Koppelpunktes oder gar die unterschiedlichen Pole der ebenen Bewegung visualisiert werden.

Um das webbasierte Modell hinreichend analysieren zu können bedarf es interaktiver Elemente, die das Steuern und Verstellen des Modells direkt im Webbrowser ermöglichen. Andernfalls ist der häufige Eingriff in den Quelltext erforderlich, was zum einen zu Fehlern führen kann und zum andren beispielsweise während einer Präsentation undenkbar ist.

HTML bietet von sich aus eine Vielzahl an Elementen, welche in Verbindung mit JavaScript die gewünschte Interaktivität gewähren. So lassen sich standardmäßig 

* Eingabefelder
* Schieberegler
* Knöpfe
* Checkboxen
* Auswahllisten
* u.v.m

recht einfach realisieren. Allerdings erfordert die Implementierung dieser Elemente eine Menge repetitiven und vor allem monotonen Code, der stetig mit der Anzahl an Eingabemöglichkeiten wächst. Die Auflistungen 1 und 2 sollen diesen Sachverhalt verdeutlichen. Für das Beispiel aus Abbildung 1 wurde zur Variation der Gliedlängen $a$, $b$, $c$ und $d$ jeweils ein Eingabefeld, zudem ein Schieberegler zur Steuerung des Drehwinkels $\varphi$ der Kurbel, mehrere Checkboxen zum Aktivieren/Deaktivieren der jeweiligen Darstellung vom Momentanpol, Wendepol, Wendekreis, Geschwindigkeitsvektor, Beschleunigungsvektor und der Koppelkurve und zwei Knöpfe zum Starten bzw. Zurücksetzen der Animation erstellt. Abgesehen von der bereits erwähnten Monotonie, schwindet insbesondere beim HTML die Übersichtlichkeit und damit die Lesbarkeit des Codes.

#### Listing 1: HTML Struktur zur Erzeugung einer Variation an Bedienelementen

```HTML
<div id="display" class="display">
    <label for="input-a">Länge a:
        <input type="number" id="input-a" class="feld" min="10" max="800" step="1" value="">mm
    </label>
    <br>
    <label for="input-b">Länge b:
        <input type="number" id="input-b" class="feld" min="10" max="800" step="1" value="">mm
    </label>
    <br>
    <label for="input-c">Lände c:
        <input type="number" id="input-c" class="feld" min="10" max="800" step="1" value="">mm
    </label>
    <br>
    <label for="input-d">Länge d:
        <input type="number" id="input-d" class="feld" min="10" max="800" step="1" value="">mm
    </label>
    <br>
    <label for="phiSlider">&phiv;:
        <input type="range" id="phiSlider" class="slider" min="0" max="360">
        <output id="phiOut" for="phiSlider">0</output>°
    </label>
    <br>
    <label for="speed">Geschwindigkeit:</label>
    <select id="speed">
        <option value="0.5">0,5x</option>
        <option value="1" selected>1x</option>
        <option value="2">2x</option>
        <option value="4">4x</option>
    </select>
    <br><br>
    <input type="checkbox" id="velocity">
    <label for="velocity"> Geschwindigkeit anzeigen</label>
    <br>
    <input type="checkbox" id="acceleration">
    <label for="acceleration"> Beschleunigung anzeigen</label>
    <br>
    <input type="checkbox" id="path">
    <label for="path"> Bahn des Koppelpunktes anzeigen</label>
    <br>
    <input type="checkbox" id="releaseK">
    <label for="releaseK"> Koppelpunkt lösen</label>
    <br>
    <input type="checkbox" id="connectK">
    <label for="connectK"> Koppelpunkt verbinden</label>
    <br>
    <button id="startButton">Start</button>
    <button id="resetButton">Reset</button>
    <br>
    <form id="info">
    </form>   
</div>
```

#### Listing 2: Herstellen der Interaktivität durch Kopplung zwischen HTML und JavaScript mittels Event-Handler

```JavaScript
// Erstellung der Referenzen zu den jeweiligen HTML-Elementen
const input_a = document.getElementById('input-a'),
      input_b = document.getElementById('input-b'),
      input_c = document.getElementById('input-c'),
      input_d = document.getElementById('input-d'),
      phiSlider = document.getElementById('phiSlider'),
      phiOut = document.getElementById('phiOut'),
      speed = document.getElementById('speed'),
      velocity = document.getElementById('velocity'),
      acceleration = document.getElementById('acceleration'),
      path = document.getElementById('path'),
      releaseK = document.getElementById('releaseK'),
      connectK = document.getElementById('connectK'),
      info = document.getElementById('info'),
      startButton = document.getElementById('startButton'),
      resetButton = document.getElementById('resetButton');
/*
Deklaration einiger Event-Funktionen
*/
// Erstellung der Event-Handler
input_a.addEventListener("input", updateInput);
input_b.addEventListener("input", updateInput);
input_c.addEventListener("input", updateInput);
input_d.addEventListener("input", updateInput);
phiSlider.addEventListener("input", updateSlider);
speed.addEventListener("change", changeSpeed);
startButton.addEventListener("click", startStop);
releaseK.addEventListener("click", function () { /*...*/ });
resetButton.addEventListener("click",refreshPage);
```

<!--

## Einleitung

Als Human-Machine Interface (Abkürzung HMI) wird im allgemeinen Sprachgebrauch eine Benutzerschnittstelle eines meist komplexen Systems verstanden, mit dem ein Mensch interagieren kann. Ein alltägliches Beispiel stellt das Lenkrad zur Steuerung eines Autos dar. Während dieses Beispiel ... befasst sich diese Studienarbeit mit der Programmierung einer JavaScript micro library (zu deutsch Mikrobibliothek)

--->

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
        { "id":"A0x","dropdown":{"label":"A0.x","min":-10,"mid":100,"high":200},"path":"nodes/0/x","on":{ "input":"render" } }, 
        { "id":"A0y","slider":{"min":50,"max":350,"step":0.5,"label":"A0.y"},"path":"nodes/0/y","on":{ "change":"render" } }, 
        { "toggle":{ "label":"B0.x", "switchTo": 220 },"path":"nodes/1/x","on":{ "click":"render" } }, 
        { "input":{ "label":"B0.y" },"path":"nodes/1/y","on":{ "input":"render" } }, 
        { "id":"C0x","path":"nodes/2/x" }, 
        { "id":"C0y","path":"nodes/2/y" } 
        ],
    "connect": [
        { "p1": "C0x","p2": "C0y","on":{ "input":"render" }, "label":"Punkt C" }
    ]
}
</hm-i>

Zur Implementierung einer Steuerung für das einfache Beispiel eines Dreiecks genügt dieser HTML-Code:

<br><br><br><br>

```JSON
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