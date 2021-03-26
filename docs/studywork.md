---
"layout": "page",
"title": "Studienarbeit",
"math": true,
"g2": true
---

### Abstract

## Einleitung

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

Um das webbasierte Modell hinreichend analysieren zu können, bedarf es interaktiver Elemente, die das Steuern und Verstellen des Modells direkt im Webbrowser ermöglichen. Andernfalls ist der häufige Eingriff in den Quelltext erforderlich, was zum einen zu Fehlern führen kann und zum andren beispielsweise während einer Präsentation undenkbar ist.

HTML bietet von sich aus eine Vielzahl an Elementen, welche in Verbindung mit JavaScript die gewünschte Interaktivität gewähren. So lassen sich standardmäßig 

* Eingabefelder
* Schieberegler
* Knöpfe
* Checkboxen
* Auswahllisten
* u.v.m

recht einfach realisieren. Allerdings erfordert die Implementierung dieser Elemente eine Menge repetitiver und vor allem monotoner Codezeilen, die stetig mit der Anzahl an Eingabemöglichkeiten wachsen. Die Auflistungen 1 und 2 sollen diesen Sachverhalt verdeutlichen. Für das Beispiel aus Abbildung 1 wurde zur Variation der Gliedlängen $a$, $b$, $c$ und $d$ jeweils ein Eingabefeld, zudem ein Schieberegler zur Steuerung des Drehwinkels $\varphi$ der Kurbel, mehrere Checkboxen zum Aktivieren/Deaktivieren der jeweiligen Darstellung vom Momentanpol, Wendepol, Wendekreis, Geschwindigkeitsvektor, Beschleunigungsvektor und der Koppelkurve und zwei Knöpfe zum Starten bzw. Zurücksetzen der Animation erstellt. Abgesehen von der bereits erwähnten Monotonie, schwindet insbesondere beim HTML die Übersichtlichkeit und damit die Lesbarkeit des Codes. Zu allem Übel ist der Code nicht einmal wiederverwendbar.

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

####

Es darf nicht unerwähnt bleiben, dass einige sogenannter GUI-Bibliotheken bereits existieren und für die zuvor beschriebene Problemstellung einen Lösungsansatz bieten. Zwei sehr gute Lösung sind zum einen dat.GUI und zum andren Tweakpane, die im Grunde sehr ähnlich funktionieren. Nach Erstellung einer Instanz der jeweiligen JavaScript-Bibliothek stehen dem Benutzer zahlreiche Funktionen zur Verfügungen, die mit wenigen Zeilen Code ein graphisches Interface implementieren. Verknüpft mit einer beliebigen Variable lässt sich diese manipulieren. Dies soll an einem einfachen Beispiel unter dem Einsatz von `tweakpane.js` demonstriert werden. 

Angenommen die Eckpunkte eines Dreiecks sollen durch ein Interface verstellbar sein, so kann das Dreieck durch ein Objekt, welches das Array `nodes` mit allen Eckpunkten beinhaltet, repräsentiert sein. Nach Erstellung einer neuen Instanz der Tweakpane-Klasse in der Konstanten `gui`, steht nun beispielsweise die Funktion `addInput()` zur Verfügung, die ein Input-Element erzeugt und das Steuern jener Koordinate ermöglicht. Auf diese Art und Weise lassen sich die einzelnen Koordinaten des Dreiecks, wie in der Auflistung 3 gezeigt, recht einfach mit einem Interface verbinden, was einer sauberen Lösung verglichen mit dem Code in Auflistung 1 und 2 gleicht.

#### Listing 3: Demonstration von tweakpane.js

```JavaScript
const triangle = { // Zielobjekt
    nodes: [ {x:75,y:50}, {x:150,y:200}, {x:250,y:10} ] // Array beinhaltet Eckpunkte des Dreiecks
}
const gui = new Tweakpane();    // Erstellt neue Instanz der Tweakpane-Klasse
gui.addInput(triangle.nodes[0], 'x', {label: 'A0x'});   // Aufrufen der nun
gui.addInput(triangle.nodes[0], 'y', {label: 'A0y'});   // zur Verfügung
gui.addInput(triangle.nodes[1], 'x', {label: 'B0x'});   // stehenden Funktionen
gui.addInput(triangle.nodes[1], 'y', {label: 'B0y'});   // ...
gui.addInput(triangle.nodes[2], 'x', {label: 'C0x'});   // ...
gui.addInput(triangle.nodes[2], 'y', {label: 'C0x'});   // ...
```

#### Livebeispiel 1:

<aside style="max-width:60%; float:left;">
<h4>Ausgabe:</h4>
<span id="output"><span>
</aside>

