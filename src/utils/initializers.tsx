import {
  APP_TITLE,
  ORIGINAL_HASH_STORAGE_KEY,
  ORIGINAL_PAGE_TITLE_STORAGE_KEY,
  ORIGINAL_VIEWPORT_STORAGE_KEY,
} from '@/constants';

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
 * 将原始hash值保存到会话存储
 */
export const saveOriginalHash = (): void => {
  const currentHash = window.location.hash;

  if (isTinygrailMagicHash()) {
    // 如果hash为#/tinygrailMagic，则保存空字符串
    sessionStorage.setItem(ORIGINAL_HASH_STORAGE_KEY, '');
  } else {
    // 否则保存当前hash
    sessionStorage.setItem(ORIGINAL_HASH_STORAGE_KEY, currentHash);
  }
};

/**
 * 清除会话存储中的原始hash值
 */
export const clearOriginalHash = (): void => {
  sessionStorage.removeItem(ORIGINAL_HASH_STORAGE_KEY);
};

/**
 * 清除URL的hash值
 */
export const clearUrlHash = (): void => {
  saveOriginalHash();
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  url.hash = '';
  window.history.replaceState({}, '', url.toString());
};

/**
 * 恢复URL的原始hash值
 */
export const restoreOriginalHash = (): void => {
  const originalHash = sessionStorage.getItem(ORIGINAL_HASH_STORAGE_KEY);
  if (originalHash !== null) {
    window.location.hash = originalHash;
  }
  clearOriginalHash();
};

/**
 * 保存原始页面标题到会话存储
 */
export const saveOriginalPageTitle = (): void => {
  const originalPageTitle = document.title;
  sessionStorage.setItem(ORIGINAL_PAGE_TITLE_STORAGE_KEY, originalPageTitle);
};

/**
 * 清除会话存储中的原始页面标题
 */
export const clearOriginalPageTitle = (): void => {
  sessionStorage.removeItem(ORIGINAL_PAGE_TITLE_STORAGE_KEY);
};

/**
 * 设置页面标题
 */
export const setupPageTitle = (): void => {
  saveOriginalPageTitle();
  document.title = APP_TITLE;
};

/**
 * 恢复原始页面标题
 */
export const restoreOriginalPageTitle = (): void => {
  const originalPageTitle = sessionStorage.getItem(ORIGINAL_PAGE_TITLE_STORAGE_KEY);
  if (originalPageTitle) {
    document.title = originalPageTitle;
  }
  clearOriginalPageTitle();
};

/**
 * 保存原始viewport设置
 */
export const saveOriginalViewport = (): void => {
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    // 保存原始viewport内容
    const originalContent = viewportMeta.getAttribute('content') || '';
    sessionStorage.setItem(ORIGINAL_VIEWPORT_STORAGE_KEY, originalContent);
  }
};

/**
 * 清除会话存储中的原始viewport设置
 */
export const clearOriginalViewport = (): void => {
  sessionStorage.removeItem(ORIGINAL_VIEWPORT_STORAGE_KEY);
};

/**
 * 设置移动设备viewport
 */
export const setupMobileViewport = (): void => {
  saveOriginalViewport();

  document.querySelector('meta[name="viewport"]')?.remove();

  const metaElement = document.createElement('meta');
  metaElement.name = 'viewport';
  metaElement.content = 'width=device-width, initial-scale=1';
  document.head.insertBefore(metaElement, document.head.firstChild);
};

/**
 * 恢复原始viewport设置
 */
export const restoreOriginalViewport = (): void => {
  const originalViewport = sessionStorage.getItem(ORIGINAL_VIEWPORT_STORAGE_KEY);

  document.querySelector('meta[name="viewport"]')?.remove();

  if (originalViewport !== null) {
    const metaElement = document.createElement('meta');
    metaElement.name = 'viewport';
    metaElement.content = originalViewport;
    document.head.insertBefore(metaElement, document.head.firstChild);
  }

  clearOriginalViewport();
};

/**
 * 隐藏body
 */
export const hideBody = (): void => {
  document.body.style.display = 'none';
};

/**
 * 显示body
 */
export const showBody = (): void => {
  document.body.style.display = 'block';
};

/**
 * 初始化页面
 */
export const initializePage = (): void => {
  clearUrlHash();
  setupPageTitle();
  setupMobileViewport();
  hideBody();
};

/**
 * 恢复页面
 */
export const restorePage = (): void => {
  restoreOriginalHash();
  restoreOriginalPageTitle();
  restoreOriginalViewport();
  showBody();
};
