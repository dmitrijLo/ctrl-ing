class HMIElement {
    constructor(options,id) {
        this.options = {};
        this.id = id;
        Object.assign(this.options,options);
        this._element = document.createElement('div');
        this._element.setAttribute('class', 'hmi-element');
        this.label = document.createElement('div');
        this.label.setAttribute('class', 'hmi-label');
        this.label.innerHTML = options.label;        
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'hmi-wrapper');
        this.display = document.createElement('input');
        this.display.setAttribute('class', `hmi-input`);
        delete this.options.label;
        delete this.options.type;
    }

    get element(){ return this._element; }

    appendInput(){
        this.display.setAttribute('id',this.id);
        this.setOptions(this.display, 'number');
        this.wrapper.appendChild(this.display);
        this.element.appendChild(this.label);
        this.element.appendChild(this.wrapper);
    }

    appendSlider(){
        this.slider = document.createElement('input');
        this.display.setAttribute('class', 'hmi-display');
        this.display.setAttribute('id',this.id);
        this.slider.setAttribute('class', 'hmi-slider');
        this.slider.setAttribute('id',this.id);
        this.setOptions(this.slider, 'range');
        this.setOptions(this.display, 'number');
        this.wrapper.appendChild(this.display);
        this.wrapper.appendChild(this.slider);
        this.element.appendChild(this.label);
        this.element.appendChild(this.wrapper);
    }

    appendDropdown(){
        this.dropdown = document.createElement('select');
        this.dropdown.addEventListener('change', () => {
            this.display.value = this.dropdown.options[this.dropdown.selectedIndex].value;
        })
        const items = Object.keys(this.options);
        for (let item of items){
            const option = document.createElement('option');
            if(item === 'default') {
                option.selected = true;
                this.display.value = this.options[item];
            }
            option.innerHTML = item;
            option.value = this.options[item];
            this.dropdown.appendChild(option);
        }

        this.display.setAttribute('class', 'hmi-display');
        this.display.setAttribute('type','number');
        this.display.setAttribute('id',this.id);
        this.dropdown.setAttribute('class', 'hmi-dropdown');
        this.dropdown.setAttribute('id',this.id);
        this.wrapper.appendChild(this.display);
        this.wrapper.appendChild(this.dropdown);
        this.element.appendChild(this.label);
        this.element.appendChild(this.wrapper);
        //console.log(this.options);
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

    get reference(){ return this._reference; }
    set reference(ref){return this._reference = window[ref]}

    get header(){ return this._header; }
    set header(str){return this._header = str}

    get inputs() { return this._inputs; }
    set inputs(input) { return this._inputs.push(input); }

    connectedCallback() {
        this.reference = this.getAttribute('ref');
        this.header = this.getAttribute('header');
        this.parseJSON();
        this.init();

        console.log(this.inputs)    
    }

    init() {
        const gui = this.createGui();
        const style = document.createElement('style')
        style.textContent = HMI.template(this.setPosition());        

        //creates input elements/events
        this.inputs.forEach(input => {
            const child = new HMIElement(input.options, input.id);
            (input.options.type === 'input') ? child.appendInput() :
            (input.options.type === 'slider') ? child.appendSlider() :
            (input.options.type === 'dropdown') ? child.appendDropdown() : console.log('wrong type');
            gui.querySelector('.hmi-cb').appendChild(child.element);
            this.addEvent(input, gui);
            console.log(input)
        })
        this._root.appendChild(gui);
        this._root.appendChild(style);
    }

    addEvent(userInput, element) {
        const events = ['click', 'change','input'],
            targets = element.querySelectorAll(`#${userInput.id}`),
            event = Object.keys(userInput.on).find(key => events.includes(key)),
            callback = window[userInput.on[event]];

        targets.forEach(target => target.addEventListener(event, () => {
                const paths = userInput.path.split('/');
                const last = paths.pop();
                paths.reduce((ref, prop) => ref[prop], this.reference)[last] = +target.value;
                return callback();
            })
        );
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
            const types = ['input','slider','dropdown','toggle'];
            const innerHTML = JSON.parse(this.innerHTML); 
            innerHTML.add.forEach(elem => {
                const type = Object.keys(elem).find(key => types.includes(key));
                let param = elem.path.split('/');
                param = param[param.length - 1];
                Object.defineProperty(elem, 'options',{
                    value: { type: type, label: param },
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
                if(Object.entries(elem[type]) != 0) Object.assign(elem.options,elem[type]);
                if(!elem.hasOwnProperty('id')) elem.id = this.getID(elem.path);
                elem.options.default = this.getValue(this.reference, elem.path);
                this.inputs = elem;
        });
            return true; 
        }
        catch(e) { this._root.innerHTML = e.message; }
        return false; 
    }

    static template(position) {
        return `
            .hmi:hover {
                -webkit-transform: translate(-0.25rem, -0.25rem);
                -moz-transform: translate(-0.25rem, -0.25rem);
                -ms-transform: translate(-0.25rem, -0.25rem);
                transform: translate(-0.25rem, -0.25rem);
            }

            .hmi {
                position: relative;
                top: ${position}px;
                float: right;
                background-color: var(--bgcol-main);
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
                background-color: #10162f;
                -webkit-transition: inherit;
                transition: inherit;
            }

            .hmi-folder {
                max-width: 12.5em;
            }

            .hmi-header {
                color: #E2DDDB;
                min-height: 1.25em;
                background-color: #58595B;
                padding-left: 0.25em;
            }

            .hmi-cb {
                border-top: 1px solid black;
                padding: 0.5em 0px 0.5em 0px;
            }

            .hmi-element, .hmi-wrapper {
                display: flex;
                justify-content: flex-start;
                width: 100%;
            }

            .hmi-label, .hmi-display {
                margin-left: 0.5em;
                width: 33.3%;
                border: 1px;
            }

            .hmi-display, .hmi-label {
                height: auto;
                color: #1a1a1a;
                font-family: inherit;
                font-size: 1em;
                padding-bottom: 0.25em;
            }

            .hmi-input, .hmi-display {
                color: #1a1a1a;
                font-family: inherit;
                font-size: 0.75em;
                /*padding: 0.15em 0px;*/
                margin: 0 0.25em 0.25em 0;
                background-color: #C8D6C7;
                text-align: center;
                border: 1px solid #C8D6C7;
                border-radius: 3px;
            }

            .hmi-slider {
                width: 66.66%
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
        `;
    }
}

customElements.define('hm-i', HMI);