import { AppStateProvider } from '@/components/app-state-provider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 初始化入口按钮
const initTinygrailButton = (element: HTMLElement): void => {
  const li = element.querySelector<HTMLLIElement>('li:nth-child(2)');
  if (li) {
    // 创建tinygrail按钮
    const tinygrailButtonLink = document.createElement('a');
    tinygrailButtonLink.href = 'javascript:void(0)'; // 阻止默认跳转行为
    tinygrailButtonLink.textContent = 'tinygrail';
    tinygrailButtonLink.id = 'tinygrailMagic'

    li.append(document.createTextNode(" | "))
    li.appendChild(tinygrailButtonLink);

    observer.disconnect();

    tinygrailButtonLink.addEventListener('click', handleTinygrailButtonClick);
  }
}

// 处理tinygrail按钮点击事件
const handleTinygrailButtonClick = (): void => {


  // 移动端缩放适配
  document.querySelector('meta[name="viewport"]')?.remove();
  const metaElement = document.createElement('meta')
  metaElement.name = 'viewport';
  metaElement.content = 'width=device-width, initial-scale=1';
  document.head.insertBefore(metaElement, document.head.firstChild);

  // 清除body元素和css
  document.body.replaceChildren();
  [...document.querySelectorAll('link[type="text/css"]')].forEach(link => link.remove());
  // 添加className
  document.body.classList.add('tinygrailMagic');

  // 设置字体大小
  document.documentElement.style.fontSize = "16px";

  // 处理 iOS 工具栏隐藏导致的视口高度变化
  const setViewportHeight = () => {
    // 优先使用 visualViewport，降级使用 innerHeight
    const vh = (window.visualViewport?.height ?? window.innerHeight) * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setViewportHeight();
  window.visualViewport?.addEventListener('resize', setViewportHeight);
  window.addEventListener('resize', setViewportHeight);

  // 禁止移动端下拉刷新行为
  document.documentElement.style.overscrollBehavior = "none";

  // 修改标题和图标
  document.title = '「小圣杯」最萌大战'
  document.head.querySelector<HTMLLinkElement>('link[type="image/x-icon"]')
    ?.setAttribute('href', 'https://tinygrail.com/favicon.ico');

  createReactDom()
}

const targetSelector = '#dock .content .clearit';

const observer = new MutationObserver((mutationsList: MutationRecord[], observer: MutationObserver): void => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).matches(targetSelector)) {
          initTinygrailButton(node as HTMLElement);
          observer.disconnect();
          return;
        }
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

const existingElement = document.querySelector<HTMLElement>(targetSelector);
if (existingElement) {
  initTinygrailButton(existingElement);
  observer.disconnect();
}

// 挂载ReactDOM
const createReactDom = (): void => {
  console.info('Initializing tinygrail-magic...')
  ReactDOM.createRoot(
    (() => {
      const app = document.createElement('div');
      app.className = "overflow-hidden"
      document.body.append(app);
      return app;
    })(),
  ).render(
    <React.StrictMode>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </React.StrictMode>,
  );
}

