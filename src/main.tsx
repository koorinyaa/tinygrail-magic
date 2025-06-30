import TinygrailMagicLauncher from '@/components/TinygrailMagicLauncher';
import { initializePage, isNotInIframe, isTinygrailMagicHash } from '@/utils/initializers';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

/**
 * 挂载小圣杯启动器
 */
const mountTinygrailMagicLauncher = () => {
  const rootElement = document.createElement('div');
  rootElement.className = 'tinygrailMagic';
  document.body.appendChild(rootElement);

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <TinygrailMagicLauncher />
    </React.StrictMode>,
  );
};

// 如果当前页面不在iframe中，则挂载小圣杯启动器
if (isNotInIframe()) {
  mountTinygrailMagicLauncher();
}

// 如果当前页面hash值为tinygrailMagic，则直接初始化页面
if (isTinygrailMagicHash()) {
  initializePage();
}
