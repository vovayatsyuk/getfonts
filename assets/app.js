import { downloadZip } from './zip.js';

async function fetchCss(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw 'Unable to fetch requested URL';
  }

  const contentType = response.headers.get('content-type');

  if (contentType.indexOf('text/css;') !== 0) {
    throw 'The requested URL does not return CSS response';
  }

  return response.text();
}

async function download(url) {
  const files = [];
  const css = await fetchCss(url);
  const matches = css.matchAll(/url\((?<url>.*?)\) format\(/g);

  for (const match of matches) {
    if (match.groups.url.indexOf('http') !== 0) {
      continue;
    }

    files.push({
        name: match.groups.url.replace('https://fonts.gstatic.com/s/', 'fonts/'),
        input: await fetch(match.groups.url),
    });
  }

  if (!files.length) {
    throw 'Unable to find fonts in requested CSS file';
  }

  files.push({
    name: 'css/fonts.css',
    input: css.replaceAll('https://fonts.gstatic.com/s/', '../fonts/'),
  });

  const blob = await downloadZip(files).blob();

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'fonts.zip';
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 10000);
}

function prepareUrl(url) {
  const share = 'https://fonts.google.com/share?selection.family=';

  if (url.indexOf(share) !== 0) {
    return url;
  }

  const fonts = url
    .replace(share, '')
    .replaceAll('%20', '+')
    .split('%7C')
    .join('&family=');

  return `https://fonts.googleapis.com/css2?family=${fonts}&display=swap`;
}

function showError(text) {
  document.getElementById('errorText').innerText = text;
  document.getElementById('error').style.display = '';
}

const loader = (function () {
  const icon = document.getElementById('loader');

  return {
    show() {
      icon.previousElementSibling.classList.add('opacity-0');
      icon.classList.remove('opacity-0');
    },
    hide() {
      icon.previousElementSibling.classList.remove('opacity-0');
      icon.classList.add('opacity-0');
    }
  }
})();

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();

  loader.show();

  download(prepareUrl(document.getElementById('url').value))
    .catch((e) => {
      showError(e);
    })
    .finally(() => {
      loader.hide();
    });
});

document.addEventListener('click', (e) => {
  if (!e.target.dataset.fontUrl) {
    return;
  }
  document.getElementById('url').value = e.target.dataset.fontUrl;
});

document.addEventListener('alpine:init', () => {
  Alpine.data('fallback', () => ({
    init() {
      console.log('hello');
    },
  }));
});

Alpine.start();
