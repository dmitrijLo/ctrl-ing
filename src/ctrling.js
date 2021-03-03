var a;
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
    }
    updateState(value) {
        if (value !== this.value) {
            this.value = value;
            this.handler[this.lastProp] = this.value;
            this.notifyObservers();
        }
    }
    reviewState(){
        if(this.handler[this.lastProp] !== this.value) {
            this.value = this.handler[this.lastProp];
            this.notifyObservers();
        }
    }
}

class CtrlElement {
    constructor(options, id) {
        this.options = {};
        this.label = options.label;
        this.id = id;
        this._children = [];
        Object.assign(this.options, options);
        this._self = document.createElement('div');
        this._self.setAttribute('class', 'ctrl-element');

        delete this.options.label;
        delete this.options.type;
    }

    get self() { return this._self; }
    get children() { return this._children; }
    set children(child) { this._children.push(...child); }

    createDisplay() {
        const display = document.createElement('input'),
            attributes = [{ el: display, name: ['type', 'class', 'id', 'value'], val: ['number', 'ctrl-display', this.id, this.options.defaultValue || false] }];
        this.setAttributes(attributes);
        //display.value = value;
        return display;
    }

    createWrapper(className = 'ctrl-wrapper') {
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
        label.setAttribute('class', 'ctrl-label');
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
            displayWrapper = this.createWrapper('ctrl-element'),
            wrapper = this.createWrapper(),
            symbol = document.createElement('div'),
            canvas = document.createElement('canvas'),
            defaultStyle = { canvas: 'width:0;height:0', element: 'height:1.25rem', visible: false },
            attributes = [{ el: canvas, name: ['id', 'style', 'width', 'height'], val: [this.id, defaultStyle.canvas, `${convertRemToPixels(12)}px`, `${convertRemToPixels(10)}px`] },
            { el: this.element, name: ['class', 'style'], val: ['ctrl-canvasHandle', defaultStyle.element] },
            { el: symbol, name: ['class'], val: ['ctrl-symbol'] },
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
    static round(val,acc){
        if(typeof val === 'number') {
            return Math.round(val * 10 ** acc)/(10 ** acc);
        }else if(typeof val === 'object'){
            let str = JSON.stringify(val);
            let members = str.split(',').map( m => m.split(':'));
            for (let member in members){
                for(let value in members[member]){
                    if(!isNaN(+members[member][value])) {
                        const roundedValue = CtrlElement.round(+members[member][value],acc);
                        members[member][value] = roundedValue;
                    }
                }
            }
            str = members.map(m => m.join(':')).join(',');
            const props = str.split('').map(s => {
                const value = (s === '{') ? '{&nbsp;' :
                              (s === '}') ? '<br>}' :
                              (s === ':') ? ':&nbsp;' :
                              (s === '\"') ? '' :
                              (s === ',') ? ',<br>&nbsp;&nbsp;&nbsp;' : s;
                return value;
            });
            str = "".concat(...props);
            return `${str}`
        }
    }
}

class CtrlButton extends CtrlElement {
    constructor(options, id) {
        super(options, id);
        const button = document.createElement('button'),
            attributes = [{ el: button, name: ['class', 'id', 'type'], val: ['ctrl-button', this.id, 'button'] }];
        button.innerHTML = this.label;
        button.update = function () { };
        this.setAttributes(attributes);
        this.self.appendChild(button);
        this.children = [button];
    }
}

class CtrlColorInput extends CtrlElement {
    constructor(options, id) {
        super(options, id);
        const input = this.createDisplay(),
            display = this.createDisplay(),
            picker = this.createDisplay(),
            label = this.createLabel(),
            attributes = [{ el: input, name: ['type', 'class', 'value'], val: ['text', 'ctrl-color-input', this.options.color] },
                          { el: picker, name: ['type', 'class', 'style', 'value'], val: ['color', 'ctrl-color-picker', `opacity:0`, `${options.color}`] },
                          { el: display, name: ['class','style','readonly'], val: ['ctrl-color-display',`background-color:${options.color};`,true] }];
        input.update = function (context) {
            this.value = context.value;
        }
        picker.update = function (context) {
            display.setAttribute('style', `background-color:${context.value}`);
        }

        this.setAttributes(attributes);
        this.appendElements(this.self, label, display, picker, input);
        this.children = [picker, input];
        //picker.autofocus = true;
        a = picker;
    }
}

class CtrlNumberInput extends CtrlElement {
    constructor(options, id) {
        super(options, id);
        const input = this.createDisplay(),
            label = this.createLabel(),
            attributes = [{ el: input, name: ['type', 'class','min','max','step'], val: ['number', 'ctrl-input',this.options.min || Infinity, this.options.max || Infinity, this.options.step || 1] }];
        input.update = function (context) {
            this.value = context.value;
        }
        this.setAttributes(attributes);
        this.appendElements(this.self, label, input);
        this.children = [input];
    }
}

class CtrlSlider extends CtrlElement {
    constructor(options, id) {
        super(options, id);
        const slider = document.createElement('input'),
            display = this.createDisplay(),
            label = this.createLabel(),
            attributes = [
                { el: slider, name: ['class', 'id', 'type', 'min', 'max', 'step', 'value'], val: ['ctrl-slider', this.id, 'range', this.options.min || 0, this.options.max || 100, this.options.step || 1, this.options.defaultValue || this.options.value] },
                { el: display, name: ['min', 'max', 'step'], val: [this.options.min || 0, this.options.max || 100, this.options.step || 1] }
            ];
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

class CtrlToggle extends CtrlElement {
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
            { el: toggle, name: ['class', 'id'], val: ['ctrl-toggle', this.id] }];
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

class CtrlDropdown extends CtrlElement {
    constructor(options, id) {
        super(options, id);
        const dropdown = document.createElement('select'),
            wrapper = this.createWrapper('ctrl-dropdown-wrapper'),
            display = this.createDisplay(),
            label = this.createLabel(),
            attributes = [{ el: dropdown, name: ['class', 'id'], val: ['ctrl-dropdown', this.id] },
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

class CtrlOutput extends CtrlElement {
    constructor(options, id) {
        super(options, id);
        const output = document.createElement('table'),
        tr = document.createElement('tr'),
        label = document.createElement('td'),
        data = document.createElement('td'),
        attributes = [{ el: output, name: ['class'], val: ['ctrl-output'] },
                      { el: label, name: ['class'], val: ['ctrl-output-label'] },
                      { el: data, name: ['class'], val: ['ctrl-output-data'] }];

        const accuracy = this.options.accuracy || 0;
        label.innerHTML = `${this.label} ${this.options.unit ? '[' + this.options.unit + ']' : ''}`;
        data.innerHTML = CtrlElement.round(this.options.defaultValue, accuracy);
        data.update = function (context) {
            data.innerHTML = CtrlElement.round(context.value, accuracy);
        }
        this.setAttributes(attributes);
        this.appendElements(tr, label, data);
        this.appendElements(output, tr);
        this.appendElements(this.self,output);
        this.children = [data];
    }
}

class Ctrl extends HTMLElement {
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
    get header() { return this.getAttribute('header') || 'ctrl-ing'; }
    set header(q) { if (q) this.setAttribute('header', q); }
    get id() { return this.getAttribute('id') || "ctrl"; }
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
        this.offset = this.root.querySelector('.ctrl').getBoundingClientRect();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.dirty === "true") {
            for(let objective of this.objectives){
                objective.reviewState();
            }
            this.dirty = false;
        }
    }

    init() {
        const gui = this.createGui(),
            style = document.createElement('style'),
            events = ['click', 'change', 'input'];
        style.textContent = Ctrl.template(this.setPosition());

        // create & append CtrlElements dependend on userinput
        for (let input of this.inputs) {
            const options = input.options, id = input.id;
            const element = (input.options.type === 'input') ? new CtrlNumberInput(options, id) :
                            (input.options.type === 'slider') ? new CtrlSlider(options, id) :
                            (input.options.type === 'dropdown') ? new CtrlDropdown(options, id) :
                            (input.options.type === 'toggle') ? new CtrlToggle(options, id) :
                            (input.options.type === 'button') ? new CtrlButton(options, id) :
                            (input.options.type === 'color') ? new CtrlColorInput(options, id) : 
                            (input.options.type === 'output') ? new CtrlOutput(options, id) : console.log('wrong type');
            // set subjects that will notify their observer
            const objective = (input.path !== undefined) ? new SuperRef(input.path, this.targetObj) : new SuperRef('value', element);
            this.objectives = objective;
            let event = (input.hasOwnProperty('event')) ? Object.values(input).find(key => events.includes(key)) : 'input';
            let callback = (event != undefined) ? this.targetObj[input.func] || window[input.func] : undefined;

            for (let observer of element.children) {
                objective.addObserver(observer);
                if(input.options.type === 'output') continue;
                observer.addEventListener(event, () => {
                    const value = (typeof observer.value === 'boolean' || 'string') ? observer.value : +observer.value;
                    objective.updateState(value);
                    if (callback != undefined) return callback();
                });
            }
            gui.querySelector('.ctrl-cb').appendChild(element.self);
        }
        this._root.appendChild(gui);
        this._root.appendChild(style);
    }

    createGui() {
        const gui = document.createElement('div');
        gui.setAttribute('class', 'ctrl');
        const folder = document.createElement('div');
        folder.setAttribute('class', 'ctrl-container');
        const header = document.createElement('div');
        header.innerHTML = this.header;
        header.setAttribute('class', 'ctrl-header');
        const contenBox = document.createElement('div');
        contenBox.setAttribute('class', 'ctrl-cb');

        gui.appendChild(folder);
        folder.appendChild(header);
        folder.appendChild(contenBox);
        return gui;
    }

    setPosition() {
        const ctrl = document.getElementById(this.id);
        let ctrlTop = ctrl.getBoundingClientRect().top;
        const offset = window.pageYOffset;
        let previousElementTop;

        (function getPreviousElementPosition(elem) {
            const previousElement = elem.previousElementSibling;

            if (!(previousElement.getBoundingClientRect().height === 0)) {
                return previousElementTop = previousElement.getBoundingClientRect().top;
            }
            getPreviousElementPosition(previousElement);
        })(ctrl);
        previousElementTop += offset;
        ctrlTop += offset;
        return { x: +this.xOffset, y: (previousElementTop - ctrlTop + +this.yOffset) };
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
            const types = ['input', 'slider', 'dropdown', 'toggle', 'canvasHandle', 'button', 'color', 'output'];
            const innerHTML = JSON.parse(this.innerHTML);

            for (let elem of innerHTML.add) {
                const type = Object.keys(elem).find(key => types.includes(key));
                const props = (elem.hasOwnProperty('path')) ? elem.path.split('/') : elem.path = undefined,
                      prop = (props !== undefined) ? props.pop() : undefined,
                      defaultValue = (props !== undefined) ? this.getValue(elem.path) : undefined,
                      event = (elem.hasOwnProperty('on')) ? Reflect.ownKeys(elem.on).shift() : elem.on = undefined;
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

            };

            return true;
        }
        catch (e) { console.log(e)/* this._root.innerHTML = e.message; */ }
        return false;
    }

    update() {
        this.dirty = true;
    }

    static template(position) {
        document.documentElement.style.setProperty('--ctrl-base-background-color', '#fffff8');
        document.documentElement.style.setProperty('--ctrl-base-shadow-color', '#10162f');

        return `
            /* .ctrl:hover {
                -webkit-transform: translate(-0.25rem, -0.25rem);
                -moz-transform: translate(-0.25rem, -0.25rem);
                -ms-transform: translate(-0.25rem, -0.25rem);
                transform: translate(-0.25rem, -0.25rem);
            } */

            *, ::after, ::before {
                box-sizing: inherit;
                margin:0;
            }

            .ctrl {
                display: block;
                margin-bottom: 0.5em;
                color: #1a1a1a;
                font-family: inherit;
                font-size: 0.75em;
                position: relative;
                top: ${position.y}px;
                right: ${position.x}px;
                float: right;
                background-color: var(--ctrl-base-background-color);
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

            .ctrl::before {
                z-index: -1;
            }

            .ctrl::after,.ctrl::before {
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

            .ctrl:hover::after {
                -webkit-transform: translate(0.5rem,0.5rem);
                -moz-transform: translate(0.5rem,0.5rem);
                -ms-transform: translate(0.5rem,0.5rem);
                transform: translate(0.5rem,0.5rem);
            }

            .ctrl::after {
                z-index: -2;
                background-color: var(--ctrl-base-shadow-color);
                -webkit-transition: inherit;
                transition: inherit;
            } */

            .ctrl-button {
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

            .ctrl-button:hover:active {
                //letter-spacing: 2px;
                letter-spacing: 2px ;
                background-color: #C8D6C7;
                /* box-shadow: 0 .2em .4em rgba(0, 0, 0, 0);  */
            }

            .ctrl-button:hover {
                background-color: #98ab97;
                /* box-shadow: 0 .2em .4em rgba(0, 0, 0, 0);  */
            }

            .ctrl-container {
                width: 12.5rem;
            }

            .ctrl-header {
                color: #E2DDDB;
                background-color: #58595B;
                padding-left: 0.25em;
            }

            .ctrl-cb {
                border-top: 1px solid black;
                padding-top: 0.5em;
                /* word-wrap: anywhere; */
            }

            .ctrl-element {
                display: grid;
                grid-template-columns: repeat(5, 20%);
                padding-bottom: 0.25rem;
                padding-right: 0.25em;
            }
            .ctrl-label {
                grid-column: 1;
                margin: 0 .25em;
            }
            .ctrl-display {
                grid-column: 2 / 4;
                margin-right: .25em;
            }
            .ctrl-color-display {
                grid-column: 2 / 3;
                margin-right: .25em;
            }
            .ctrl-dropdown-wrapper,.ctrl-slider {
                grid-column: 4 / 6;
            }
            .ctrl-input {
                grid-column: 2 / 6;
            }
            .ctrl-color-input {
                grid-column: 3 / 6;
            }
            .ctrl-output {
                grid-column: 1 / 6;
                display: flex;
                font-size: 0.75rem;
                word-wrap: anywhere;
                overflow: scroll;
                white-space: pre-wrap;
                /* padding: 0.25em 0; */
                margin-left: .25em;
                background-color: #C8D6C7;
                border: 1px solid rgba(0, 0, 0, .51);
                border-radius: 3px;
                max-height: 3rem;
            }
            .ctrl-output-label {
                width: 50%;
                padding-right: 0.5rem;
                padding-left: 0.25em;
                border-right: 2px solid rgba(0, 0, 0, .5);
                vertical-align: top;

            } 
            .ctrl-output-data{
                width: 10rem; 
                padding-left: 0.5rem;
            }

            .ctrl-label, .ctrl-symbol, .ctrl-button {
                height: 1.25rem;
            }
            .ctrl-color-picker{
                position:absolute;
                margin-left: 20%;
                width: 20%;

            }
            .ctrl-input, .ctrl-display, .ctrl-color-input, .ctrl-color-display {
                height: 1.25rem;
                padding: 0.25em 0;
                background-color: #C8D6C7;
                text-align: center;
                border: 1px solid #C8D6C7;
                border-radius: 3px;
            }

            .ctrl-symbol {
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
            .ctrl-dropdown {
                -webkit-appearance: none;
                appearance: none;
                width:100%;
                height: 1.25rem;
                margin:auto;
                background-color: #C8D6C7;
                border: 1px solid #C8D6C7;
                border-radius: 3px;
            }
            .ctrl-dropdown-wrapper {
                position: relative;
            }
            .ctrl-dropdown-wrapper::after {
                content: "▾";
                font-weight:bold;
                font-size: 1.25rem;
                top: -3.5px;
                right: 5px;
                position: absolute;
            }
        /* end dropdown styling */

        /* begin toggle styling */
            .ctrl-toggle {
                width:2.5rem;
                height:100%;
                position: relative;
                left: 1.25rem;
                display: inline-block;
            }
            .ctrl-toggle input {
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
            .ctrl-toggle .toggle-slider { /* Grundfläche */
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
            .ctrl-toggle  .toggle-slider::before {  /* verschiebbarer Button */
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
            .ctrl-toggle input:checked + .toggle-slider {
                background-color: #5a9900;
                /* green */
            }
        
            .ctrl-toggle input:checked + .toggle-slider:before {
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

customElements.define('ctrl-ing', Ctrl);


/* function displayTime() {
    let date = new Date();
    let time = date.toLocaleTimeString();
    document.getElementById('demo').textContent = time;
 }

 const createClock = setInterval(displayTime, 1000); */