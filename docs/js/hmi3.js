class HMI extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({mode: 'open'});
        this._inputs = [];
        this._reference;
    }

    get reference(){ return this._reference; }
    set reference(ref){return this._reference = window[ref]}

    get inputs() { return this._inputs; }
    set inputs(input) { return this._inputs.push(input); }

    connectedCallback() {
        this.reference = this.getAttribute('ref');
        this.parseJSON();
        this.init();

    console.log(document.getElementById('hmi'));
    console.log(this._root)    
    }

    init() {
        const gui = this.createGui();
        const style = document.createElement('style')
        style.textContent = HMI.template(this.setPosition());        

        //creates input elements/events
        this.inputs.forEach(input => {
            gui.querySelector('.hmi-cb').appendChild(this.createInput(input.options));
            this.addEvent(input, gui);
        })
        this._root.appendChild(gui);
        this._root.appendChild(style);
    }

    addEvent(userInput, element) {
        const events = ['click', 'change','input'];
        const target = element.querySelector(`#${userInput.options.id}`);
        const event = Object.keys(userInput.on).find(key => events.includes(key))
        const callback = window[userInput.on[event]];

        target.addEventListener(event, () => {
            const paths = userInput.path.split('/');
            const last = paths.pop();
            paths.reduce((ref, prop) => ref[prop], this.reference)[last] = +target.value;
            return callback();
        })
    }

    createGui() {
        const gui = document.createElement('div');
        gui.setAttribute('class', 'hmi');
        const folder = document.createElement('div');
        folder.setAttribute('class', 'hmi-folder');
        const header = document.createElement('div');
        header.innerHTML = 'Steuerung eines Dreiecks'
        header.setAttribute('class', 'hmi-header');
        const contenBox = document.createElement('div');
        contenBox.setAttribute('class', 'hmi-cb');
        
        gui.appendChild(folder);
        folder.appendChild(header);
        folder.appendChild(contenBox);

        return gui;
    }
    
    createInput(options) {
        const inputBox = document.createElement('div');
        inputBox.setAttribute('class', 'hmi-inputBox');
        const label = document.createElement('div');
        label.setAttribute('class', 'hmi-label');
        label.innerHTML = options.label;
        //delete options.label;

        const inputField = document.createElement('div');
        inputField.setAttribute('class', 'hmi-inputField');

        const plus = document.createElement('div');
        plus.innerHTML = '+';
        plus.setAttribute('class', 'hmi-plus');

        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('class', 'hmi-input');
        Object.keys(options).forEach(key => {
            input.setAttribute(key, options[key])
        })

        const minus = document.createElement('div');
        minus.innerHTML = '-';
        minus.setAttribute('class', 'hmi-minus');

        inputField.appendChild(plus);
        inputField.appendChild(input);
        inputField.appendChild(minus);
        inputBox.appendChild(label);
        inputBox.appendChild(inputField);

        return inputBox;
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
            const innerHTML = JSON.parse(this.innerHTML); 
            innerHTML.addInput.forEach(elem => {
                let param = elem.path.split('/');
                param = param[param.length - 1];
                console.log(param);
                if(!elem.hasOwnProperty('options')){
                    elem.options = {}
                    elem.options.label = param;
                } else if(!elem.options.hasOwnProperty('label')){
                    elem.options.label = param;
                }
            elem.options.value = this.getValue(this.reference, elem.path);
            elem.options.id = this.getID(elem.path);
            this.inputs = elem;
        });
            return true; 
        }
        catch(e) { this._root.innerHTML = e.message; }
        return false; 
    }

    static template(position) {
        return `
            .hmi {
                position: relative;
                top: ${position}px;
                float: right;
                background-color: #648181;
                box-sizing: border-box;
                border: 1px solid black;
                border-radius: 0px 25px 0px 25px; 
                box-shadow: 10px 5px 1.5px black;
                overflow: hidden;
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

            .hmi-inputBox {
                display: flex;
                justify-content: flex-start;
            }

            .hmi-label {
                margin-left: 0.5em;
                width: 40%;
                border: 1px;
            }

            .hmi-inputField {
                margin-right: 0.5em;
                display: flex;
                justify-content: flex-end;
                width: 60%;
    
            }

            .hmi-inputField, .hmi-label {
                height: auto;
                color: #1a1a1a;
                font-family: inherit;
                font-size: 1em;
                padding-bottom: 0.25em;
            }

            .hmi-input {
                color: #1a1a1a;
                font-family: inherit;
                font-size: 0.75em;
                /*padding: 0.15em 0px;*/
                background-color: #C8D6C7;
                text-align: center;
                border: 1px solid #C8D6C7;
                border-radius: 3px;
                width: 40%
            }

            .hmi-plus, .hmi-minus {
                text-align: center;
                width: 1.25em;
                border: 1px solid black;
                border-radius: 25%;   

            }
        `;
    }
}

customElements.define('hm-i', HMI);