import TinygrailMagicLauncherButton from '@/components/TinygrailMagicLauncherButton';
import {
  initializePage,
  isNotInIframe,
  isTinygrailMagicHash,
} from '@/utils/initializers';
import ReactDOM from 'react-dom/client';
import './index.css';

/**
 * 初始化tinygrailMagic启动器按钮
 */
const initTinygrailMagicLauncherButton = (): void => {
  const container = document.createElement('div');
  container.className = 'tinygrailMagic';
  document.body.appendChild(container);

  ReactDOM.createRoot(container).render(<TinygrailMagicLauncherButton />);
};

/**
 * 如果当前页面不在iframe中，则初始化tinygrailMagic启动器按钮
 */
if (isNotInIframe()) {
  initTinygrailMagicLauncherButton();
}

/**
 * 如果当前页面hash值为tinygrailMagic，则直接初始化页面
 */
if (isTinygrailMagicHash()) {
  initializePage();
}
