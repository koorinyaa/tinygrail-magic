import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const TINYGRAIL_CDN_URL = 'https://tinygrail.mange.cn';

/**
 * 合并className
 * @param {ClassValue[]} inputs - 类名字符串
 * @returns {string}
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 解码HTML实体
 * @param {string} str - 字符串
 * @returns {string}
 */
export function decodeHTMLEntities(str: string): string {
  const parser = new DOMParser();
  return parser.parseFromString(str, "text/html").documentElement.textContent || str;
}

/**
 * 判断是否为空
 * @param {T} value - 值
 * @returns {boolean}
 */
export function isEmpty<T>(value: T): boolean {
  if (value === null || value === undefined) return true;

  if (typeof value === 'string' || Array.isArray(value))
    return value.length === 0;

  if (value instanceof Map || value instanceof Set)
    return value.size === 0;

  if (typeof value === 'object')
    return Object.keys(value).length === 0;

  return false;
}

/**
 * 格式化货币
 * @param {number} value - 值
 * @param {Object} options - 选项
 * @param {number} options.maximumFractionDigits - 最大小数位数
 * @param {boolean} options.round - 是否四舍五入
 * @param {boolean} options.useWUnit - 是否使用万单位转换
 * @returns {string}
 */
export function formatCurrency(
  value: number,
  options?: {
    maximumFractionDigits?: number;
    round?: boolean;
    useWUnit?: boolean;
  }
): string {
  const shouldConvert = options?.useWUnit && Math.abs(value) >= 100000;
  const convertedValue = shouldConvert ? value / 10000 : value;

  const isInteger = Number.isInteger(convertedValue);
  const maxDigits = options?.maximumFractionDigits ?? (isInteger ? 0 : 2);
  const minDigits = 0;
  const useRounding = options?.round && !isInteger;

  let result = convertedValue.toLocaleString("en-US", {
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: minDigits,
    useGrouping: true,
    ...(useRounding ? { roundingMode: "halfExpand" as const } : {}),
  });

  return shouldConvert ? `${result}w` : result;
}

/**
 * 格式化货整数
 * @param {number} value - 值
 * @param {boolean} [useWUnit] - 是否使用万单位转换
 * @returns {string}
 */
export function formatInteger(value: number, useWUnit?: boolean): string {
  return formatCurrency(value, { maximumFractionDigits: 0, useWUnit: useWUnit });
}

/**
 * 获取封面URL
 * @param {string} cover - 封面
 * @param {'large' | 'medium' | 'small'} size - 尺寸
 * @returns {string}
 */
export function getCoverUrl(
  cover: string,
  size: 'large' | 'medium' | 'small' = 'small'
): string {
  const config = {
    large: {
      pathPattern: '/crt/m/',
      replaceTo: '/l/',
      cdnSuffix: '!w480'
    },
    medium: {
      pathPattern: '/crt/g/',
      replaceTo: '/m/',
      cdnSuffix: '!w240'
    },
    small: {
      pathPattern: '/crt/g/',
      replaceTo: '/m/',
      cdnSuffix: '!w150'
    }
  }[size];

  if (isEmpty(cover)) {
    return '';
  }

  if (cover.includes(config.pathPattern)) {
    return cover.replace(config.pathPattern, config.replaceTo);
  }

  if (cover.startsWith('https://tinygrail.oss-cn-hangzhou.aliyuncs.com/')) {
    return `${TINYGRAIL_CDN_URL}${cover.slice(46)}${config.cdnSuffix}`;
  }

  if (cover.startsWith('/cover')) {
    return `${TINYGRAIL_CDN_URL}${cover}${config.cdnSuffix}`;
  }

  return cover;
}

/**
 * 获取头像URL
 * @param {string | null | undefined} avatar - 头像
 * @returns {string}
 */
export function getAvatarUrl(avatar: string | null | undefined): string {
  if (!avatar) return '//lain.bgm.tv/pic/user/l/icon.jpg';

  if (avatar.startsWith('https://tinygrail.oss-cn-hangzhou.aliyuncs.com/'))
    return `${TINYGRAIL_CDN_URL}${avatar.slice(46)}!w120`;

  if (avatar.startsWith('/avatar'))
    return `${TINYGRAIL_CDN_URL}${avatar}!w120`;

  return avatar.replace('http://', '//');
}

/**
 * 格式化日期时间
 * @param {string} dateString - 日期时间字符串
 * @returns {string}
 */
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(dateString)).replace(/(\d+)\/(\d+)\/(\d+),?/, '$1年$2月$3日 ');
}
