// ==UserScript==
// @name         TinyGrail Exchange Plugin (Dev Loader)
// @namespace    TinyGrail Exchange Plugin
// @version      2.0.1
// @author       senken, mtcode
// @match        *://*.bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  const DEV_URL = 'https://cdn.jsdelivr.net/gh/senken/tinygrail@master/dist/userscript.user.js';
  const DEV_CSS_URL = 'https://cdn.jsdelivr.net/gh/senken/tinygrail@master/dist/userscript.css';

  // 动态引入css
  try {

    const existing = document.querySelector('link[data-tinygrail-dev-style="1"]');
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = DEV_CSS_URL + '?t=' + Date.now();
      link.dataset.tinygrailDevStyle = '1';
      document.documentElement.appendChild(link);
      console.log('[Dev Loader] injected CSS', link.href);
    }
  } catch (e) {
    console.warn('[Dev Loader] failed to inject CSS from DEV_URL', e);
  }

  console.log('[Dev Loader] fetching', DEV_URL);

  // 动态引入js
  GM_xmlhttpRequest({
    method: 'GET',
    url: DEV_URL,
    onload: function (response) {
      if (response.status !== 200) {
        console.error('[Dev Loader] HTTP ' + response.status);
        return;
      }

      try {
        eval(response.responseText);
        console.log('[Dev Loader] bundle loaded');
      } catch (e) {
        console.error('[Dev Loader] eval error', e);
      }
    },
    onerror: function (err) {
      console.error('[Dev Loader] request error', err);
    },
  });
})();
