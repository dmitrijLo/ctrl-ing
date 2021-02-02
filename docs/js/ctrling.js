class ObserverList {
    constructor() {
        this.observerList = [];
    }
    add(obj) { return this.observerList.push(obj); }
    count() { return this.observerList.length; }
    get(index) { if (index > -1 && index < this.observerList.length) return this.observerList[index]; }
    indexOf(obj, startIndex) {
        let i = startIndex;
        while (i < this.observerList.length) {
            if (this.observerList[i] === obj) { return i; }
            i++;
        }
        return -1;
    }
    removeAt(index) { this.observerList.splice(index, 1); }
}

class SuperRef {
    constructor(path, targetObj) {
        this.path = path;
        this.props = path.split('/');
        this.lastProp = this.props.pop();
        this.handler = new Proxy(this.props.reduce((ref, prop) => ref[prop], targetObj), {})
        this.value = this.handler[this.lastProp];
        this.observers = [];
    }
    addObserver(observer) { this.observers.push(observer); }
    //removeObserver(observer) { this.observers.removeAt(this.observers.indexOf(observer, 0)); }
    notifyObservers(/* context, key */) {
        for (let observer of this.observers) {
            observer.update(this);
        }
        /* const observerCount = this.observers.count();
        for (let i=0; i < observerCount; i++) {
            const observer = this.observers.get(i);
            for (let observedValue of observer.observedValues) {
                if(observedValue === key){ observer.update( { value:context, key:key } ); }
            }
        }*/
    }
    updateState(value) {
        if (value !== this.value) {
            this.value = value;
            this.handler[this.lastProp] = this.value;
            this.notifyObservers();
        } else {
            console.log('nothing changed');
        }
    }
}

class CanvasHandler {
    constructor(canvas, handle, range) {
        const resolution = ((range.min && range.max) || range.max != undefined) ? { x: 1 / (range.max / canvas.width), y: 1 / (range.max / canvas.height) } :
            { x: 1 / ((handle.x + canvas.width) / canvas.width), y: 1 / ((handle.y + canvas.height) / canvas.height) };
        this._handle = { x: handle.x * resolution.x, y: handle.y * resolution.y, r: 10 };
        this.isDragging = false;
        this.dragHandle;
        this.canvas = canvas;
        this._resolution = resolution;
    }

    get offset() { return { top: this.canvas.getBoundingClientRect().top, left: this.canvas.getBoundingClientRect().left }; }
    get resolution() { return this._resolution; }
    get handle() { return this._handle; }
    set handle(obj) {
        this._handle.x = obj.x;
        this._handle.y = obj.y
    }
    get newPosition() { return { p1: Math.floor((this.handle.x / this.resolution.x) * 10) / 10, p2: Math.floor((this.handle.y / this.resolution.y) * 10) / 10 }; }

    circlePointCollision(x, y, circle) {
        const dx = circle.x - x,
            dy = circle.y - y,
            distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle.r;
    }

    onMouseDown(e) {
        console.log('Höhe: ', this.canvas.height);
        console.log('Breite: ', this.canvas.width);
        const x = e.clientX - Math.floor(this.offset.left),
            y = this.canvas.height - (e.clientY - Math.floor(this.offset.top));
        let hand = this.handle;

        if (this.circlePointCollision(x, y, hand)) {
            this.handle = { x: x, y: y };
            this.strokeHandle();
            this.isDragging = true;
            this.onMouseMoveBinding = this.onMouseMove.bind(this);
            this.onMouseUpBinding = this.onMouseUp.bind(this);
            e.target.addEventListener("mousemove", this.onMouseMoveBinding);
            e.target.addEventListener("mouseup", this.onMouseUpBinding);
            this.dragHandle = hand;
        }
    }

    onMouseMove(e) {
        if (this.isDragging && this.dragHandle === this.handle) {
            this.handle = {
                x: this.handle.x + (e.movementX || e.mozMovementX || e.webkitMovementX || 0),
                y: this.handle.y - (e.movementY || e.mozMovementY || e.webkitMovementY || 0)
            };
        }
        this.strokeHandle();
    }

    onMouseUp(e) {
        e.target.removeEventListener("mousemove", this.onMouseMoveBinding);
        e.target.removeEventListener("mouseup", this.onMouseUpBinding);
        this.isDragging = false;
    }

