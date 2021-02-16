---
"layout": "page",
"title": "Getting Started"
---

# Getting Started

## 1. Add ctrling.js to a project

Use the convenience of CDN to add `<ctrl-ing>`:

```HTML
<script src="https://cdn.jsdelivr.net/gh/dmitrijLo/ctrl-ing/src/ctrling.min.js"></script>
```

Or, <a target="_blank" rel="noopener noreferrer" href='' download>download the latest ctrling.js version</a> and import it to your web page:

```HTML
<script src="./path/to/ctrling.js"></script>
```

> Note that since `<ctrl-ing>` is a custom html element which is a relative young web technology, it was found through this work that ctrling.js should be imported after declaration of the object you want to control. This will ensure that `<ctrl-ing>` is displayed properly cross different browser.

## 2. Create an object which you want to control

The declaration of an object is up to you. However, there is just one limitation. It must be available in the `window`- or rather the `globalThis`-object. With this in mind use the `var`-keyword or the `globalThis`.

## 3. Create a controller

Use the `<ctrl-ing>`-tag directly on your HTML page.

<script>var myObject = { speed:10 }</script>

```HTML
<ctrl-ing ref="myObject">
{
    "add": [ { "input":{},"path":"speed" } ]
}
</ctrl-ing>
```

<ctrl-ing ref="myObject" xOffset=50 yOffset=5>
{
    "add": [ { "input":{},"path":"speed" } ]
}
</ctrl-ing>