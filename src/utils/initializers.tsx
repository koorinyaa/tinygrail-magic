import App from '@/App';
import { ORIGINAL_URL_STORAGE_KEY } from '@/constants';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

/**
 * 检查当前页面是否在iframe中
 */
export const isNotInIframe = (): boolean => {
  return window.self === window.top;
};

/**
 * 判断当前页面的hash是否为#/tinygrailMagic
 */
export const isTinygrailMagicHash = (): boolean => {
  return window.location.hash === '#/tinygrailMagic';
};

/**
 * 保存原始URL到会话存储
 */
export const saveOriginalUrl = (): void => {
  const currentUrl = window.location.href;

  if (isTinygrailMagicHash()) {
    // 如果hash为#/tinygrailMagic，则保存去除hash的url
    const url = new URL(currentUrl);
    url.hash = '';
    sessionStorage.setItem(ORIGINAL_URL_STORAGE_KEY, url.toString());
  } else {
    // 否则保存完整url
    sessionStorage.setItem(ORIGINAL_URL_STORAGE_KEY, currentUrl);
  }
};

/**
 * 清除URL的hash值
 */
export const clearUrlHash = (): void => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  url.hash = '';
  window.history.replaceState({}, '', url.toString());
};

/**
 * 设置移动端视口
 */
export const setupMobileViewport = (): void => {
  document.querySelector('meta[name="viewport"]')?.remove();
  const metaElement = document.createElement('meta');
  metaElement.name = 'viewport';
  metaElement.content = 'width=device-width, initial-scale=1';
  document.head.insertBefore(metaElement, document.head.firstChild);
};

/**
 * 清除页面内容和样式
 */
export const clearPageContent = (): void => {
  document.body.replaceChildren();
  [...document.querySelectorAll('link[type="text/css"]')].forEach((link) => link.remove());
};

/**
 * 设置文档样式
 */
export const setupDocumentStyle = (): void => {
  // 添加className
  document.body.className = 'tinygrailMagic';

  // 设置字体大小
  document.documentElement.style.fontSize = '16px';

  // 禁止移动端下拉刷新行为
  document.documentElement.style.overscrollBehavior = 'none';
};

/**
 * 设置页面标题和图标
 */
export const setupPageTitleAndIcon = (): void => {
  document.title = '「小圣杯」最萌大战';
  document.head
    .querySelector<HTMLLinkElement>('link[type="image/x-icon"]')
    ?.setAttribute('href', 'https://tinygrail.com/favicon.ico');
};

/**
 * 挂载React应用
 */
export const mountReactApp = (): void => {
  const rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>,
  );
};

/**
 * 初始化页面
 */
export const initializePage = (): void => {
  saveOriginalUrl();
  clearUrlHash();
  setupMobileViewport();
  clearPageContent();
  setupDocumentStyle();
  setupPageTitleAndIcon();
  mountReactApp();
};