    strokeHandle() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.handle.x, this.handle.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.handle.x, this.handle.y, this.handle.r / 2, 0, (Math.PI / 180) * 360, false);
        ctx.fill();
    }
}

class CI_Element {
    constructor(options, id) {
        this.options = {};
        this.label = options.label;
        this.id = id;
        this._children = [];
        Object.assign(this.options, options);
        this._self = document.createElement('div');
        this._self.setAttribute('class', 'ci-element');

        delete this.options.label;
        delete this.options.type;
    }

    get self() { return this._self; }
    get children() { return this._children; }
    set children(child) { this._children.push(...child); }

    createDisplay() {
        const display = document.createElement('input'),
            attributes = [{ el: display, name: ['type', 'class', 'id', 'value'], val: ['number', 'ci-display', this.id, this.options.defaultValue || false] }];
        this.setAttributes(attributes);
        //display.value = value;
        return display;
    }

    createWrapper(className = 'ci-wrapper') {
        const wrapper = document.createElement('div');
        /* const wrapper = document.createElement('fieldset'),
              legend = document.createElement('legend');
              wrapper.appendChild(legend);
        legend.innerHTML = this.label; */
        wrapper.setAttribute('class', className);
        return wrapper;
    }

    createLabel() {
        const label = document.createElement('div');
        label.setAttribute('class', 'ci-label');
        label.innerHTML = this.label;
        return label;
    }

    appendCanvas(p1, p2) {
        function convertRemToPixels(rem) {
            return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
        }
        const displayP1 = this.createDisplay(),
            displayP2 = this.createDisplay(),
            label = this.createLabel(),
            displayWrapper = this.createWrapper('ci-element'),
            wrapper = this.createWrapper(),
            symbol = document.createElement('div'),
            canvas = document.createElement('canvas'),
            defaultStyle = { canvas: 'width:0;height:0', element: 'height:1.25rem', visible: false },
            attributes = [{ el: canvas, name: ['id', 'style', 'width', 'height'], val: [this.id, defaultStyle.canvas, `${convertRemToPixels(12)}px`, `${convertRemToPixels(10)}px`] },
            { el: this.element, name: ['class', 'style'], val: ['ci-canvasHandle', defaultStyle.element] },
            { el: symbol, name: ['class'], val: ['ci-symbol'] },
            { el: displayP1, name: ['value'], val: [p1] },
            { el: displayP2, name: ['value'], val: [p2] }];
        this.setAttributes(attributes);
        canvas.getContext('2d').translate(0, canvas.height);
        canvas.getContext('2d').scale(1, -1);
        symbol.innerHTML = "&#9660;";
        symbol.addEventListener('click', () => {
            if (!defaultStyle.visible) {
                canvas.setAttribute('style', 'width: auto;height: auto;border:1px solid black;');
                this.element.setAttribute('style', 'height:auto')
            } else {
                canvas.setAttribute('style', defaultStyle.canvas);
                this.element.setAttribute('style', defaultStyle.element);
            }
            defaultStyle.visible = !defaultStyle.visible;
        })
        displayP1.update = function (context) {
            this.value = context.value;
        }
        displayP2.update = function (context) {
            this.value = context.value;
        }
        canvas.update = function (context) {
            if (context.key === this.observedValues[0]) {
                this.interactor.handle = { x: context.value * this.interactor.resolution.x, y: this.interactor.handle.y };
                console.log(this.interactor.handle)
            } else if (context.key === this.observedValues[1]) {
                this.interactor.handle = { x: this.interactor.handle.x, y: context.value * this.interactor.resolution.y };
            }
            this.interactor.strokeHandle();
        }

        this.appendElements(wrapper, displayP1, displayP2, symbol);
        this.appendElements(displayWrapper, label, wrapper);
        this.appendElements(this.element, displayWrapper, canvas);
    }

    appendElements(reciever, ...elements) {
        for (let element of elements) {
            reciever.appendChild(element);
        }
    }

    setAttributes(attributes) {
        for (let attribute of attributes) {
            for (let i = 0; i < attribute.name.length; i++) {
                attribute.el.setAttribute(attribute.name[i], attribute.val[i]);
            }
        }
    }
}

