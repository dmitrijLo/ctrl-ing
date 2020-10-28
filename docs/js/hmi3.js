class HMI extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({mode: 'open'});
        this._inputs = [];
        this._model = {};
    }

    get model() { return this._model; }
    set model(object) { return this._model = Object.create(object); }

    get inputs() { return this._inputs; }
    set inputs(input) { return this._inputs.push(input); }

    connectedCallback() {
        //console.log(this.createGui().querySelector('.hmi-cb'))
        this.init();
        //this.setPosition();
        //console.log(this.getLastElementNode(this._root).querySelector('.hmi-input'))
    }

    async init() {
        let innerHTML = await this.innerHTML;
        innerHTML = JSON.parse(innerHTML);
        
        const gui = this.createGui();
        const style = document.createElement('style')
        style.textContent = HMI.template(this.setPosition());
        let _model = window[innerHTML.model];

        innerHTML.addInput.forEach(elem => this.inputs = elem);

        this.inputs.forEach(input => {
            const value = this.getValue(_model, input.param, input.id);
            if(!input.hasOwnProperty('options')){
                let options = {}
                options.value = value;
                options.label = input.param;
                input.options = options;
            } else if(!input.options.label){
                input.options.label = input.param;
                input.options.value = value;
            } else {
                input.options.value = value;
            }

            gui.querySelector('.hmi-cb').appendChild(this.createInput(input.options, input.id));
        })

        this._root.appendChild(gui);
        this._root.appendChild(style);
        console.log(gui.querySelector('#A0'))
    }

    addEvent() {
        
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
        
        //const style = document.createElement('style')
        //console.log(style.isConnected);

        //this._root.appendChild(style);
        //console.log(style.isConnected);
        //this._root.appendChild(wrapper);
        gui.appendChild(folder);
        folder.appendChild(header);
        folder.appendChild(contenBox);

        return gui;
    }

    getLastElementNode(parentNode) {
        let foundElement;

        (function getElement(node) {

            let lastElement = node.lastElementChild;
            (lastElement === null) ? foundElement = node : getElement(lastElement);
        })(parentNode);

        return foundElement;
    }
    
    createInput(options, id) {
        const inputBox = document.createElement('div');
        inputBox.setAttribute('class', 'hmi-inputBox');
        const label = document.createElement('div');
        label.setAttribute('class', 'hmi-label');
        label.innerHTML = options.label;
        delete options.label;

        const inputField = document.createElement('div');
        inputField.setAttribute('class', 'hmi-inputField');

        const plus = document.createElement('div');
        plus.innerHTML = '+';
        plus.setAttribute('class', 'hmi-plus');

        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('class', 'hmi-input');
        input.setAttribute('id', id);
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

    getValue(obj, param, id = param) {
        let foundElement;
        let foundFlag = false;
        const initialObject = obj;

        (function getObject(obj) {
            if(obj.hasOwnProperty('id') && obj['id'] === id) {
                foundFlag = true;
                return foundElement = obj[param];
            } else if(!foundFlag) {
                Object.keys(obj).forEach(key => {
                const currentElement = obj[key];
                typeof currentElement === 'object'
                    ? currentElement === initialObject
                    ? null
                    : getObject(currentElement)
                    : null;
                });
            }
        })(initialObject);
        return foundElement;
    } 

    setPosition() {
        //let style = this._root.firstChild;
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

/*function HMI(x,y) {
    
    let self = Object.create(HMI.prototype);
    self.queue = [];
    self.model = [];
    self.initNode = document.body.childElementCount;
    self.currentNode;

    let hmi = document.createElement('div');
    hmi.id = 'hmi'
    document.body.appendChild(hmi);
    document.getElementById('hmi').setAttribute('style', `position: absolute; top: ${y}px; left: 70%` );
    //document.body.children[self.initNode].id = 'hmi';
    //console.log(document.getElementById('hmi').getBoundingClientRect());
    self.currentNode = document.body.children[self.initNode];
    self._createGroup('HMI');

    return self;
}

HMI.prototype = {
    addInput: function (object, property, options = {}) {
        const inputType = typeof object[property];
        //const htmlNode = document.body.children[this.initNode].lastChild;
        const attributes = { value: object[property], type: inputType, label: property };
        Object.assign(attributes, options)

        this.model.push(object);
        this.queue.push(property);
        this._createElement(attributes);
        return this;
    },

    on: function (event, callback) {
        const index = this.model.length - 1;
        const parentNode = this.currentNode.children[index];
        const targetsKey = this.queue[index];
        let target = this.model[index];
        
        const relatedInputElement = this._getInputElementNode(parentNode);
        relatedInputElement.addEventListener(event, function(){
            target[targetsKey] = +relatedInputElement.value;
            callback();
        })

        return this;
    },

    //helper

    _createGroup: function (name) {
        const div = document.createElement('div');
        this.currentNode.appendChild(div);
        const lvl = this._levelUp();

        const label = document.createElement('div');
        label.className = `hmi-${lvl}-label`;
        label.innerHTML = name;
        const content = document.createElement('div');
        content.className = `hmi-${lvl}-content`
        //this.currentNode = document.body.children[this.initNode];
        //this.currentNode = this.currentNode.lastChild;

        this.currentNode.appendChild(label);
        this.currentNode.appendChild(content);

        this._levelUp();
    },

    _createElement: function (attr) {
        console.log(attr)
        const rememberNode = this.currentNode;
        this._createGroup(attr.label);

        if(attr.type === "number") {
            let el = document.createElement('input');
            this._setAttributes(el, attr);
            this.currentNode.appendChild(el);
            this.currentNode = rememberNode;
            this._levelUp(reset = 2);
        }
    },
    
    _setAttributes: function (element, attr) {
        Object.keys(attr).forEach(key => element.setAttribute(key, attr[key]))
    },

    _getInputElementNode: function (parentNode) {
        let foundElement;

        (function getElement(node) {
            node.childNodes.forEach(childNode => {
                if(childNode.tagName === 'INPUT') {
                    return foundElement = childNode;
                }
                getElement(childNode); })
        })(parentNode);

        return foundElement;
    },

    _levelUp: (function() {
        let lvl = 1;
        return function(reset = 0) {
            if(reset != 0){
                lvl = lvl - reset;

            } else {
                lvl+=1;
                this.currentNode = this.currentNode.lastChild;
            }
            return `lvl${lvl}`;
        };
    })()
}
*/