'use strict';
(async () => {
  for (const src of ['data.js', 'core.js', 'trackers.js']) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Could not load ${src}`));
      document.head.appendChild(script);
    });
  }
})().catch(error => {
  console.error(error);
  document.body.insertAdjacentHTML('afterbegin', '<p class="noscript">Dyno Health could not load. Refresh the page or check the site files.</p>');
});
