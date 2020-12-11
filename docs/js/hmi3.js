class CanvasHandler {
    constructor(canvas, handle, range){
        const resolution = ((range.min && range.max) || range.max != undefined) ? { x: 1/(range.max/canvas.width), y: 1/(range.max/canvas.height) } : 
                            { x: 1/((handle.x+canvas.width)/canvas.width), y: 1/((handle.y + canvas.height)/canvas.height) } ;
        this._handle = {x: handle.x * resolution.x, y: handle.y * resolution.y, r: 10};
        this.isDragging = false;
        this.dragHandle;
        this.canvas = canvas;
        this._resolution = resolution;
    }

    get offset() { return {top: this.canvas.getBoundingClientRect().top,left: this.canvas.getBoundingClientRect().left}; }
    get resolution() { return this._resolution; }
    get handle() { return this._handle; }
    set handle(obj) { this._handle.x = obj.x;
                      this._handle.y = obj.y }
    get newPosition() { return {p1: Math.floor((this.handle.x/this.resolution.x)*10)/10, p2: Math.floor((this.handle.y/this.resolution.y)*10)/10}; }
                
    circlePointCollision(x,y, circle) {
        const dx = circle.x - x,
              dy = circle.y - y,
              distance = Math.sqrt(dx*dx + dy*dy);
        return distance < circle.r;
    }

    onMouseDown(e) {
        console.log('Höhe: ',this.canvas.height);
        console.log('Breite: ',this.canvas.width);
        const x = e.clientX - Math.floor(this.offset.left),
              y = this.canvas.height - (e.clientY - Math.floor(this.offset.top));
        let hand = this.handle;

        if(this.circlePointCollision(x, y, hand)) {
            this.handle = { x: x, y: y };
            this.strokeHandle();
            this.isDragging = true;
            this.onMouseMoveBinding = this.onMouseMove.bind(this);
            this.onMouseUpBinding = this.onMouseUp.bind(this);
            e.target.addEventListener("mousemove", this.onMouseMoveBinding);
            e.target.addEventListener("mouseup", this.onMouseUpBinding);
            this.dragHandle = hand;
            console.log('HIT!')
        }
     }

    onMouseMove(e) {
        if(this.isDragging && this.dragHandle === this.handle) {
            this.handle = { x: this.handle.x + (e.movementX || e.mozMovementX || e.webkitMovementX || 0), 
                            y: this.handle.y - (e.movementY || e.mozMovementY || e.webkitMovementY || 0) };
        }
        this.strokeHandle();
        console.log('dragggggggigng')
    }
    
    onMouseUp(e) {
        e.target.removeEventListener("mousemove", this.onMouseMoveBinding);
        e.target.removeEventListener("mouseup", this.onMouseUpBinding);
        this.isDragging = false;
        console.log('stop that drag')
    }

    strokeHandle() {
        const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo( this.handle.x, this.handle.y );
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.handle.x,this.handle.y,this.handle.r/2,0,(Math.PI/180)*360,false);
            ctx.fill();
    }
}

class HMIElement {
    constructor(options,id) {
        this.options = {};
        this.label = options.label;
        this.id = id;
        Object.assign(this.options,options);
        this._element = document.createElement('div');
        this._element.setAttribute('class', 'hmi-element');  
        delete this.options.label;
        delete this.options.type;
    }

    get element(){ return this._element; }

    createDisplay(type = 'number', className = 'hmi-display', id = this.id, value = this.options.default){
        const display = document.createElement('input');
        display.setAttribute('type', type);
        display.setAttribute('class', className);
        display.setAttribute('id', id);
        display.value = value;
        return display;
    }

    createWrapper(className = 'hmi-wrapper') {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', className);
        return wrapper;
    }

    createLabel(className = 'hmi-label', text = this.label) {
        const label = document.createElement('div');
        label.setAttribute('class', className);
        label.innerHTML = text;
        return label;
    }

    appendElements(reciever, ...elements) {
        for (let element of elements){
            reciever.appendChild(element);
        } 
    }

