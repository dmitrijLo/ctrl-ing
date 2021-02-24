const nav = {
    "name": "Navigation",
    "path": ".",
    "entries": [{
        "name": "Getting Started",
        "path": "getting-started.html"
    },{
        "name": "Attributes",
        "path": "attributes.html"
    },{
        "name": "Inputs",
        "path": "inputs.html"
    },{
        "name": "Studywork",
        "path": "studywork.html"
    }
    ]
};

class NavigationPane extends HTMLElement {
    static get observedAttributes() {
        return ['base', 'title', 'img'];
    }

    get base() { return this.getAttribute('base') || "" }
    set base(q) { if (q) this.setAttribute('base', q) }
    get title() { return this.getAttribute('title') || "" }
    set title(q) { if (q) this.setAttribute('title', q) }
    get img() { return this.getAttribute('img') || "" }
    set img(q) { if (q) this.setAttribute('img', q) }
    get start() { return this.getAttribute('start') || 1 }
    set start(q) { if (q) this.setAttribute('start', q) }

    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
        this._state = { edit: false, pause: true };
        this._inputs = [];
    }

    connectedCallback() {
        // window.sessionStorage.setItem('navPaneOpen', [0,1,2,3]);
        this.open = window.sessionStorage.getItem('navPaneOpen');
        window.sessionStorage.clear('navPaneOpen');

        this.innerHTML = JSON.stringify(nav); // hmm...
        try {
            this.nav = JSON.parse(this.innerHTML);
            this._root.innerHTML = this.template(this.nav);
        }
        catch (e) { this._root.innerHTML = e.message; }
    }

    disconnectedCallback() {
    }

    template({ entries }) {
        const addEntries = (entries, path) => {
            return `${entries.map((c, idx) => {
                const concatPath = path + "/" + c.path;

                if (c.entries) {
                    const summaryStyle = "cursor: pointer";
                    const olStyle = "padding-inline-start: 25px";
                    const open = this.open == idx ? "open" : "";

                    return `<li><details
                        ${open}
                        onclick="window.sessionStorage.setItem('navPaneOpen', ${idx})">
                        <summary style="${summaryStyle}" markdown="span"> ${c.name} </summary>
                        <ol style="${olStyle}">${addEntries(c.entries, concatPath)}</ol>
                        </details></li>`
                }
                else {
                    const [el, href, style] = c.path ?
                        ["a", `href="${concatPath}"`, "font-color:black;text-decoration:none"] :
                        ["span", "",
                            "pointer-events: none; cursor: default; color: lightgray"];

                    return `<li><${el} style="${style}" ${href}>${c.name}</${el}></li>`;
                }
            }).join("")}`
        }

        const olStyle = "padding-inline-start: 25px;list-style: none;";
        const imgStyle = "margin: 0 auto; max-width: 100%;";

        return `<a href="${this.base}/index.html">
            <img style="${imgStyle}" src="${this.img}"></img></a>
            <h2 style="font-weight: 400">${this.title}</h2>
            <ol id="nav-pane" style="${olStyle}" start="${this.start}">
            ${addEntries(entries, this.base)}
            </ol>`;
    }
}
customElements.define('nav-pane', NavigationPane);
