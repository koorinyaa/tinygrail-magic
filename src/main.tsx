import App from '@/App';
import { initializePage, isTinygrailMagicHash } from '@/utils/initializers';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import cssText from './index.css?inline';

/**
 * 挂载App
 */
const initShadowDOMApp = (): void => {
  let targetDocument: Document;

  try {
    // 尝试获取顶层窗口
    const topWindow = window.top;
    if (topWindow) {
      targetDocument = topWindow.document;
    } else {
      return;
    }
  } catch (e) {
    console.warn('无法访问顶层窗口');
    return;
  }

  // 检查是否已经存在容器
  const existingContainer = targetDocument.getElementById('tinygrailMagicContainer');
  if (existingContainer) {
    console.warn('已存在tinygrailMagic容器，跳过初始化');
    return;
  }

  // 创建一个与body同级的容器
  const container = targetDocument.createElement('div');
  container.id = 'tinygrailMagicContainer';
  targetDocument.documentElement.appendChild(container);

  // 创建shadowDOM
  const shadowRoot = container.attachShadow({ mode: 'open' });

  // 动态创建样式表
  const styleElement = targetDocument.createElement('style');
  styleElement.textContent = cssText;
  shadowRoot.appendChild(styleElement);

  // 在shadowDOM中创建挂载点
  const mountPoint = targetDocument.createElement('div');
  mountPoint.id = 'tinygrailMagicRoot';
  shadowRoot.appendChild(mountPoint);

  // 挂载App
  ReactDOM.createRoot(mountPoint).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>,
  );
};

initShadowDOMApp();

/**
 * 如果当前页面hash值为tinygrailMagic，则直接初始化页面
 */
if (isTinygrailMagicHash()) {
  initializePage();
}