class CI_Button extends CI_Element {
    constructor(options, id) {
        super(options, id);
        const button = document.createElement('button'),
            attributes = [{ el: button, name: ['class', 'id', 'type'], val: ['ci-button', this.id, 'button'] }];
        button.innerHTML = this.label;
        button.update = function () { };
        this.setAttributes(attributes);
        this.self.appendChild(button);
        this.children = [button];
    }
}

class CI_ColorPicker extends CI_Element {
    constructor(options, id) {
        super(options, id);
        const input = this.createDisplay(),
            display = this.createDisplay(),
            label = this.createLabel(),
            attributes = [{ el: input, name: ['type', 'class', 'value'], val: ['text', 'ci-color-input', this.options.color] },
            { el: display, name: ['type', 'class', 'style', 'value', 'readonly'], val: ['', 'ci-color-display', `background-color:${this.options.color}`, "", true] }];
        input.update = function (context) {
            this.value = context.value;
        }
        display.update = function (context) {
            this.setAttribute('style', `background-color:${context.value}`);
        }

        this.setAttributes(attributes);
        this.appendElements(this.self, label, display, input);
        this.children = [display, input];
    }
}

class CI_StandardInput extends CI_Element {
    constructor(options, id) {
        super(options, id);
        const input = this.createDisplay(),
            label = this.createLabel(),
            attributes = [{ el: input, name: ['type', 'class'], val: ['number', 'ci-input'] }];
        input.update = function (context) {
            this.value = context.value;
        }
        this.setAttributes(attributes);
        this.appendElements(this.self, label, input);
        this.children = [input];
    }
}

class CI_Slider extends CI_Element {
    constructor(options, id) {
        super(options, id);
        const slider = document.createElement('input'),
            display = this.createDisplay(),
            label = this.createLabel(),
            attributes = [{ el: slider, name: ['class', 'id', 'type', 'min', 'max', 'step', 'value'], val: ['ci-slider', this.id, 'range', this.options.min || 0, this.options.max || 100, this.options.step || 1, this.options.defaultValue || this.options.value] },
            { el: display, name: ['min', 'max', 'step'], val: [this.options.min || 0, this.options.max || 100, this.options.step || 1] }];
        slider.update = function (context) {
            this.value = context.value;
        }
        display.update = function (context) {
            this.value = context.value;
        }
        this.setAttributes(attributes);
        this.appendElements(this.self, label, display, slider);
        this.children = [display, slider];
    }
}

class CI_Toggle extends CI_Element {
    constructor(options, id) {
        super(options, id);
        const display = this.createDisplay(),
            label = this.createLabel(),
            slider = document.createElement('span'),
            input = document.createElement('input'),
            toggle = document.createElement('div'),
            attributes = [{ el: slider, name: ['class'], val: ["toggle-slider"] },
            { el: input, name: ['type'], val: ['checkbox'] },
            { el: display, name: ['type', 'readonly'], val: ['', true] },
            { el: toggle, name: ['class', 'id'], val: ['ci-toggle', this.id] }];
        toggle.default = this.options.defaultValue || false;
        toggle.switchTo = this.options.switchTo || true;
        toggle.value = toggle.switchTo;
        toggle.update = function (context) {
            if (context.value === this.default) {
                this.value = this.switchTo;
            } else {
                this.value = this.default;
            }
            display.value = context.value;
            this.checked = context.value;
        }
        display.update = function () {
            //render()
        }
        this.setAttributes(attributes);
        this.appendElements(toggle, input, slider);
        this.appendElements(this.self, label, display, toggle);
        this.children = [display, toggle];
    }
}

class CI_Dropdown extends CI_Element {
    constructor(options, id) {
        super(options, id);
        const dropdown = document.createElement('select'),
            wrapper = this.createWrapper('ci-dropdown-wrapper'),
            display = this.createDisplay(),
            label = this.createLabel(),
            attributes = [{ el: dropdown, name: ['class', 'id'], val: ['ci-dropdown', this.id] },
            { el: display, name: ['type', 'readonly'], val: ["", true] }],
            items = Reflect.ownKeys(this.options);
        for (let item of items) {
            if (item === 'default') { continue; }
            const option = document.createElement('option');
            option.innerHTML = item;
            option.value = this.options[item];
            if (item === 'defaultValue') {
                option.selected = true;
                option.innerHTML = this.options['default'] || 'default';
                display.value = this.options[item];
            }
            dropdown.appendChild(option);
        }

        dropdown.update = function (context) {
            for (let child of this.children) {
                if (context.value === +child.value) {
                    child.selected = true;
                }
            }
        }
        display.update = function (context) {
            this.value = context.value;
        }
        this.setAttributes(attributes);
        this.appendElements(wrapper, dropdown);
        this.appendElements(this.self, label, display, wrapper);
        this.children = [display, dropdown];
    }
}

