function convertShareToCssUrl(url) {
  const prefix = 'https://fonts.google.com/share?selection.family=';

  if (url.indexOf(prefix) !== 0) {
    return url;
  }

  const fonts = url
    .replace(prefix, '')
    .replaceAll('%20', '+')
    .split('%7C')
    .join('&family=');

  return `https://fonts.googleapis.com/css2?family=${fonts}&display=swap`;
}

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

export {
  convertShareToCssUrl,
  fetchCss,
}
