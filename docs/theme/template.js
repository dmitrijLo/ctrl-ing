const tmpl = module.exports = {
// base layout ... used by other templates
base(data) {
  return `<!doctype html>
<html class="theme-light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1,user-scalable=no">
<meta name="description" content="${data.description || (data.title + ' - microjam page')}">
${data.date ? `<meta name="date" content="${new Date(data.date).toString()}">` : ''}
${data.tags ? `<meta name="keywords" content="${data.tags.join()}">` : ''}
<title>${data.title}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@9.18.1/styles/vs2015.min.css">
${data.math ? `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.css">` : ''}
<link rel="stylesheet" href="./theme/styles.css">
<script src="https://cdn.jsdelivr.net/gh/goessner/g2@v2.5/src/g2.js"></script>
<script src="https://cdn.jsdelivr.net/gh/goessner/mec2@master/mec2.js"></script>
<script src="https://cdn.jsdelivr.net/npm/tweakpane@1.5.5/dist/tweakpane.min.js"></script>
</head>
<body>
<header>
  <a href="./index.html" class="left">&lt;ctrl-ing&gt;</a>
  <span class="right"><a href="./index.html">About</a> | <a href="https://github.com/dmitrijLo/HMI">Source</a></span>
</header>
<main>
<nav>
  <nav-pane base="${data.base}"></nav-pane>
</nav>
<article>
  ${data.content}
</article>
</main>
<footer>
  <script src="https://cdn.jsdelivr.net/gh/dmitrijLo/ctrl-ing@master/src/ctrling.min.js"></script>
  ${data.g2 ? `<script src="${data.base}/bin/g2.html.js"></script>` : ''}
  <script src="${data.base}/bin/navigation.js"></script>
  <span class="left">&copy; Dmitrij</span>
  <span class="center">powered by &mu;Jam &amp; <a href="https://code.visualstudio.com/">VSCode</a> &mdash; hosted by <a href="https://github.com/">GitHub</a></span>
  <span class="right"
        title="toggle light/dark theme"
        onclick="document.documentElement.className = document.documentElement.className === 'theme-dark' ? 'theme-light' : 'theme-dark';">
    &#9788;
  </span>
</footer>
</body>
</html>` 
},

navigation(data) {
  return `<!doctype html>
  <html${data.lang ? ` lang="${data.lang}"` : ''}>
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1,user-scalable=no">
  <meta name="description" content="${data.description || (data.title + ' - microjam page')}">
  ${data.authors ? `<meta name="authoraa" content="${data.authors.join()}">` : ''}
  ${data.date ? `<meta name="date" content="${new Date(data.date).toString()}">` : ''}
  ${data.tags ? `<meta name="keywords" content="${data.tags.join()}">` : ''}
  ${data.navigation || ''}
  <title>${data.title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@9.18.1/styles/tomorrow-night-bright.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.css">
  <link rel="stylesheet" href="${data.base}/theme/style.css">
  </head>
  <body id="nav">
  <main>
  <article>
  ${data.content}
  </article>
  </main>
  </body>
  </html>` 
},

// page layout ...
page(data) {
  return tmpl.base(data);
},
// article layout ...
article(data) {
  const articleContent = `<article>
  ${data.content}
</article>`;
  return tmpl.base(data);
},
// index layout ...
index(data) {
  data.content = `<article>
${data.content}
${data.articles.sort((a,b)=> a.date < b.date ? 1 : -1)  // sort decending ..
               .map(tmpl.articleEntry).join('')}
</article>`;
  return tmpl.base(data);
},

// article entry layout ... used for article list in index template
articleEntry(article) {
    return `<hr>
${tmpl.dateElement(article.date)}
<h3><a href="${article.reluri+'.html'}">${article.title}</a></h3>
${article.abstract || article.description}`;
},
// date element layout ... 
dateElement(date) {
  const d = new Date(date);
  return `<time datetime="${d}">${d.toString().substr(4,3)} ${d.getDate()}, ${d.getFullYear()}</time>`;
}

}