class CI_Output extends CI_Element {
    constructor(options, id) {
        super(options, id);
        const content = this.createLabel(),
            label = this.createLabel(),
            unit = this.createLabel(),
            attributes = [{ el: content, name: ['class'], val: ['ci-output'] },
            { el: label, name: ['class'], val: ['ci-output-label'] },
            { el: unit, name: ['class'], val: ['ci-unit'] }];
        unit.innerHTML = this.options.unit;
        content.innerHTML = "";
        this.self.update = function (context) {
            content.innerHTML = context.value;
        }
        console.log(this.options)
        this.setAttributes(attributes);
        this.appendElements(this.self, label, content, unit);
        this.children = [content];
    }
}

class CI extends HTMLElement {
    static get observedAttributes() {
        return ['dirty'];
    }
    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this._inputs = [];
        this._outputs = [];
        this._objectives = [];
        //this._targetObj;
        //this._header = '';
    }

    get root() { return this._root; }
    get targetObj() { return window[this.getAttribute('ref')]; }
    set targetObj(q) { if (q) this.setAttribute('ref', q); }
    get header() { return this.getAttribute('header'); }
    set header(q) { if (q) this.setAttribute('header', q); }
    get id() { return this.getAttribute('id') || "ci"; }
    set id(q) { if (q) this.setAttribute('id', q); }
    get inputs() { return this._inputs; }
    set inputs(o) { return this._inputs.push(o); }
    get outputs() { return this._outputs; }
    set outputs(o) { return this._outputs.push(o); }
    get objectives() { return this._objectives; }
    set objectives(o) { return this._objectives.push(o); }
    get xOffset() { return this.getAttribute('xOffset') || 0; }
    get yOffset() { return this.getAttribute('yOffset') || 0; }
    get dirty() { return this.getAttribute('dirty'); }
    set dirty(bool) { return this.setAttribute('dirty', bool); }

    connectedCallback() {
        if (this.getAttribute('id') == undefined) this.id = this.id;
        this.parseJSON();
        this.init();
        this.offset = this.root.querySelector('.ci').getBoundingClientRect();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.dirty === "true") {
            console.log('Custom square element attributes changed.');
            this.dirty = false;
        }
    }

    init() {
        const gui = this.createGui(),
            style = document.createElement('style'),
            events = ['click', 'change', 'input'];
        style.textContent = CI.template(this.setPosition());

        // create & append CI_Elements dependend on userinput
        for (let input of this.inputs) {
            const options = input.options, id = input.id,
                element = (input.options.type === 'input') ? new CI_StandardInput(options, id) :
                    (input.options.type === 'slider') ? new CI_Slider(options, id) :
                        (input.options.type === 'dropdown') ? new CI_Dropdown(options, id) :
                            (input.options.type === 'toggle') ? new CI_Toggle(options, id) :
                                //(input.options.type === 'canvasHandle') ? element.appendCanvas(input.options.defaultValue,input.reference.options.defaultValue) : 
                                (input.options.type === 'button') ? new CI_Button(input.options, input.id) :
                                    (input.options.type === 'color') ? new CI_ColorPicker(input.options, input.id) : console.log('wrong type');
            // set subjects that will notify their observer
            const objective = (input.path !== undefined) ? new SuperRef(input.path, this.targetObj) : new SuperRef('value', element);
            this.objectives = objective;
            let event = (input.hasOwnProperty('event')) ? Object.values(input).find(key => events.includes(key)) : 'change';
            let callback = (event != undefined) ? window[input.func] : undefined;

            for (let observer of element.children) {
                observer.addEventListener(event, () => {
                    const value = (typeof observer.value === 'boolean' || 'string') ? observer.value : +observer.value;
                    objective.updateState(value);
                    if (callback != undefined) return callback();
                });
                objective.addObserver(observer);
            }
            gui.querySelector('.ci-cb').appendChild(element.self);
        }
        this._root.appendChild(gui);
        this._root.appendChild(style);

        for (let output of this.outputs) {
            for (let o of output) {
                const element = new CI_Output({ label: o.label, unit: o.unit }, 'id');
                gui.appendChild(element.self);
                for (let objective of this.objectives) {
                    if (o.path === objective.path) {
                        objective.addObserver(element.self);
                    }
                }
            }

        }
    }

    createGui() {
        const gui = document.createElement('div');
        gui.setAttribute('class', 'ci');
        const folder = document.createElement('div');
        folder.setAttribute('class', 'ci-container');
        const header = document.createElement('div');
        header.innerHTML = this.header;
        header.setAttribute('class', 'ci-header');
        const contenBox = document.createElement('div');
        contenBox.setAttribute('class', 'ci-cb');

        gui.appendChild(folder);
        folder.appendChild(header);
        folder.appendChild(contenBox);
        return gui;
    }

    setPosition() {
        const ci = document.getElementById(this.id);
        let ciTop = ci.getBoundingClientRect().top;
        const offset = window.pageYOffset;
        let previousElementTop;

        (function getPreviousElementPosition(elem) {
            const previousElement = elem.previousElementSibling;

            if (!(previousElement.getBoundingClientRect().height === 0)) {
                return previousElementTop = previousElement.getBoundingClientRect().top;
            }
            getPreviousElementPosition(previousElement);
        })(ci);
        previousElementTop += offset;
        ciTop += offset;
        return { x: +this.xOffset, y: (previousElementTop - ciTop + +this.yOffset) };
    }

    getValue(path) {
        if (path !== undefined) {
            const paths = path.split('/'),
                last = paths.pop();
            return paths.reduce((ref, prop) => ref[prop], this.targetObj)[last];
        }
    }

    setValue(path, newValue) {
        if (path !== undefined) {
            const paths = path.split('/'),
                last = paths.pop();
            if (newValue !== true && newValue !== false) { newValue = +newValue; }
            paths.reduce((ref, prop) => ref[prop], this.targetObj)[last] = newValue;
        }
    }

    getID(path) {
        if (path !== undefined) {
            const keys = path.split('/');
            return keys.join('-');
        }
    }

    parseJSON() {
        try {
            const types = ['input', 'slider', 'dropdown', 'toggle', 'canvasHandle', 'button', 'color'];
            const innerHTML = JSON.parse(this.innerHTML);

            for (let elem of innerHTML.add) {
                const type = Object.keys(elem).find(key => types.includes(key));
                /* if(elem.hasOwnProperty('paths')){
                    for (let path of elem.paths){
                        const newObject = Object.assign( { path: path }, elem),
                              props = [...newObject.paths[0].split('/'),...newObject.paths[1].split('/')],
                              id = props.reduce((acc,next) => {
                                  if(acc.split('-').includes(next)) {return acc; }
                                  if(props.lastIndexOf(next) === props.length - 1) { return acc + next; }
                                return acc + next + '-';
                              }, "");
                        if(!newObject.hasOwnProperty('id')) newObject.id = id;
                        delete newObject.paths;
                        innerHTML.add.push(newObject);
                    }
                    continue;
                } */
                //if(elem.hasOwnProperty('path')){
                const props = (elem.hasOwnProperty('path')) ? elem.path.split('/') : elem.path = undefined/* undefined */,
                    prop = (props !== undefined) ? props.pop() : undefined,
                    defaultValue = (props !== undefined) ? this.getValue(elem.path) : undefined,
                    event = (elem.hasOwnProperty('on')) ? Reflect.ownKeys(elem.on).shift() : elem.on = undefined;
                console.log('elem: ', elem, props)
                Object.defineProperty(elem, 'options', { value: { type: type, label: prop || type, defaultValue: defaultValue }, writable: true, enumerable: true, configurable: true });
                if (elem.on !== undefined) {
                    Object.defineProperty(elem, 'event', { value: event, writable: true, enumerable: true, configurable: true });
                    Object.defineProperty(elem, 'func', { value: elem.on[event], writable: true, enumerable: true, configurable: true });
                }
                // check if there are additional options (eg. min,max,step,label, etc.)
                if (Object.entries(elem[type]) != 0) Object.assign(elem.options, elem[type]);
                // check if there is a custom id
                if (!elem.hasOwnProperty('id') && elem.hasOwnProperty('path')) elem.id = this.getID(elem.path);
                // save the default value (value at initiation)
                //if(elem.hasOwnProperty('path')) elem.options.default = this.getValue(elem.path);
                if (type === 'button') elem.id = `${elem.options.label.toLowerCase()}-button`;
                if (type === 'color') elem.id = `${elem.options.label.toLowerCase()}-color`;
                delete elem.on;
                delete elem[type];
                this.inputs = elem;

                /* let dirty = false;
                for (let input of this.inputs){
                    if(input.id === elem.id){
                        dirty = true;
                        input.reference = elem;
                    }
                }
                if(!dirty) {  } */
                //} 
            };

            for (let elem of innerHTML.output) {
                this.outputs = elem.show;
            }
            console.log(this.outputs)
            return true;
        }
        catch (e) { console.log(e)/* this._root.innerHTML = e.message; */ }
        return false;
    }

    static template(position) {
        document.documentElement.style.setProperty('--ci-base-background-color', '#fffff8');
        document.documentElement.style.setProperty('--ci-base-shadow-color', '#10162f');

        return `
            /* .ci:hover {
                -webkit-transform: translate(-0.25rem, -0.25rem);
                -moz-transform: translate(-0.25rem, -0.25rem);
                -ms-transform: translate(-0.25rem, -0.25rem);
                transform: translate(-0.25rem, -0.25rem);
            } */

            *, ::after, ::before {
                box-sizing: inherit;
                margin:0;
            }

            .ci {
                display: block;
                margin-bottom: 0.5em;
                color: #1a1a1a;
                font-family: inherit;
                font-size: 0.75em;
                position: relative;
                top: ${position.y}px;
                right: ${position.x}px;
                float: right;
                background-color: var(--ci-base-background-color);
                box-sizing: border-box;
                border: 1px solid black;
                /*border-radius: 0px 25px 0px 25px;*/
                /*box-shadow: 10px 5px 1.5px black;*/
                /*overflow: hidden;*/
                -webkit-transition: 200ms -webkit-transform;
                transition: 200ms transform;
            }

           /*  *, ::after, ::before {
                box-sizing: inherit;
            }

            .ci::before {
                z-index: -1;
            }

            .ci::after,.ci::before {
                content: '';
                position: absolute;
                background-color: inherit;
                border-width: inherit;
                border-color: inherit;
                border-radius: inherit;
                border-style: inherit;
                top: -1px;
                left: -1px;
                width: calc(100% + 2px);
                height: calc(100% + 2px);
            }

            .ci:hover::after {
                -webkit-transform: translate(0.5rem,0.5rem);
                -moz-transform: translate(0.5rem,0.5rem);
                -ms-transform: translate(0.5rem,0.5rem);
                transform: translate(0.5rem,0.5rem);
            }

            .ci::after {
                z-index: -2;
                background-color: var(--ci-base-shadow-color);
                -webkit-transition: inherit;
                transition: inherit;
            } */

            .ci-button {
                grid-column-start: 2;
                grid-column-end: span 4;
                background: #3839ab linear-gradient(hsla(0, 0, 100%, .2), transparent);
                background-color: #C8D6C7;
                border: 1px solid rgba(0, 0, 0, .5);
                border-radius: 3px;
                /* box-shadow: 0 .2em .4em rgba(0, 0, 0, .5);  */
                color: black;
                /* text-shadow: 0 -.05em .05em rgba(0, 0, 0, .5); */
                /* margin-left: 0.25em; */
                transition: all 0.25s ease;
            }

            .ci-button:hover:active {
                //letter-spacing: 2px;
                letter-spacing: 2px ;
                background-color: #C8D6C7;
                /* box-shadow: 0 .2em .4em rgba(0, 0, 0, 0);  */
            }

            .ci-button:hover {
                background-color: #98ab97;
                /* box-shadow: 0 .2em .4em rgba(0, 0, 0, 0);  */
            }

            .ci-container {
                max-width: 12.5rem;
            }

            .ci-header {
                color: #E2DDDB;
                background-color: #58595B;
                padding-left: 0.25em;
            }

            .ci-cb {
                border-top: 1px solid black;
                padding-top: 0.5em;
                /* word-wrap: anywhere; */
            }

            .ci-element {
                display: grid;
                grid-template-columns: repeat(5, 20%);
                padding-bottom: 0.25rem;
                padding-right: 0.25em;
            }
            .ci-label {
                grid-column: 1;
                margin: 0 .25em;
            }
            .ci-display {
                grid-column: 2 / 4;
                margin-right: .25em;
            }
            .ci-color-display {
                grid-column: 2 / 3;
                margin-right: .25em;
            }
            .ci-dropdown-wrapper,.ci-slider {
                grid-column: 4 / 6;
            }
            .ci-input {
                grid-column: 2 / 6;
            }
            .ci-color-input {
                grid-column: 3 / 6;
            }
            .ci-output-label {
                grid-column: 1 / 3;
                margin: 0 .25em;
            }
            .ci-output {
                grid-column: 3 / 5;
            }
            .ci-unit {
                grid-column: 5;
            }
            .ci-canvasHandle {
                margin-bottom: 0.25em;
            }

            .ci-canvasHandle > canvas {
                width: 100%;
                height: 7.5rem;
                cursor: crosshair;
                margin: 0 0.25em;
            }

            .ci-label, .ci-symbol, .ci-button {
                height: 1.25rem;
            }

            .ci-input, .ci-display, .ci-color-input, .ci-color-display {
                height: 1.25rem;
                padding: 0.25em 0;
                background-color: #C8D6C7;
                text-align: center;
                border: 1px solid #C8D6C7;
                border-radius: 3px;
            }

            .ci-symbol {
                font-size: 0.75em;
                width: 100%;
                background-color: #C8D6C7;
                text-align: center;
                border: 1px solid #C8D6C7;
                border-radius: 3px;
            }

            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            input[type="number"] {
                -moz-appearance: textfield;
            }

        /* begin dropdown styling */
            .ci-dropdown {
                -webkit-appearance: none;
                appearance: none;
                width:100%;
                height: 1.25rem;
                margin:auto;
                background-color: #C8D6C7;
                border: 1px solid #C8D6C7;
                border-radius: 3px;
            }
            .ci-dropdown-wrapper {
                position: relative;
            }
            .ci-dropdown-wrapper::after {
                content: "▾";
                font-weight:bold;
                font-size: 1.25rem;
                top: -3.5px;
                right: 5px;
                position: absolute;
            }
        /* end dropdown styling */

        /* begin toggle styling */
            .ci-toggle {
                width:2.5rem;
                height:100%;
                position: relative;
                left: 1.25rem;
                display: inline-block;
            }
            .ci-toggle input {
                width:2.5rem;
                height:100%;
                margin: 0 0 0 0;
                padding:0 0;
                position:absolute;
                top:0;
                right: 0;
                bottom:0;
                left: 0;
                z-index:2;
                cursor:pointer;
                opacity:0;
            }
            .ci-toggle .toggle-slider { /* Grundfläche */
                position: absolute;
                cursor: pointer;
                top: 0; 
                left: 0;
                width: 2.5rem;
                height: 1.25rem;
                background-color: #c32e04; 
                border-radius: 1em; 
                transition: all .3s ease-in-out;
            }
            .ci-toggle  .toggle-slider::before {  /* verschiebbarer Button */
                position: absolute;
                content: "";
                height: 1em;
                width: 1em;
                left: .2em;
                top: .2em;
                background-color: white;
                border-radius: 50%;
                transition: all .3s ease-in-out;
            }
            .ci-toggle input:checked + .toggle-slider {
                background-color: #5a9900;
                /* green */
            }
        
            .ci-toggle input:checked + .toggle-slider:before {
                -webkit-transform: translateX(1.4em);
                /* Android 4 */
                -ms-transform: translateX(1.4em);
                /* IE9 */
                transform: translateX(1.4em);
            }
            /* end toggle styling */
      `;
    }
}

customElements.define('ctrl-ing', CI);


/* function displayTime() {
    let date = new Date();
    let time = date.toLocaleTimeString();
    document.getElementById('demo').textContent = time;
 }

 const createClock = setInterval(displayTime, 1000); */