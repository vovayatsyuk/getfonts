import { convertShareToCssUrl, fetchCss } from './helpers.js';

document.addEventListener('alpine:init', () => {
  Alpine.data('fallback', () => ({
    showApp: true,
    url: '',
    text: 'Type your text here',
    webfonts: {},
    primary: {
      fontFamily: '',
      fontWeight: 400,
      fontStyle: '',
      fontSize: 64,
    },
    fallbacks: {
      'Sans-Serif': {
        'Arial': 'Arial (Win, Mac)',
        'Helvetica': 'Helvetica (Mac)',
        'Liberation Sans': 'Liberation Sans (Ubuntu)',
        'Tahoma': 'Tahoma (Win, Mac)',
      },
      'Serif': {
        'Baskerville': 'Baskerville (Mac)',
        'Hoefler Text': 'Hoefler Text (Mac)',
        'Liberation Serif': 'Liberation Serif (Ubuntu)',
        'Times New Roman': 'Times New Roman (Win, Mac?)',
      }
    },
    fallback: {
      fontFamily: 'Arial',
      fontWeight: 400,
    },

    init() {
      setTimeout(() => {
        if (navigator.platform.includes('Linux')) {
          this.fallback.fontFamily = 'Liberation Sans';
        }
      }, 20);

      new ResizeObserver((event) => {
        this.$refs.primaryContent.style.width = this.$refs.fallbackContent.style.width;
        this.$refs.primaryContent.style.height = this.$refs.fallbackContent.style.height;
      }).observe(this.$refs.fallbackContent);
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

      this.webfonts = {};
      for (const [i, family] of fontFamilies.entries()) {
        if (!this.webfonts[family]) {
          this.webfonts[family] = {
            weights: [],
            styles: [],
          };
        }

        if (!this.webfonts[family].weights.includes(fontWeights[i])) {
          this.webfonts[family].weights.push(fontWeights[i]);
        }

        if (!this.webfonts[family].styles.includes(fontStyles[i])) {
          this.webfonts[family].styles.push(fontStyles[i]);
        }
      }

      this.showApp = true;
    }
  }));
});