<aside>
<h4>Tweakpane Interface</h4>
<span id="someContainer"><span>
</aside>

<script>
   const triangle = {
    nodes: [ {x:75,y:50}, {x:150,y:200}, {x:250,y:10} ]
}
const gui = new Tweakpane({container: document.getElementById('someContainer')}); 
gui.addInput(triangle.nodes[0], 'x', {label: 'A0x'});
gui.addInput(triangle.nodes[0], 'y', {label: 'A0y'});
gui.addInput(triangle.nodes[1], 'x', {label: 'B0x'});
gui.addInput(triangle.nodes[1], 'y', {label: 'B0y'});
gui.addInput(triangle.nodes[2], 'x', {label: 'C0x'});
gui.addInput(triangle.nodes[2], 'y', {label: 'C0x'});
document.getElementById('output').innerHTML = `const triangle = { <br>&nbsp;
    nodes: [ {x: ${triangle.nodes[0].x}, y: ${triangle.nodes[0].y}}, {x: ${triangle.nodes[1].x}, y: ${triangle.nodes[1].y}}, {x: ${triangle.nodes[2].x}, y: ${triangle.nodes[2].y}} ] <br>} `;
gui.on('change', () => {
  document.getElementById('output').innerHTML = `const triangle = { <br>&nbsp;
    nodes: [ {x: ${triangle.nodes[0].x}, y: ${triangle.nodes[0].y}}, {x: ${triangle.nodes[1].x}, y: ${triangle.nodes[1].y}}, {x: ${triangle.nodes[2].x}, y: ${triangle.nodes[2].y}} ] <br>} `;
});
</script>

<br><br><br><br><br><br><br><br>

Anders als die gängigen GUI-Bibliotheken, welche dem Benutzer lediglich verschiedene Funktionen bereitstellen, beschäftigt sich diese Studienarbeit mit dem Entwurf einer minimalistischen JavaScript-Bibliothek, die dem Anwender ein benutzerdefiniertes HTML Element (engl.: custom HTML element) zur Verfügung stellt. Dieses Element, auch Webkomponente genannt, nimmt ähnlich wie GUI-Bibliotheken die Programmierung einer graphischen Steuerung weitestgehend ab und gewährt damit die geforderte Interaktivität. Jedoch bringt es zusätzlich noch einige weitere Vorteile mit sich, die diese Arbeit im weiteren Verlauf verdeutlicht.

## Document Object Model

<figure>
<img width=600px src="./DOM.png"/>
<h4>Abb. 2: Beispiel eines Document Object Models</h4>
</figure>

Das Document Object Model (kurz DOM) ist eine elementare Webtechnologie und wichtig für das weitere Verständnis. Das DOM kann auch als Schnittstelle zwischen dem statischen HTML und dem dynamischen JavaScript aufgefasst werden[^1]. Beim Laden einer Webseite erstellen alle modernen Browser aus dem HTML, das als einfacher Text aufgefasst werden kann, ein Modell bestehend aus Knoten, die entsprechend einer Baumstruktur angeordnet sind. Abbildung 2 stellt eine mögliche Baumstruktur dar.

Es wird zwischen vier Knotentypen unterschieden:

* Dokumentenknoten (Blau): Ausgangspunkt für alle weiteren Aktionen.
* Elementknoten (Grün): HTML-Elemente z.B. `<p>`, `<h1>`, `<body>` usw. werden zu Elementknoten im DOM-Baum
* Attributeknoten (Orange): Zum Beispiel die Klasse oder ID eines Elementknoten.
* Textknoten (Violett): Text bzw.`innerHTML` wird in Textknoten gespeichert.

Jeder Knoten ist für sich ein Objekt und beinhaltet Methoden und Eigenschaften [^1]. Das heißt es ist möglich mittels JavaScript Knoten auszuwählen, zu verändern, zu entfernen und zu erzeugen. So erstellt zum Beispiel der Befehl

```JavaScript
const title = document.createElement('h1');
```

ein `<h1>`-Element in der Variable `title`, die anschließend mit

```JavaScript
title.textContent = 'Kapitel 2';
document.getElementById('bodyID').appendChild(title);
```

einen Textknoten erhält und an das Element mit der `id = 'bodyID'` angeheftet wird. Diese beispielhafte Vorgehensweise wird auch DOM-Manipulation genannt[^1] und stellt die Grundlage aller JavaScript GUI-Bibliotheken dar.

## Webkomponente

Webkomponente sind im Vergleich zum world wide web eine recht junge Technologie. Erstmals vorgestellt wurde es 2011 von Alex Russell. Die Idee dahinter ist es das DOM erweiterbar zu machen und damit die Art und Weise, wie zukünftig Webanwendungen gebaut werden, zu verändern^[1].

