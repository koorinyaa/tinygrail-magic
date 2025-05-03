import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

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
  return (
    parser.parseFromString(str, 'text/html').documentElement.textContent || str
  );
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

  if (value instanceof Map || value instanceof Set) return value.size === 0;

  if (typeof value === 'object') return Object.keys(value).length === 0;

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

  let result = convertedValue.toLocaleString('en-US', {
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: minDigits,
    useGrouping: true,
    ...(useRounding ? { roundingMode: 'halfExpand' as const } : {}),
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
  return formatCurrency(value, {
    maximumFractionDigits: 0,
    useWUnit: useWUnit,
  });
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
      cdnSuffix: '!w480',
    },
    medium: {
      pathPattern: '/crt/g/',
      replaceTo: '/m/',
      cdnSuffix: '!w240',
    },
    small: {
      pathPattern: '/crt/g/',
      replaceTo: '/m/',
      cdnSuffix: '!w150',
    },
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
 * @param {'large' |'medium' |'small'} size - 尺寸
 * @returns {string}
 */
export function getAvatarUrl(
  avatar: string | null | undefined,
  size: 'large' | 'medium' | 'small' = 'small'
): string {
  const config = {
    large: {
      cdnSuffix: '!w480',
    },
    medium: {
      cdnSuffix: '!w240',
    },
    small: {
      cdnSuffix: '!w120',
    },
  }[size];

  if (!avatar) return '//lain.bgm.tv/pic/user/l/icon.jpg';

  if (avatar.startsWith('https://tinygrail.oss-cn-hangzhou.aliyuncs.com/'))
    return `${TINYGRAIL_CDN_URL}${avatar.slice(46)}${config.cdnSuffix}`;

  if (avatar.startsWith('/avatar'))
    return `${TINYGRAIL_CDN_URL}${avatar}${config.cdnSuffix}`;

  return avatar.replace('http://', '//');
}

/**
 * 格式化日期时间
 * @param {string} dateString - 日期时间字符串
 * @returns {string}
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
      .format(date)
      .replace(/(\d+)\/(\d+)\/(\d+),?/, '$1年$2月$3日 ');
  } catch (e) {
    console.error(e);
    return '';
  }
}

/**
 * 将Data URL转换为Blob对象
 * @param {string} dataUrl - Data URL字符串
 * @returns {Blob} - 转换后的Blob对象
 */
export function dataURLtoBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * 调整图片尺寸并转换格式
 * @param {string} dataUrl - 原始图片的Data URL
 * @param {Object} options - 转换选项
 * @param {number} options.width - 目标宽度
 * @param {number} options.height - 目标高度
 * @param {string} [options.type='image/jpeg'] - 输出图片格式
 * @param {boolean} [options.smoothing=true] - 是否启用平滑处理
 * @param {'low' | 'medium' | 'high'} [options.quality='high'] - 平滑质量
 * @returns {Promise<string>} - 处理后的Data URL
 */
export function resizeImage(
  dataUrl: string,
  options: {
    width: number;
    height: number;
    type?: string;
    smoothing?: boolean;
    quality?: 'low' | 'medium' | 'high';
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = dataUrl;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = options.width;
      canvas.height = options.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建Canvas上下文'));
        return;
      }

      // 设置图像平滑
      ctx.imageSmoothingEnabled = options.smoothing ?? true;
      ctx.imageSmoothingQuality = options.quality ?? 'high';

      // 绘制图像
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        options.width,
        options.height
      );

      // 转换为指定格式的Data URL
      resolve(canvas.toDataURL(options.type ?? 'image/jpeg'));
    };

    image.onerror = () => {
      reject(new Error('图片加载失败'));
    };
  });
}

/**
 * 错误通知
 * @param {string} message - 错误消息
 */
export function notifyError(message: string) {
  console.error(message);
  toast.error(message);
}

/** 
 * @param {number} ms - 毫秒数
 * @returns {Promise<void>}
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
