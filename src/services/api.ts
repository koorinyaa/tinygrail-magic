// 小圣杯服务器地址
export const BASE_URL = 'https://tinygrail.com/api';

// 处理查询参数
export const withQuery = (url: string, params?: Record<string, any>) => {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return queryString ? `${url}?${queryString}` : url;
};
