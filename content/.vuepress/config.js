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
    ['link', { rel: 'preload', href: '/fonts/space-mono-v4-latin/space-mono-v4-latin-regular.woff2', as: 'font', type: 'font/woff2', crossorigin: "anonymous" }],
    ['link', { rel: 'preload', href: '/fonts/space-mono-v4-latin/space-mono-v4-latin-italic.woff2', as: 'font', type: 'font/woff2', crossorigin: "anonymous" }],
    ['link', { rel: 'preload', href: '/fonts/space-mono-v4-latin/space-mono-v4-latin-700.woff2', as: 'font', type: 'font/woff2', crossorigin: "anonymous" }],
    ['link', { rel: 'preload', href: '/fonts/space-mono-v4-latin/space-mono-v4-latin-700italic.woff2', as: 'font', type: 'font/woff2', crossorigin: "anonymous" }],
  ],
  markdown: {
    anchor: { permalink: false },
    extendMarkdown: md => {
      md.set({ breaks: true });
    }
  },
  dest: "./dist"
};