    appendCanvas(){
        function convertRemToPixels(rem) {
            return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
        }
        const displayP1 = this.createDisplay(),
              displayP2 = this.createDisplay(),
              label = this.createLabel(),
              displayWrapper = this.createWrapper('hmi-element'),
              wrapper = this.createWrapper(),
              symbol = document.createElement('div'),
              canvas = document.createElement('canvas'),
              defaultStyle = {canvas: 'width:0;height:0', element:'height:1.25rem', visible: false};
        canvas.setAttribute('id',this.id);
        canvas.setAttribute('style',defaultStyle.canvas);
        canvas.setAttribute('width',`${convertRemToPixels(12)}px`);
        canvas.setAttribute('height',`${convertRemToPixels(10)}px`);
        canvas.getContext('2d').translate(0, canvas.height);
        canvas.getContext('2d').scale(1,-1);
        symbol.setAttribute('class', 'hmi-symbol');
        symbol.innerHTML = "&#9660;";
        symbol.addEventListener('click', () => {
            if(!defaultStyle.visible) {
                canvas.setAttribute('style','width: auto;height: auto;border:1px solid black;');
                this.element.setAttribute('style','height:auto')
            } else {
                canvas.setAttribute('style', defaultStyle.canvas);
                this.element.setAttribute('style', defaultStyle.element);
            }
            defaultStyle.visible = !defaultStyle.visible;
        })
        
        this.element.setAttribute('class','hmi-canvasHandle');
        this.element.setAttribute('style', defaultStyle.element);
        this.appendElements(wrapper, displayP1, displayP2, symbol);
        this.appendElements(displayWrapper, label, wrapper);
        this.appendElements(this.element, displayWrapper, canvas);
    }

    appendInput(){
        const input = this.createDisplay('number','hmi-input'),
              wrapper = this.createWrapper(),
              label = this.createLabel();
        wrapper.appendChild(input);
        this.appendElements(this.element, label, wrapper);
    }

    appendSlider(){
        const slider = document.createElement('input'),
              display = this.createDisplay(),
              wrapper = this.createWrapper(),
              label = this.createLabel();
        slider.addEventListener('input', () => {
            display.value = slider.value;
        })
        slider.setAttribute('class', 'hmi-slider');
        slider.setAttribute('id',this.id);
        this.setOptions(slider, 'range');
        this.appendElements(wrapper, display, slider);
        this.appendElements(this.element, label, wrapper);
    }

    appendDropdown(){
        const dropdown = document.createElement('select'),
              display = this.createDisplay(),
              wrapper = this.createWrapper(),
              label = this.createLabel();
        dropdown.addEventListener('change', () => {
            display.value = dropdown.options[dropdown.selectedIndex].value;
        })
        const items = Object.keys(this.options);
        for (let item of items){
            const option = document.createElement('option');
            if(item === 'default') {
                option.selected = true;
                display.value = this.options[item];
            }
            option.innerHTML = item;
            option.value = this.options[item];
            dropdown.appendChild(option);
        }

        dropdown.setAttribute('class', 'hmi-dropdown');
        dropdown.setAttribute('id',this.id);
        this.appendElements(wrapper,display,dropdown);
        this.appendElements(this.element,label,wrapper);
    }

    appendToggle(){
        const display = this.createDisplay(),
              wrapper = this.createWrapper(),
              label = this.createLabel(),
              togglelLabel = document.createElement('label'),
              input = document.createElement('input'),
              toggle = document.createElement('span');
        let flag = false;
        togglelLabel.setAttribute('data-off',"off");
        togglelLabel.setAttribute('data-on', "on" );
        input.setAttribute('type','checkbox');
        toggle.setAttribute('class','hmi-toggle');
        toggle.setAttribute('id',this.id);
        input.addEventListener('click', () => {
            flag ? display.value = this.options.default : display.value = this.options.closed;
            flag ? toggle.value = this.options.default : toggle.value = this.options.closed;
            flag = !flag;
        })
        this.appendElements(toggle,input,togglelLabel);
        this.appendElements(wrapper,display,toggle);
        this.appendElements(this.element,label,wrapper);
    }

    setOptions(element, type){
        this.options.type = type;
        Object.keys(this.options).forEach(key => {
            (key === 'default') ? element.setAttribute('value', this.options[key]) : element.setAttribute(key, this.options[key]);
        });
    }
}

