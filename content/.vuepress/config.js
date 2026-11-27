module.exports = {
  title: "c3Pixelflut",
  description: "Pixelflut auf dem Chaos Communication Congress",
  locales: {
    // Vuepress uses the default lang-attribute 'en-US'
    "/": {
      lang: "de-DE" // this will be set as the lang attribute on <html>
    }
  },
  head: [
    ['meta', { name: 'theme-color', content: '#031202' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'preload', href: '/fonts/40c3/Hack-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: "anonymous" }],
    ['link', { rel: 'preload', href: '/fonts/40c3/Hack-Bold.woff2', as: 'font', type: 'font/woff2', crossorigin: "anonymous" }],
    ['link', { rel: 'preload', href: '/fonts/40c3/jersey-10-latin-400-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: "anonymous" }],
  ],
  markdown: {
    anchor: { permalink: false },
    extendMarkdown: md => {
      md.set({ breaks: true });
    }
  },
  dest: "./dist"
};
