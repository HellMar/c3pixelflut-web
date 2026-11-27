<template>
  <section class="layout">
    <c3pixelflut-header class="header"></c3pixelflut-header>
    <c3pixelflut-nav class="nav"></c3pixelflut-nav>

    <template v-if="$page.frontmatter.isHomepage">
      <section class="intro text card">
        <Content slot-key="intro-text"/>
      </section>
      <c3pixelflut-video class="intro video card" />
    </template>

    <main class="content">
      <Content/>
    </main>

    <c3pixelflut-footer class="footer"></c3pixelflut-footer>
  </section>
</template>

<script>
export default {}
</script>

<style>
html, body {
  /* 40C3 "Model Citizens" palette (Styleguide V1.4, CC0) */
  --color-dark: #031202;
  --color-neutral: #DFEED5;
  --color-primary: #75B54B;
  --color-additional-01: #13AEA3;
  --color-additional-02: #999FCD;
  --color-additional-03: #B78FBF;
  --color-additional-04: #EB5D9D;
  --color-additional-05: #EB6F83;
  --color-additional-06: #F28931;
  --color-additional-07: #FAB93E;
  --color-additional-08: #7EAE83;
  --color-additional-09: #3B5831;
  --color-additional-10: #B69D93;
  --color-additional-11: #584744;

  --foreground: var(--color-neutral);
  --background: var(--color-dark);
  --background-panel: rgba(3, 18, 2, 0.92);
  --background-off: rgba(59, 88, 49, 0.35);
  --accent: var(--color-primary);
  --hover: var(--color-additional-07);
  --shadow: rgba(0, 0, 0, 0.6);

  --font-body: "Hack", "DejaVu Sans Mono", monospace;
  --font-heading: "Jersey 10", "Hack", monospace;

  --max-site-width: 900px;
  --border-radius: 0;
  --box-shadow: 0 4px 16px var(--shadow);

  margin: 0;

  color: var(--foreground);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.6;

  background-color: var(--background);
}

::selection {
  color: var(--color-dark);
  background: var(--color-primary);
}

h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 400;
  letter-spacing: 0.025em;
  line-height: 1.1;
}
h1 {
  color: var(--accent);
  font-size: 2.8em;
  text-transform: uppercase;
}
h2 {
  font-size: 2.2em;
}
h3 {
  font-size: 1.7em;
}
h4, h5, h6 {
  font-family: var(--font-body);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-underline-offset: 0.2em;
}

a {
  color: var(--accent);
  font-weight: 700;
  text-underline-offset: 0.15em;
}
a:hover {
  color: var(--hover);
}
a:focus-visible {
  outline: 2px solid var(--hover);
  outline-offset: 2px;
}

strong {
  color: var(--color-neutral);
}

table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  text-align: left;
}
th {
  border-bottom: 2px solid var(--accent);
}
tr:nth-of-type(even) {
  background-color: var(--background-off);
}
tbody tr:hover {
  background-color: var(--color-additional-09);
}

code {
  font-family: var(--font-body);
  font-size: 0.95em;
  color: var(--color-additional-01);
}
pre {
  padding: 12px 16px;
  overflow-x: auto;

  border: 2px solid var(--color-additional-09);
  border-left: 6px solid var(--accent);
  background-color: #0a2109;
}
pre code {
  color: var(--color-neutral);
}

.layout {
  display: grid;
  grid-template-columns: 1fr repeat(2, minmax(100px, calc(var(--max-site-width) / 2))) 1fr;
  grid-template-areas:
    'header header header header'
    'nav nav nav nav'
    '. content-left content-right .'
    '. content content .'
    'footer footer footer footer';
  grid-gap: 0 16px;
}
@media (max-width: 700px) {
  .layout {
    grid-template-areas:
    'header header header header'
    'nav nav nav nav'
    '. content-left content-left .'
    '. content-right content-right .'
    '. content content .'
    'footer footer footer footer';
  }
}
.header {
  grid-area: header;
}
.nav {
  grid-area: nav;
  margin-bottom: 32px;
}
.content {
  grid-area: content;
}
.footer {
  grid-area: footer;
}

.intro.text {
  grid-area: content-left;
}
.intro.video {
  grid-area: content-right;
}

/* 40C3 "Dark Interface" infobox: dark panel, primary outline */
main, .card {
  z-index: 10;
  padding: 12px 32px;
  margin-bottom: 32px;
  min-width: 0;

  border: 2px solid var(--accent);
  border-radius: var(--border-radius);
  background-color: var(--background-panel);
  box-shadow: var(--box-shadow);
}
.intro.video {
  padding: 0;
}
@media (max-width: 700px) {
  main, .card {
    padding: 12px 22px;
  }
}
</style>

<style>
/* Fonts from the 40C3 design package, served locally */
@font-face {
  font-family: 'Hack';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/40c3/Hack-Regular.woff2') format('woff2'),
       url('/fonts/40c3/Hack-Regular.woff') format('woff');
}
@font-face {
  font-family: 'Hack';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/40c3/Hack-Italic.woff2') format('woff2'),
       url('/fonts/40c3/Hack-Italic.woff') format('woff');
}
@font-face {
  font-family: 'Hack';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/40c3/Hack-Bold.woff2') format('woff2'),
       url('/fonts/40c3/Hack-Bold.woff') format('woff');
}
@font-face {
  font-family: 'Hack';
  font-style: italic;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/40c3/Hack-BoldItalic.woff2') format('woff2'),
       url('/fonts/40c3/Hack-BoldItalic.woff') format('woff');
}
@font-face {
  font-family: 'Jersey 10';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/40c3/jersey-10-latin-400-normal.woff2') format('woff2'),
       url('/fonts/40c3/jersey-10-latin-400-normal.woff') format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Jersey 10';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/40c3/jersey-10-latin-ext-400-normal.woff2') format('woff2'),
       url('/fonts/40c3/jersey-10-latin-ext-400-normal.woff') format('woff');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
</style>
