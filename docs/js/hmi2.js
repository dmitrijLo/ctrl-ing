function HMI(x,y) {
    
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