class HMI extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({mode: 'open'});
        this._inputs = [];
        this._reference;
        this._header = '';
    }

    get root(){ return this._root; }
    get reference(){ return this._reference; }
    set reference(ref){return this._reference = window[ref]; }
    get header(){ return this._header; }
    set header(str){return this._header = str; }
    get inputs() { return this._inputs; }
    set inputs(input) { return this._inputs.push(input); }

    connectedCallback() {
        this.reference = this.getAttribute('ref');
        this.header = this.getAttribute('header');
        this.parseJSON();
        this.init();
        this.offset = this.root.querySelector('.hmi').getBoundingClientRect();
        this.addEvent(this.inputs);  
    }

    init() {
        const gui = this.createGui();
        const style = document.createElement('style')
        style.textContent = HMI.template(this.setPosition());        

        //creates input elements/events
        for (let input of this.inputs){
            const child = new HMIElement(input.options, input.id);
            (input.options.type === 'input') ? child.appendInput() :
            (input.options.type === 'slider') ? child.appendSlider() :
            (input.options.type === 'dropdown') ? child.appendDropdown() :
            (input.options.type === 'toggle') ? child.appendToggle() : 
            (input.options.type === 'canvas') ? child.appendCanvas() : console.log('wrong type');
            gui.querySelector('.hmi-cb').appendChild(child.element);
        }
        
        this._root.appendChild(gui);
        this._root.appendChild(style);
    }

    addEvent(inputs) {
        const events = ['click', 'change','input'];
        
        for (let input of inputs){
            const targets = this.root.querySelectorAll(`#${input.id}`);
            let event = (input.hasOwnProperty('event')) ? Object.values(input).find(key => events.includes(key)) : undefined;
            let callback = (event != undefined) ? window[input.func] : undefined;
            if(callback === undefined) event = 'change';
             
            for (let target of targets) {
                if(target.tagName === 'CANVAS'){
                    console.log(input);
                    const [pathsP1, pathsP2] = [input.p1.path.split('/'), input.p2.path.split('/')],
                          [lastP1, lastP2] = [pathsP1.pop(), pathsP2.pop()],
                          [p1, p2] = [pathsP1.reduce((ref, prop) => ref[prop], this.reference)[lastP1], pathsP2.reduce((ref, prop) => ref[prop], this.reference)[lastP2]],
                          cnv = target,
                          displayP1 = targets[0],
                          displayP2 = targets[1],
                          range = input.hasOwnProperty('min') && input.hasOwnProperty('max') ? { min: input.min, max: input.max } : 
                                  input.hasOwnProperty('min') ? { min: input.min, max: undefined } : 
                                  input.hasOwnProperty('max') ? { min: undefined, max: input.max } : { min: undefined, max: undefined },
                          interactor = new CanvasHandler(cnv, { x:p1, y:p2 }, range),
                          mouseMove = () => {
                            [displayP1.value,displayP2.value] = [interactor.newPosition.p1, interactor.newPosition.p2];
                            pathsP1.reduce((ref, prop) => ref[prop], this.reference)[lastP1] = +interactor.newPosition.p1;
                            pathsP2.reduce((ref, prop) => ref[prop], this.reference)[lastP2] = +interactor.newPosition.p2;
                            if(callback != undefined) return callback();
                          },
                          mouseUp = () => {
                            cnv.removeEventListener("mousemove", mouseMove);
                            cnv.removeEventListener("mouseup", mouseUp);
                          };

                    [displayP1.value,displayP2.value] = [interactor.newPosition.p1, interactor.newPosition.p2];
                    interactor.strokeHandle();
                    cnv.addEventListener("mousedown", (e) => {
                        interactor.onMouseDown(e);
                        cnv.addEventListener("mousemove", mouseMove);
                        cnv.addEventListener("mouseup", mouseUp);
                    })
                        
                }else if(input.hasOwnProperty('path')) {
                    target.addEventListener(event, () => {
                        const paths = input.path.split('/');
                        const last = paths.pop();
                        paths.reduce((ref, prop) => ref[prop], this.reference)[last] = +target.value;
                        if(callback != undefined) return callback();
                    });
                }
            }
        }
    }

    createGui() {
        const gui = document.createElement('div');
        gui.setAttribute('class', 'hmi');
        const folder = document.createElement('div');
        folder.setAttribute('class', 'hmi-folder');
        const header = document.createElement('div');
        header.innerHTML = this.header;
        header.setAttribute('class', 'hmi-header');
        const contenBox = document.createElement('div');
        contenBox.setAttribute('class', 'hmi-cb');
        
        gui.appendChild(folder);
        folder.appendChild(header);
        folder.appendChild(contenBox);
        return gui;
    }

    setPosition() {
        const hmi = document.getElementById('hmi');
        let hmiTop = hmi.getBoundingClientRect().top;
        const offset = window.pageYOffset;
        let previousElementTop;

        (function getPreviousElementPosition(elem){
            const previousElement = elem.previousElementSibling;

            if(!(previousElement.getBoundingClientRect().height === 0)){
                return previousElementTop = previousElement.getBoundingClientRect().top;
            }
            getPreviousElementPosition(previousElement);
        })(hmi);

        previousElementTop += offset;
        hmiTop += offset;
        return previousElementTop - hmiTop;
    }

    getValue(object, path) {
        const keys = path.split('/');
        let foundVal = object;
        keys.forEach(key => foundVal = foundVal[key]);
        return foundVal;
    }

    getID(path) {
        const keys = path.split('/');
        return keys.join('-');
    }

    parseJSON() {
        try {
            const types = ['input','slider','dropdown','toggle','canvas'];
            const innerHTML = JSON.parse(this.innerHTML);
            let connections = innerHTML.connect;

            for (let elem of innerHTML.add) {
                if(connections != undefined) {
                    let skip = false;
                    for (let connection of connections){
                        if(connection.p1 === elem.id || connection.p2 === elem.id) skip = !skip;
                        if(connection.p1 === elem.id) {
                            delete connection.p1;
                            Object.defineProperty(connection, 'p1',{ value: elem, writable:true, enumerable:true, configurable:true });
                            Object.defineProperty(connection, 'canvas',{ value: (connection.hasOwnProperty('label')) ? { label: connection.label }: {}, writable:true, enumerable:true, configurable:true });
                            delete connection.label;
                        }else if(connection.p2 === elem.id){
                            delete connection.p2;
                            Object.defineProperty(connection, 'p2',{ value: elem, writable:true, enumerable:true, configurable:true });
                        }
                    }

                    if(elem === innerHTML.add[innerHTML.add.length - 1]) {
                        for (let connection of connections) innerHTML.add.push(connection);
                        connections = undefined;
                    }
                    if(skip) continue;
                }

                const type = Object.keys(elem).find(key => types.includes(key));
                let { param1, param2 } = (elem.hasOwnProperty('path')) ? { param1: elem.path.split('/') } : { param1: elem.p1.path.split('/') , param2: elem.p2.path.split('/') } ;
                (param2 != undefined) ? [param1, param2] = [ param1[param1.length - 1] , param2[param2.length - 1] ] : param1 = param1[param1.length - 1];
                
                Object.defineProperty(elem, 'options',{ value: { type:type, label:param1 }, writable:true, enumerable:true, configurable:true });
                if(Object.entries(elem[type]) != 0) Object.assign(elem.options,elem[type]);
                if(!elem.hasOwnProperty('id') && elem.hasOwnProperty('path')) elem.id = this.getID(elem.path);
                // workaround to create an id for connected points
                if(!elem.hasOwnProperty('id') && !elem.hasOwnProperty('path')) elem.id = this.getID(`${elem.p1.id}/${elem.p2.id}`);
                if(elem.hasOwnProperty('path')) elem.options.default = this.getValue(this.reference, elem.path);
                for (const event in elem.on){
                    elem.event = event;
                    elem.func = elem.on[event];
                }
                delete elem.on;
                delete elem[type];
                this.inputs = elem;
        };
            return true; 
        }
        catch(e) { console.log(e)/* this._root.innerHTML = e.message; */ }
        return false; 
    }

    static template(position) {
        document.documentElement.style.setProperty('--hmi-base-background-color','#fffff8');
        document.documentElement.style.setProperty('--hmi-base-shadow-color','#10162f');

        return `
            .hmi:hover {
                -webkit-transform: translate(-0.25rem, -0.25rem);
                -moz-transform: translate(-0.25rem, -0.25rem);
                -ms-transform: translate(-0.25rem, -0.25rem);
                transform: translate(-0.25rem, -0.25rem);
            }

            .hmi {
                display: block;
                margin-bottom: 0.5em;
                color: #1a1a1a;
                font-family: inherit;
                font-size: 0.75em;
                position: relative;
                top: ${position}px;
                float: right;
                background-color: var(--hmi-base-background-color);
                box-sizing: border-box;
                border: 1px solid black;
                /*border-radius: 0px 25px 0px 25px;*/
                /*box-shadow: 10px 5px 1.5px black;*/
                /*overflow: hidden;*/
                -webkit-transition: 200ms -webkit-transform;
                transition: 200ms transform;
            }

            *, ::after, ::before {
                box-sizing: inherit;
            }

            .hmi::before {
                z-index: -1;
            }

            .hmi::after,.hmi::before {
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

            .hmi:hover::after {
                -webkit-transform: translate(0.5rem,0.5rem);
                -moz-transform: translate(0.5rem,0.5rem);
                -ms-transform: translate(0.5rem,0.5rem);
                transform: translate(0.5rem,0.5rem);
            }

            .hmi::after {
                z-index: -2;
                background-color: var(--hmi-base-shadow-color);
                -webkit-transition: inherit;
                transition: inherit;
            }

            .hmi-folder {
                max-width: 12.5rem;
            }

            .hmi-header {
                color: #E2DDDB;
                min-height: 1.5rem;
                background-color: #58595B;
                padding-left: 0.25em;
            }

            .hmi-cb {
                border-top: 1px solid black;
                padding-top: 0.5em;
                word-wrap: anywhere;
            }

            .hmi-element, .hmi-wrapper {
                display: flex;
                justify-content: flex-start;
                width: 100%;
            }

            .hmi-element {
                padding-bottom: 0.25rem;
                padding-right: 0.25em
            } 

            .hmi-canvasHandle {
                margin-bottom: 0.25em;
            }

            .hmi-canvasHandle > canvas {
                width: 100%;
                height: 7.5rem;
                cursor: crosshair;
                margin: 0 0.25em;
            }


            .hmi-label, .hmi-display {
                width: 40%;
            }

            .hmi-display, .hmi-label, .hmi-symbol, .hmi-input {
                height: 1.25rem;
            }

            .hmi-input, .hmi-display {
                padding: 0.25em 0;
                margin-right: 0.25em;
                background-color: #C8D6C7;
                text-align: center;
                border: 1px solid #C8D6C7;
                border-radius: 3px;
            }
            .hmi-label {
                margin: 0 .25em;
            }
            .hmi-symbol {
                font-size: 0.75em;
                width: 100%;
                background-color: #C8D6C7;
                text-align: center;
                border: 1px solid #C8D6C7;
                border-radius: 3px;
            }
            .hmi-slider {
                width: 50%
            }

            .hmi-input {
                width: 100%;
            }

            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            input[type="number"] {
                -moz-appearance: textfield;
            }

            .hmi-toggle {
                position:relative;
                display:inline-block;
                width:60px;
                height:20px;
                margin:0 0.75rem;
                background-color:#bbb;
                -webkit-border-radius:4px;
                -moz-border-radius:4px;
                border-radius:4px;
                text-align:center;
                align-self:center;
            }
            .hmi-toggle input {
                width:100%;
                height:100%;
                margin:0 0;
                padding:0 0;
                position:absolute;
                top:0;
                right:0;
                bottom:0;
                left:0;
                z-index:2;
                cursor:pointer;
                opacity:0;
                filter:alpha(opacity=0);
              }
              .hmi-toggle label {
                display:block;
                position:absolute;
                top:1px;
                right:1px;
                bottom:1px;
                left:1px;
                
                background-image:-webkit-linear-gradient(left,#fff 0%,#ddd 50%,#fff 50%,#eee 100%);
                background-image:-moz-linear-gradient(left,#fff 0%,#ddd 50%,#fff 50%,#eee 100%);
                background-image:-ms-linear-gradient(left,#fff 0%,#ddd 50%,#fff 50%,#eee 100%);
                background-image:-o-linear-gradient(left,#fff 0%,#ddd 50%,#fff 50%,#eee 100%);
                background-image:linear-gradient(left,#fff 0%,#ddd 50%,#fff 50%,#eee 100%);
                -webkit-box-shadow:2px 0 3px rgba(0,0,0,0.4),
                    inset -1px 0 1px #888,
                    inset -5px 0 1px #bbb,
                    inset -6px 0 0 white;
                -moz-box-shadow:2px 0 3px rgba(0,0,0,0.4),
                    inset -1px 0 1px #888,
                    inset -5px 0 1px #bbb,
                    inset -6px 0 0 white;
                box-shadow: 2px 0px 3px rgba(0,0,0,0.4),
                  inset -1px 0 1px #888,
                  inset -5px 0 1px #bbb,
                  inset -6px 0 0 white;
                -webkit-border-radius:3px;
                -moz-border-radius:3px;
                border-radius:3px;
                font:normal 11px Arial,Sans-Serif;
                color:#666;
                text-shadow:1px 0 0 white;
                cursor:text;
              }
              .hmi-toggle label:before {
                content:attr(data-off);
                position:absolute;
                top:3px;
                right:30px;
                left:0px;
                z-index:4;
              }
              .hmi-toggle label:after {
                content:attr(data-on);
                position:absolute;
                top: 3px;
                right:0;
                left:22px;
                color:#666;
                text-shadow:0 -1px 0 #eee;
              }
              .hmi-toggle input:checked + label {
                background-image:-webkit-linear-gradient(left,#eee 0%,#ccc 50%,#fff 50%,#eee 100%);
                background-image:-moz-linear-gradient(left,#eee 0%,#ccc 50%,#fff 50%,#eee 100%);
                background-image:-ms-linear-gradient(left,#eee 0%,#ccc 50%,#fff 50%,#eee 100%);
                background-image:-o-linear-gradient(left,#eee 0%,#ccc 50%,#fff 50%,#eee 100%);
                background-image:linear-gradient(left,#eee 0%,#ccc 50%,#fff 50%,#eee 100%);
                -webkit-box-shadow:0 0 1px rgba(0,0,0,0.4),
                    inset 1px 0 7px -1px #ccc,
                    inset 5px 0 1px #fafafa,
                    inset 6px 0 0 white;
                -moz-box-shadow:0 0 1px rgba(0,0,0,0.4),
                    inset 1px 0 7px -1px #ccc,
                    inset 5px 0 1px #fafafa,
                    inset 6px 0 0 white;
                box-shadow:0 0 1px rgba(0,0,0,0.4),
                  inset 1px 0 7px -1px #ccc,
                  inset 5px 0 1px #fafafa,
                  inset 6px 0 0 white;
              }
              .hmi-toggle input:checked:hover + label {
                -webkit-box-shadow:0 1px 3px rgba(0,0,0,0.4),
                    inset 1px 0 7px -1px #ccc,
                    inset 5px 0 1px #fafafa,
                    inset 6px 0 0 white;
                -moz-box-shadow:0 1px 3px rgba(0,0,0,0.4),
                    inset 1px 0 7px -1px #ccc,
                    inset 5px 0 1px #fafafa,
                    inset 6px 0 0 white;
                box-shadow:1px 0 3px rgba(0,0,0,0.4),
                  inset 1px 0 7px -1px #ccc,
                  inset 5px 0 1px #fafafa,
                  inset 6px 0 0 white;
              }
              .hmi-toggle input:checked + label:before {
                z-index:1;
                right:25px;
              }
              .hmi-toggle input:checked + label:after {
                left:30px;
                color:#aaa;
                text-shadow:none;
                z-index:4;
            }
        `;
    }
}

customElements.define('hm-i', HMI);