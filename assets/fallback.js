import { convertShareToCssUrl, fetchCss } from './helpers.js';

document.addEventListener('alpine:init', () => {
  Alpine.data('fallback', () => ({
    showApp: true,
    url: '',
    webfonts: [],
    primary: {
      fontFamily: '',
      fontWeight: 400,
      fontStyle: '',
    },

    init() {
      console.log('hello');
    },

    // Fallback fonts: https://stackoverflow.com/a/62755574

    async processUrl() {
      let url = convertShareToCssUrl(this.url);

      document.querySelector('head').insertAdjacentHTML(
        'beforeend',
        `<link rel="stylesheet" href="${url}"/>`
      );

      let css = await fetchCss(url);
      let fontFamilies = [...css.matchAll(/font-family: '(.*)';/g)].map(item => item[1]);
      let fontWeights = [...css.matchAll(/font-weight: (\d+);/g)].map(item => item[1]);
      let fontStyles = [...css.matchAll(/font-style: (.*);/g)].map(item => item[1]);

      this.primary.fontFamily = fontFamilies[0];
      this.primary.fontWeight = fontWeights[0];
      this.primary.fontStyle = fontStyles[0];

      this.webfonts = [];
      for (const family of fontFamilies) {
        this.webfonts.push(family);
      }

      this.showApp = true;
    }
  }));
});
