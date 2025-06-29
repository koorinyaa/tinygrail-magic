/**
 * localStorage 键前缀
 */
export const STORAGE_PREFIX = 'tinygrail-magic';

/**
 * 生成localStorage存储键名
 * @param key 存储键名
 * @param version 版本号
 * @returns 带前缀和版本的完整键名
 */
export const createStorageKey = (key: string, version?: string): string => {
  return version ? `${STORAGE_PREFIX}:${key}:v${version}` : `${STORAGE_PREFIX}:${key}`;
};

/**
 * 原始Hash存储键名
 */
export const ORIGINAL_HASH_STORAGE_KEY = createStorageKey('originalHash');

/**
 * 原始页面标题存储键名
 */
export const ORIGINAL_PAGE_TITLE_STORAGE_KEY = createStorageKey('originalPageTitle');

/**
 * 原始viewport设置存储键名
 */
export const ORIGINAL_VIEWPORT_STORAGE_KEY = createStorageKey('originalViewport');