Nochmal zurück zur Codeliste 1, welche zeigt, dass eine einfache Steuerung sich durchaus mit nativen HTML-Elementen implementieren lässt. Unglücklicherweise birgt dieser Code hauptsächlich Nachteile. Der Aufwand ist groß, der Code besitzt kaum Semantik, alle Komponenten sind im DOM sichtbar, wodurch das gesamte Dokument mit jedem weiteren Element an Übersicht verliert und schlussendlich kann es nicht einmal wiederverwendet werden.

Der Ansatz von `Tweakpane.js` ist besser, da es abstrakt betrachtet mittels JavaScript alle Elemente im Hintergrund erzeugt, dann in einer Komponente, meist einem `<div>` oder `<span>` bündelt und anschließend an das DOM heftet. Insofern kommt der Benutzer mit dem erzeugten HTML-Code nicht in Berührung. Dennoch kritisiert Russel diesen Ansatz, indem er sich fragt, ob es uns wirklich gut tut, wenn wir auf diese Weise alles, was keine Semantik besitzt, in JavaScript vor uns selbst verstecken, damit wir uns nicht schuldig fühlen müssen^[1]. Zudem bleibt das Problem, dass die sogenannten Kind-Elemente gleichermaßen im DOM sichtbar sind und zum Beispiel vom `CSS` des Benutzers unbeabsichtigt beeinflusst werden können, bzw. andersherum kann das `CSS` solcher Skripte die Anwendung des Benutzers beeinträchtigen.

Die Webkomponente wirkt diesen Problemen entgegen, indem es seine Funktionalität in sich von außen kapselt^[3]. Anders gesagt, ermöglicht es, individuelle HTML-Elemente zu erstellen, die beispielsweise ähnlich dem `<button>`-Element, von außen betrachtet undurchsichtig sind, ungeachtet dessen eine vielseitige Funktion erfüllen. Das Ganze setzt sich aus den drei Haupttechnologien

* Benutzerdefinierte Elemente
* Shadow DOM
* HTML-Vorlagen

zusammen und wird nachfolgend näher betrachtet, wobei HTML-Vorlagen außen vor gelassen werden, da sie innerhalb dieser Arbeit nicht verwendet wurden. Sie dienen dem benutzerdefiniertem Element als Schablone und können mehrfach wiederverwendet werden [^3]. 

### Benutzerdefinierte Elemente

### Shadow DOM

Das shadow DOM ist diejenige Technik, die die HTML-Struktur, das CSS und das Verhalten der Webkomponente von dem eigentlichen Dokument trennt[^1]. Im wesentlichen unterscheidet es sich von dem regulären DOM nicht. Die einzelnen Knoten der Baumstruktur sind genauso als Objekte mit den selben Eigenschaften und Methoden vertreten. Infolgedessen kann die Vorgehensweise aus dem Kapitel DOM analog zur Manipulation angewendet werden. Der Unterschied ist, dass 

```JavaScript
let shadowRoot = elementRef.attachShadow({mode:'open'});
```

initiiert. 

Das sogenannte shadow-tree wird and das eigentliche DOM Angehängt an das

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
    function start() {
        console.log('Animation is running!');
    }
    render()
</script>

<ctrl-ing ref="model" header="Steuerung eines Dreiecks">
{
    "add": [
        { "id":"A0x","dropdown":{"label":"A0.x","default":"min","mid":100,"high":200},"path":"nodes/0/x","on":{ "input":"render" } }, 
        { "id":"A0y","slider":{"min":50,"max":350,"step":0.5,"label":"A0.y"},"path":"nodes/0/y","on":{ "change":"render" } }, 
        { "toggle":{ "label":"B0.x", "switchTo": 220 },"path":"nodes/1/x","on":{ "click":"render" } }, 
        { "number":{ "label":"B0.y" },"path":"nodes/1/y","on":{ "input":"render" } }, 
        { "button": { "label":"Start" }, "on":{ "click":"start" } },
        { "color": { "label": "Fill", "color":"#DE3163" } },
        { "output": { "label":"velocity", "unit":"m/s" }, "path": "nodes/0/x" }
    ]
}
</ctrl-ing>

Zur Implementierung einer Steuerung für das einfache Beispiel eines Dreiecks genügt dieser HTML-Code:

<br><br><br><br>

```JSON
<ctrl-ing ref="model" header="Steuerung eines Dreiecks" id="ctrling">
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
</ctrl-ing>
```

## Quellen

[1] https://fronteers.nl/congres/2011/sessions/web-components-and-model-driven-views-alex-russell
[2] https://developer.mozilla.org/de/docs/Web/Web_Components
https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
