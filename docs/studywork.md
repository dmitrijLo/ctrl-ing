---
"layout": "page",
"lang": "de",
"title": "Programmierung einer Webkomponente zur Steuerung ebener Mechanismen",
"author": "Demetrius Lorenz",
"matrikelnummer": "7097413",
"erstprüfer": "Prof. Dr.-Ing. Stefan Gössner",
"adresses": ["Fachhochschule Dortmund"],
"date": "März 2021",
"description": "Studienarbeit \n am Fachbereich Maschinenbau \n Studiengang Maschinenbau",
"tags": ["Kinematik", "Mechanismentechnik", "microJam"],
"math": true,
"g2": true
---

<section class="new-page">
<h6>&nbsp;</h6>

# Inhalt

<section id="content">

[1. Einführung](#1-einführung) <span id="dots"></span> 2

[1.1 Document Object Model](#1.1-document-object-model) <span id="dots"></span> 5

[2. Webkomponente](#2-Webkomponente) <span id="dots"></span> 7

[2.1 Shadow DOM](#2.1-shadow-dom) <span id="dots"></span> 8

[2.2 Benutzerdefiniertes Element](#2.2-benutzerdefiniertes-element) <span id="dots"></span> 8

[3 ctrl-ing](#3-ctrl-ing) <span id="dots"></span> 10

[3.1 Add ctrling.js to a project](#3.1) <span id="dots"></span> 10

[3.2 Create an object](#3.2) <span id="dots"></span> 10

[3.3 Create a controller](#3.3) <span id="dots"></span> 11

[3.4 Components](#3.4) <span id="dots"></span> 11

[3.4.1 Number](#3.4.1) <span id="dots"></span> 12

[3.4.2 Slider](#3.4.2) <span id="dots"></span> 12

[3.4.3 Dropdown](#3.4.3) <span id="dots"></span> 13

[3.4.4 Toggle](#3.4.4) <span id="dots"></span> 13

[3.4.5 Button](#3.4.5) <span id="dots"></span> 14

[3.4.6 Output](#3.4.6) <span id="dots"></span> 15

[3.4.7 Color](#3.4.7) <span id="dots"></span> 15

[4 Federpendel](#4) <span id="dots"></span> 16

[5 Fazit](#5) <span id="dots"></span> 19

[6 Literatur](#6) <span id="dots"></span> 20

</section></section>

<section class="new-page">
<h6>Einführung</h6>

## 1 Einführung

<aside style="min-width:40%">
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
<h5>Abb. 1: Webbasiertes Modell eines Viergelenks mit Koppelpunkt</h5>
</aside>

An der Fachhochschule Dortmund vermittelt das Wahlpflichtmodul Web-Kinematik den Studiereden des Fachbereichs Maschinenbau die fundamentalen Grundlagen moderner Webtechnologien. Dabei werden Problemstellungen der technischen Mechanik mittels HTML, CSS und JavaScript in eine einfache Form einer Webanwendung überführt [[1](#1)]. Abbildung 1 zeigt beispielhaft das webbasierte Modell eines Viergelenkgetriebes, welches einer typischen Aufgabenstellung entspricht. Ist das Modell einmal überführt, lassen sich zahlreiche Eigenschaften analysieren. So kann beispielweise die Umlauffähigkeit, die zurückgelegte Bahn einzelner Punkte, die Geschwindigkeit oder Beschleunigung z.B des ebenfalls dargestellten Koppelpunktes oder gar die unterschiedlichen Pole der ebenen Bewegung visualisiert werden.

Um das webbasierte Modell hinreichend analysieren zu können, bedarf es interaktiver Elemente, die das Steuern und Verstellen des Modells direkt im Webbrowser ermöglichen. Andernfalls ist der häufige Eingriff in den Quelltext erforderlich, was zum einen zu Fehlern führt und andererseits um ein Beispiel zu nennen während einer Präsentation nicht praktikabel ist.

HTML bietet von sich aus eine Vielzahl von Elementen, welche in Verbindung mit JavaScript die gewünschte Interaktivität gewähren. So lassen sich standardmäßig 

* Eingabefelder
* Schieberegler
* Knöpfe
* Checkboxen
* Auswahllisten
* u. v. m.

recht einfach realisieren [[2](#2)]. Allerdings erfordert die Implementierung dieser Elemente eine Menge repetitiver und vor allem monotoner Codezeilen, die stetig mit der Anzahl an Eingabemöglichkeiten wachsen. Die Auflistungen 1 und 2 sollen diesen Sachverhalt verdeutlichen. Für das Beispiel aus Abbildung 1 wurde zur Variation der Gliedlängen $a$, $b$, $c$ und $d$ jeweils ein Eingabefeld, zudem ein Schieberegler zur Steuerung des Drehwinkels $\varphi$ der Kurbel, mehrere Checkboxen zum Aktivieren/Deaktivieren der jeweiligen Darstellung

</section>

<section class="new-page">
<h6>Einführung</h6>

vom Momentanpol, Wendepol, Wendekreis, Geschwindigkeitsvektor, Beschleunigungsvektor und der Koppelkurve und zwei Knöpfe zum Starten bzw. Zurücksetzen der Animation erstellt. Abgesehen von der bereits erwähnten Monotonie, schwindet insbesondere beim HTML die Übersichtlichkeit und damit die Lesbarkeit des Codes. Außerdem ist der Code auch nicht wiederverwertbar.

##### Listing 1: HTML Struktur zur Erzeugung einer Variation an Bedienelementen

```HTML
<div id="display" class="display">
    <label for="input-a">Länge a:
        <input type="number" id="input-a" class="feld" min="10" max="800" step="1" value="">mm</label>
    <label for="input-b">Länge b:
        <input type="number" id="input-b" class="feld" min="10" max="800" step="1" value="">mm</label>
    <label for="input-c">Lände c:
        <input type="number" id="input-c" class="feld" min="10" max="800" step="1" value="">mm</label>
    <label for="input-d">Länge d:
        <input type="number" id="input-d" class="feld" min="10" max="800" step="1" value="">mm</label>
    <label for="phiSlider">&phiv;:
        <input type="range" id="phiSlider" class="slider" min="0" max="360">
        <output id="phiOut" for="phiSlider">0</output>°</label>
    <label for="speed">Geschwindigkeit:</label>
    <select id="speed">
        <option value="0.5">0,5x</option>
        <option value="1" selected>1x</option>
        <option value="2">2x</option>
    </select>
    <input type="checkbox" id="velocity">
    <label for="velocity"> Geschwindigkeit anzeigen</label>
    <input type="checkbox" id="acceleration">
    <label for="acceleration"> Beschleunigung anzeigen</label>
    <input type="checkbox" id="path">
    <label for="path"> Bahn des Koppelpunktes anzeigen</label>
    <input type="checkbox" id="releaseK">
    <label for="releaseK"> Koppelpunkt lösen</label>
    <input type="checkbox" id="connectK">
    <label for="connectK"> Koppelpunkt verbinden</label>
    <button id="startButton">Start</button>
    <button id="resetButton">Reset</button>
    <form id="info">
    </form>   
</div>
```

</section>

<section class="new-page">
<h6>Einführung</h6>

##### Listing 2: Herstellen der Interaktivität durch Kopplung zwischen HTML und JavaScript mittels Event-Handler

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
//Deklaration einiger Event-Funktionen
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

Es darf nicht unerwähnt bleiben, dass einige sogenannter GUI-Bibliotheken bereits existieren und für die zuvor beschriebene Problemstellung einen Lösungsansatz bieten. Zwei sehr gute Lösungen sind zum einen dat.GUI [[3](#3)] und zum anderen Tweakpane [[4](#4)], die im Grunde sehr ähnlich funktionieren. Nach Erstellung einer Instanz der jeweiligen JavaScript-Bibliothek stehen dem Benutzer zahlreiche Funktionen zur Verfügungen, die mit wenigen Zeilen Code ein graphisches Interface implementieren. Verknüpft mit einer beliebigen Variable lässt sich diese manipulieren. Dies soll an einem einfachen Beispiel unter dem Einsatz von `tweakpane.js` demonstriert werden. 

Angenommen, dass die Eckpunkte eines Dreiecks durch ein Interface verstellbar sein sollen, so kann das Dreieck durch ein Objekt, welches das Array `nodes` mit allen Eckpunkten beinhaltet, repräsentiert sein. Nach Erstellung einer neuen Instanz der Tweakpane-Klasse in der Konstanten `gui`, steht nun beispielsweise die Funktion `addInput()` zur Verfügung, die ein Input-Element erzeugt und das Steuern jener Koordinate ermöglicht.

</section>

<section class="new-page">
<h6>Einführung</h6>

Auf diese Art lassen sich die einzelnen Koordinaten des Dreiecks, wie in der Auflistung 3 gezeigt, recht einfach mit einem Interface verbinden, was, verglichen mit dem Code in Auflistung 1 und 2, einer sauberen Lösung gleicht.

##### Listing 3: Demonstration von tweakpane.js

```JavaScript
const triangle = { // Zielobjekt                         // Array beinhaltet
    nodes: [ {x:75,y:50}, {x:150,y:200}, {x:250,y:10} ]} //Eckpunkte des Dreiecks
const gui = new Tweakpane();    // Erstellt neue Instanz der Tweakpane-Klasse
gui.addInput(triangle.nodes[0], 'x', {label: 'A0x'});   // Aufrufen der nun
gui.addInput(triangle.nodes[0], 'y', {label: 'A0y'});   // zur Verfügung
gui.addInput(triangle.nodes[1], 'x', {label: 'B0x'});   // stehenden Funktionen
gui.addInput(triangle.nodes[1], 'y', {label: 'B0y'});   // ...
gui.addInput(triangle.nodes[2], 'x', {label: 'C0x'});   // ...
gui.addInput(triangle.nodes[2], 'y', {label: 'C0x'});   // ...
```

##### Livebeispiel 1:

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

### 1.1 Document Object Model

Das Document Object Model (kurz DOM) ist eine elementare Webtechnologie und wichtig für das weitere Verständnis. Das DOM kann auch als Schnittstelle zwischen dem statischen HTML und dem dynamischen JavaScript aufgefasst werden [[5](#5)]. Beim Laden einer Webseite erstellen alle modernen Browser aus dem HTML, das als einfacher Text

</section>

<section class="new-page">
<h6>Document Object Model</h6>

aufgefasst werden kann, ein Modell bestehend aus Knoten, die entsprechend einer Baumstruktur angeordnet sind [[5](#5)]. Abbildung 2 stellt eine mögliche Baumstruktur dar.

<figure>
<img width="100%" src="./img/DOM.png"/>
<h5>Abb. 2: Beispiel eines Document Object Models</h5>
</figure>

Es wird zwischen vier Knotentypen unterschieden:

* Dokumentenknoten (Blau): Ausgangspunkt für alle weiteren Aktionen.
* Elementknoten (Grün): HTML-Elemente z.B. `<p>`, `<h1>`, `<body>` usw. werden zu Elementknoten im DOM-Baum.
* Attributeknoten (Orange): Zum Beispiel die Klasse oder ID eines Elementknoten.
* Textknoten (Violett): Text bzw.`innerHTML` wird in Textknoten gespeichert.

Jeder Knoten ist für sich ein Objekt und beinhaltet Methoden und Eigenschaften [[5](#5)]. Das heißt, dass es möglich ist mittels JavaScript Knoten auszuwählen, zu verändern, zu entfernen und zu erzeugen. So erstellt zum Beispiel der Befehl

```JavaScript
const title = document.createElement('h1');
```

ein `<h1>`-Element in der Variable `title`, die anschließend mit

```JavaScript
title.textContent = 'Kapitel 2';
document.getElementById('bodyID').appendChild(title);
```

einen Textknoten erhält und an das Element mit der `id = 'bodyID'` angeheftet wird. Diese beispielhafte Vorgehensweise wird auch DOM-Manipulation genannt [[5](#5)] und stellt die Grundlage aller JavaScript GUI-Bibliotheken dar.

</section>

<section class="new-page">
<h6>Webkomponente</h6>

## 2 Webkomponente

Verglichen mit dem *world wide web* ist die Webkomponente eine recht junge Technologie. Erstmals vorgestellt wurde es 2011 von Alex Russell [[6](#6)]. Die Idee dahinter ist, das DOM erweiterbar zu machen und damit die Art und Weise, wie zukünftig Webanwendungen gebaut werden, zu verändern [[6](#6)].

Zurück zur Codeliste 1, welche zeigt, dass eine einfache Steuerung sich durchaus mit nativen HTML-Elementen implementieren lässt. Unglücklicherweise birgt dieser Code hauptsächlich Nachteile. Der Aufwand ist groß, der Code besitzt kaum Semantik, alle Komponenten sind im DOM sichtbar, wodurch das gesamte Dokument mit jedem weiteren Element an Übersicht verliert.

Der Ansatz von `Tweakpane.js` ist besser, da es abstrakt betrachtet mittels JavaScript alle Elemente im Hintergrund erzeugt, dann in einer Komponente, meist einem `<div>` oder `<span>` bündelt und anschließend an das DOM heftet. Insofern kommt der Benutzer mit dem erzeugten HTML-Code nicht in Berührung. Dennoch kritisiert Russell diesen Ansatz, indem er sich fragt, ob es wirklich hilfreich ist, wenn wir auf diese Weise alles, was keine Semantik besitzt, in JavaScript vor uns selbst verstecken, damit wir uns nicht schuldig fühlen müssen [[6](#6)]. Zudem bleibt das Problem, dass die sogenannten Kind-Elemente gleichermaßen im DOM sichtbar sind und zum Beispiel vom `CSS` des Benutzers unbeabsichtigt beeinflusst werden. Andersherum kann das `CSS` solcher Skripte die Webseite des Benutzers beeinträchtigen.

Die Webkomponente wirkt diesen Problemen entgegen, indem es seine Funktionalität in sich von außen kapselt [[7](#7)]. Anders gesagt, ermöglicht es, individuelle HTML-Elemente zu erstellen, die beispielsweise ähnlich dem `<button>`-Element, von außen betrachtet undurchsichtig sind, ungeachtet dessen eine vielseitige Funktion erfüllen. Das Ganze setzt sich aus den drei Haupttechnologien

* Benutzerdefinierte Elemente
* Shadow DOM
* HTML-Vorlagen

zusammen [[7](#7)]. Nachfolgend wird diese näher betrachtet, wobei HTML-Vorlagen außen vor gelassen werden, da sie innerhalb dieser Arbeit nicht verwendet wurden. Sie dienen dem benutzerdefiniertem Element als Schablone und können mehrfach wiederverwendet werden [[7](#7)]. 

</section>

<section class="new-page">
<h6>Shadow DOM</h6>

### 2.1 Shadow DOM

Das *shadow-DOM* ist diejenige Technik, die die HTML-Struktur, das CSS und das Verhalten der Webkomponente von dem eigentlichen Dokument trennt [[8](#8)]. In seinen Grundzügen unterscheidet es sich nicht von dem regulären DOM. Die einzelnen Knoten der Baumstruktur sind genauso als Objekte mit denselben Eigenschaften und Methoden vertreten. Infolgedessen kann die Vorgehensweise aus dem Kapitel 1.1 gleichermaßen zur Manipulation angewendet werden.

Einer der wesentlichen Unterschiede liegt im Ausgangspunkt, welcher nach der Baumanalogie als *shadow-root* benannt und mit

```JavaScript
let shadowRoot = elementRef.attachShadow({mode:'open'});
```

initiiert wird. Das Verhalten der darauffolgenden *shadow-nodes* bleibt identisch, allerdings wirkt der Code nur innerhalb der Grenze des *shadow-trees* [[8](#8)], was die zweckmäßige Trennung erzielt und unerwünschte Seiteneffekte verhindert.

Es ist erwähnenswert, dass dieses Konzept nicht gänzlich neu ist. Das HTML-Element `<video>` besitzt nativ zahlreiche Kontrollelemente, die im DOM nicht sichtbar, also im *shadow-DOM* beheimatet sind [[8](#8)].

### 2.2 Benutzerdefiniertes Element

Wenn von Webkomponenten gesprochen wird, dann wird im eigentlichen Sinne die Möglichkeit der Erstellung eigener sogenannter benutzerdefinierter Elemente gemeint. Einmal implementiert können diese, genau wie Standard-HTML-Elemente, überall im HTML-Dokument immer wieder verwendet werden.

Um ein eigenes HTML-Element zu erstellen, benötigt es lediglich einen Namen, mit dem das Element aufgerufen wird, und ein Klassenobjekt, welches das Verhalten festlegt [[9](#9)]. Der Name des Elements muss aus zwei Worten, getrennt durch einen Bindestrich, bestehen.

Das Klassenobjekt erbt im einfachsten Fall vom `HTMLElement` und sieht in seiner Grundstruktur wie folgt aus:

</section>

<section class="new-page">
<h6>Benutzerdefiniertes Element</h6>

```JavaScript
class MeinElement extends HTMLElement {
    constructor(){
        super();
        /*...
        Verhalten des Elements
        */
    }
}
```

Im `constructor()` kann theoretisch die gesamte Funktionalität definiert werden, da jede neue Instanz von `MeinElement` als erstes den Konstruktor aufrufen wird. Es bietet sich an, die in Kapitel 2.1 behandelte *shadow-DOM* Struktur bereits im Konstruktor zu erstellen.

Demgegenüber kann die Funktionalität auf die zur Verfügung stehenden *lifecycle* Funktionen aufgeteilt werden. Man kann zwischen diesen vier Funktionen unterschieden, die zu verschiedenen Zeitpunkten aufgerufen werden [[9](#9)]:

* `connectedCallback`: Beim ersten Anbinden an das DOM.
* `disconnectedCallback`: Beim Trennen vom DOM.
* `adoptedCallback`: Wenn das Element zu einem anderen DOM bewegt wird.
* `attributeChangedCallback`: Wenn sich ein Attribut des Elementes ändert.

Zu guter Letzt muss das benutzerdefinierte Element in der `CustomElementRegistry` des Dokuments registriert werden, damit es im HTML-Dokument aufgerufen werden kann. Dies wird mit dem Befehl

```JavaScript
customElements.define('mein-element', MeinElement);
```

erreicht. Das erste Argument entspricht dem Namen des Elements und legt auch seinen HTML-Tag fest. Das zweite Argument entspricht dem Klassenobjekt, das die gesamte Funktionalität beinhaltet und von der Außenwelt verborgen hält. Das so erzeugte Element kann also, von nun an mit dem eigenen HTML-Tag `<mein-element>` überall im HTML-Dokument aufgerufen werden.

</section>

<section class="new-page">
<h6>ctrl-ing</h6>

## 3 ctrl-ing

Diese Arbeit wurde im Sinne eines Webprojektes bearbeitet. Infolgedessen wurde für die Versionierung des Quelltextes ein eigenes GitHub-Repository erstellt — `https://github.com/dmitrijLo/ctrl-ing` — und zur Präsentation eine einfache statische *github-pages* Website unter `https://dmitrijlo.github.io/ctrl-ing/components.html` angelegt.

Die aus dieser Arbeit heraus entstandene Webkomponente nennt sich `<ctrl-ing>`, bestehend aus der Abkürzung des englischen Wortes *control* (ctrl) und dem deutschen Wort Ingenieur (ing), was in Summe ausgesprochen dem englischen Wort *controlling* ähnelt und übersetzt — steuern, regeln oder lenken — genau der Funktion der Webkomponente entspricht.

Nachfolgend ist die Funktionsweise anhand einiger Beispiele, für die breite Masse auf englischer Sprache, beschrieben. Die Beispiele sind auch auf der zuvor genannten *github-page* zu finden.

### 3.1 Add ctrling.js to a project

Use the convenience of CDN to add `<ctrl-ing>`:

```HTML
<script src="https://cdn.jsdelivr.net/gh/dmitrijLo/ctrl-ing@1.0.0/src/ctrling.min.js"></script>
```

Or, <a target="_blank" rel="noopener noreferrer" href='https://github.com/dmitrijLo/ctrl-ing/releases' download>download the latest ctrling.js version</a> and import it to your web page:

```HTML
<script src="./path/to/ctrling.js"></script>
```

> **Note:** Since `<ctrl-ing>` is a custom html element which is a young web technology. It was found through this work that ctrling.js should be imported after declaration of the object you want to control. This will ensure that `<ctrl-ing>` is displayed properly cross different browser.

### 3.2 Create an object which needs to be controlled

The declaration of an object is up to you. However, there is just one limitation. It must be available in the `window`- or rather the `globalThis`-object. With this in mind use the `var`-keyword or the `globalThis`.

</section>

<section class="new-page">
<h6>Components</h6>

### 3.3 Create a controller

Use the `<ctrl-ing>`-tag directly on your HTML page.

```HTML
<ctrl-ing ref="myObject">
{ "add": [ { "number":{},"path":"frequency" } ] }
</ctrl-ing>
```

### 3.4 Components

Add components by writing into the `innerHtml` of the `ctrl-ing`-element. The `ctrl-ing`-element interprets its `innerHTML` using the [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) format.

Start with:

```HTML
<ctrl-ing ref="targetObject">
{
    "add": [ ]
}
</ctrl-ing>
```

> **Note:** `"add"` defines the array containing all components which are in turn represented as objects.

Until now the component object accepts the following properties:

* `type` or name of component: `number`, `slider`, `dropdown`, `toggle`, `button`, `output`, `color`
> **Note:** Value of type is an object that accepts some optional settings. For now left it empty (`{}`), possible settings will be explained in the examples.
* `path` accepts a string which represents the way to the targeted value
> **e.g.:** Let the targeted object be
> ```JavaScript
> var model = {
>   nodes: [ { id: 'A', x:100, y:50 },
>            { id: 'B', x:0, y:100 },
>            { id: 'C', x:75, y:75 } ]
> }
> ```
> then the path to the y-value of node C is `"nodes/2/y"`. Don't forget since `nodes` is an array its index begins at `0`.

</section>

<section class="new-page">
<h6>Number</h6>

* `on` takes an object whose property matches an event and the value matches a function that will be executed.
> **e.g.:** `"on": { "click": "myFunction" }`<br>
> **Note:** Until now the events `click`, `input` and `change` are implemented. If there is no function to execute `on` can be ommitted.

#### 3.4.1 Number <span id="number">

A simple number element accepts numeric input. Optional settings are `label`, `min`, `max` and `step`. The following example shows a circle that changes its size depending on user input.

```HTML
<ctrl-ing ref="circle">
{
    "add": [
        { "number":{ "label":"Radius","min":1,"max":250,"step":0.5 }, "path":"r" }]
}
</ctrl-ing>
```

<figure style="width:80%">
<img style="width:100%" src="./img/number.png"/>
<h5>Abb. 3: Example of input of type number</h5>
</figure>

#### 3.4.2 Slider <span id="slider">

The slider is suitable for adjustments within a range. The example below shows a spring-mass system. The slider allows to increase the angle of the pendulum and with it to tension the spring.

> **Note:** Optional settings are the same as for number element.

```HTML
<ctrl-ing ref="pendulum">
{
    "add": [
        { "slider":{ "label":"Angle &alpha;","min":10,"max":100,"step":0.5 },
          "path":"x","on":{"input":"myFunc"} }]
}
</ctrl-ing>
```

</section>

<section class="new-page">
<h6>Dropdown</h6>

<figure style="width:100%">
<img style="width:100%" src="./img/Slider.png"/>
<h5>Abb. 4: Example of input of type range</h5>
</figure>

#### 3.4.3 Dropdown <span id="dropdown">

```HTML
<ctrl-ing ref="dropdownExample">
{
    "add": [
        { "dropdown":{ "label":"Geometry Area", "default":"triangle",
          "circle":"circle", "rectangle":"rectangle",
          "pentagon":"pentagon" }, "path":"geometry" } 
    ]
}
</ctrl-ing>
```

#### 3.4.4 Toggle <span id="toggle">

A toggle button or checkbox is an essential and very important element that allows switching between two states. In most cases it is used to toggle between boolean `true` and `false`, which is also the default behavior of `ctrl-ing` when implemented equal to the code listing. But `ctrl-ing` allows also to toggle between strings or numeric values. Use the optional `"switchTo":"<number or string>"` setting for this. `ctrl-ing` will store the value declared in the target object. When the toggle is pressed, the object's value will be changed to the `switchTo` value.

```HTML
<ctrl-ing ref="pendulum2">
{
    "add": [ 
        { "toggle":{ "label":"Run Animation" }, "path":"dirty" } 
    ]
}
</ctrl-ing>
```

</section>

<section class="new-page">
<h6>Button</h6>

<figure>
<img style="width:100%" src="./img/toggle.png"/>
<h5>Abb. 5: Example of toggle</h5>
</figure>

#### 3.4.5 Button <span id="button">

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

<figure>
<img style="width:100%" src="./img/button.png"/>
<h5>Abb. 6: Example of buttons</h5>
</figure>

</section>

<section class="new-page">
<h6>Color</h6>

#### 3.4.6 Output <span id="output">

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

#### 3.4.7 Color <span id="color">

`ctrl-ing` provides an input of type color which is implemented as shown in the code listing. The display is strongly dependent on the browser used. The best appearance was found in chrome-browser.

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

<figure>
<img style="width:100%" src="./img/color.png"/>
<h5>Abb. 7: Example of the color input</h5>
</figure>

</section>

<section class="new-page">
<h6>Federpendel</h6>

## 4 Federpendel

Nachfolgend soll ein komplexeres Beispiel und zwar ein Federpendel, dargestellt in Abbildung 8, mittels der `<ctrl-ing>`-Webkomponente untersucht werden.

<figure>
<img style="width:100%" src="./img/Federpendel.png"/>
<h5>Abb. 8: Federpendel</h5>
</figure>

Lässt man das gespannte Federpendel los, wird es mit hoher Wahrscheinlichkeit in seiner stabilen Gleichgewichtslage zum Stehen kommen. Formal lässt sich die Lage durch den Winkel zwischen der Länge $a$ und der horizontalen Linie im Festlager A0, dem Nullniveau, beschreiben. Wo genau das Pendel zum Stehen kommt, hängt hauptsächlich von der Federrate $c$, dem Gewicht der Masse $m$, der unbelasteten Federlänge $L_0$ und der Pendellänge $a$ ab.

Mit dem Satz

>*&bdquo;Eine mechanische Struktur befindet sich im statischen Gleichgewicht, wenn die Summe aller potentiellen Energien einen Extremwert erreicht.&ldquo;* (vgl. [[10](#10)], S.188)

kann die Gleichgewichtslage analytisch bestimmt werden.

Das Potential einer Linearfeder wird mit

$$E_S = \frac{1}{2}\,c\,s^2$$ (1)

beschrieben. 

</section>

<section class="new-page">
<h6>Federpendel</h6>

Nimmt man das Potential der am Pendel befestigeten Masse hinzu und vernachlässigt gleichzeitig das als infinitisimal angenommene Gewicht des Pendelstabes, resultiert dies in die gesuchte Potentialfunktion

$$U(\varphi) = \frac{1}{2}\,c\,s^2 - m\,g\,a\,\sin\varphi$$ (2)

wobei $s$ als $L - L_0 = a\,\sin\varphi$ beschrieben werden kann und damit auch gilt:

$$U(\varphi) = \frac{1}{2}\,c\,a\,\sin\varphi^2 - m\,g\,a\,\sin\varphi$$ (3)

Die Federrate $c$ wird mit Hilfe der Energieerhaltung $E(\varphi = 0) \stackrel{!}{=} E(\varphi = 30°)$ gewonnen. Mit $\sin 0 = 0$ folgt:

$$0 = \frac{1}{2}\,c\,(a\sin 30°)^2 - m\,g\,a\,\sin 30°$$

$$c = 4\frac{mg}{a}$$ (4)

Gleichung 4 wird zur Vereinfachung der Potentialfunktion in Gleichung 3 verwendet und anschließend abgeleitet. Das Potential $U$ erreicht seinen Extremwert, wenn die erste Ableitung null entspricht. 

$$U'(\varphi) = m\,g\,a\,(4\,\sin\varphi - 1)\,\cos\varphi$$ (5)

Damit gilt $U'(\varphi) \stackrel{!}{=} 0$, wenn $(4\,\sin\varphi - 1)$ oder $(\cos\varphi)$ gleich null ist. Der Zweite Fall tritt für $\varphi = \pm 90°$ ein. Dieser Fall entspricht einer instabilen Gleichgewichtslage und erscheint bei näherer Betrachtung logisch — wenn das Pendel in der Vertikalen verkantet — aber für die weitere Untersuchung uninteressant.

Auflösen von $(4\,\sin\varphi - 1)$ nach $\varphi$ liefert die gesuchte stabile Gleichgewichtslage bei $\varphi = 14,477°$. Um diesen Wert zu überprüfen wurde entsprechend der Abbildung 8 ein Modell erstellt und mit der `ctr-ling`-Webkomponente verbunden. Das Beispiel in seiner dynamischen Form ist unter https://dmitrijlo.github.io/ctrl-ing/ zu finden. 

Der Kippschalter lässt das Federpendel sinnbildlich los und startet die Animation.

</section>

<section class="new-page">
<h6>Federpendel</h6>

<figure>
<img style="width:100%" src="./img/Federpendel2.png"/>
<h5>Abb. 9: Die stabile Gleichgewichtslage eines Federpendels</h5>
</figure>

Das Federpendel bleibt in seiner Gleichgewichts bei $\varphi = 14,48°$ entsprechend der Ausgabe in Abbildung 9 stehen, was zu beweisen war.

Ebenfalls der Abbildung 9 zu entnehmen, sind weitere Elemente, die es erlauben die Masse, die Federrate und den Winkel zu verstellen. Dadurch lassen sich unterschiedliche Konfigurationen ausprobieren. Ein *reset*-Knopf bringt das System in seine Ausgangslage. Auch denkbar wären weitere Elemente, die z.B. die Federlänge oder die Gravitationskraft steuern. Letzteres würde das Verhalten des Pendels auf einem anderen Planeten simulieren.

</section>

<section class="new-page">
<h6>&nbsp;</h6>

## 5 Fazit

Im Zuge dieser Arbeit wurde eine Webkomponente programmiert, die das Erstellen graphischer Oberflächen zur Steuerung von Objekten stark vereinfacht. Dies wird insbesondere durch Kapitel 3 anhand einiger einfacher Beispiele verdeutlicht. Das benutzerdefinierte HTML-Element besteht im wesentlichen aus einer Vielzahl von mehr oder weniger einfachen HTML-Elementen, was durch das Konzept des *shadow*-DOMs im Verborgenen bleibt und die Übersicht und Semantik des regulären DOMs aufrechterhält. Die Funktionalität wird durch JavaScript-Code beschrieben. Die Kapselung der eigenen Funktionalität vermeidet unerwünschte Nebeneffekten und zeichnet diese Webtechnologie aus. Kapitel 4 demonstriert anhand eines Federpendelmodells, dass das `ctrl-ing`-Element zur Untersuchung ebener Mechanismen geeignet ist. Das Element selbst ist wiederverwendbar, lässt sich einfach erweitern und verkützt damit deutlich die Programmierungszeit.

</section>

<section class="new-page">
<h6>&nbsp;</h6>

## 6 Literaturverzeichnis

<span id="1">[1]&emsp;FACHHOCHSCHULE DORTMUND. Modulhandbuch S.210 [Online].<br>&emsp;&emsp;[Zugriff am: 22. März 2021]. Verfügbar unter:<br>&emsp;&emsp;<span style="font-size:9pt">https://www.fh-dortmund.de/de/fb/5/studangeb/_medien/Modulhandbuch_MB_PO14_20190313.pdf</span>

<span id="2">[2]&emsp;SELFHTML. InteraktiveElemente [Online].<br>&emsp;&emsp;[Zugriff am: 22. März 2021]. Verfügbar unter:<br>&emsp;&emsp;<span style="font-size:9pt">https://wiki.selfhtml.org/wiki/HTML/Kategorien_von_Elementen#Interaktive_Elemente</span>

<span id="3">[3]&emsp;DAT.GUI. JavaScript Bibliothek [Online]. [Zugriff am: 22. März 2021].<br>&emsp;&emsp;<span>Verfügbar unter: https://github.com/dataarts/dat.gui</span>

<span id="4">[4]&emsp;TWEAKPANE. JavaScript Bibliothek [Online]. [Zugriff am: 22. März 2021].<br>&emsp;&emsp;<span>Verfügbar unter: https://cocopon.github.io/tweakpane/
</span>

<span id="5">[5]&emsp;SELFHTML. Document Object Model [Online]. [Zugriff am: 22. März 2021].<br>&emsp;&emsp;<span>Verfügbar unter: https://wiki.selfhtml.org/wiki/JavaScript/DOM</span>

<span id="6">[6]&emsp;FRONTEERS. Congres 2011 [Online].<br>&emsp;&emsp;[Zugriff am: 22. März 2021]. Verfügbar unter:<br>&emsp;&emsp;<span style="font-size:9pt">https://fronteers.nl/congres/2011/sessions/web-components-and-model-driven-views-alex-russell</span>

<span id="7">[7]&emsp;MDN WEB DOCS. Webkomponente [Online]. [Zugriff am: 22. März 2021].<br>&emsp;&emsp;<span>Verfügbar unter: https://developer.mozilla.org/de/docs/Web/Web_Components</span>

<span id="8">[8]&emsp;MDN WEB DOCS. Shadow DOM [Online].<br>&emsp;&emsp;[Zugriff am: 22. März 2021]. Verfügbar unter:<br>&emsp;&emsp;<span style="font-size:9pt">https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM</span>

<span id="9">[9]&emsp;MDN WEB DOCS. Custom Elements [Online].<br>&emsp;&emsp;[Zugriff am: 22. März 2021]. Verfügbar unter:<br>&emsp;&emsp;<span style="font-size:9pt">https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements</span>

<span id="10">[10]&emsp;Gössner, S., 2017. Mechanismentechnik: Vektorielle Analyse ebener Mechanismen. Berlin: Logos

</section>
