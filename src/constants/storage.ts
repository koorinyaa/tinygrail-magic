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
 * 原始url存储键名
 */
export const ORIGINAL_URL_STORAGE_KEY = createStorageKey('originalUrl');
