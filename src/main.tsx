import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 初始化入口按钮
const initTinygrailButton = (): void => {
  // 创建tinygrail按钮
  const tinygrailButtonLink = document.createElement('div');
  tinygrailButtonLink.id = 'tinygrailMagicButton';
  document.body.appendChild(tinygrailButtonLink);

  tinygrailButtonLink.addEventListener('click', handleTinygrailButtonClick);
};

// 处理tinygrail按钮点击事件
const handleTinygrailButtonClick = (): void => {
  // 移动端缩放适配
  document.querySelector('meta[name="viewport"]')?.remove();
  const metaElement = document.createElement('meta');
  metaElement.name = 'viewport';
  metaElement.content = 'width=device-width, initial-scale=1';
  document.head.insertBefore(metaElement, document.head.firstChild);

  // 清除body元素和css
  document.body.replaceChildren();
  [...document.querySelectorAll('link[type="text/css"]')].forEach((link) =>
    link.remove()
  );

  // 添加className
  document.body.className = 'tinygrailMagic';

  // 设置字体大小
  document.documentElement.style.fontSize = '16px';

  // 禁止移动端下拉刷新行为
  document.documentElement.style.overscrollBehavior = 'none';

  // 修改标题和图标
  document.title = '「小圣杯」最萌大战';
  document.head
    .querySelector<HTMLLinkElement>('link[type="image/x-icon"]')
    ?.setAttribute('href', 'https://tinygrail.com/favicon.ico');

  createReactDom();
};

// 检查当前页面是否在iframe中
const isNotInIframe = (): boolean => {
  return window.self === window.top;
};

if (isNotInIframe()) {
  initTinygrailButton();
}

// 挂载ReactDOM
const createReactDom = (): void => {
  console.info('Initializing tinygrail-magic...');
  
  // 创建一个专用的容器元素
  const rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
  
  // 将React应用挂载到专用容器上
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};
