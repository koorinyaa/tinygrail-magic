import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

/**
 * 小圣杯服务器通用响应结构
 * @template T - 响应数据的类型
 * @property {number} State - 状态码，通常为 0 表示成功，非 0 表示失败
 * @property {T} Value - 响应数据
 * @property {string} [Message] - 可选的错误消息，当 State 不为 0 时存在
 */
export interface TinygrailBaseResponse<T> {
  State: number;
  Value: T;
  Message?: string;
}

export class HttpService {
  private instance: AxiosInstance;

  constructor(baseURL: string, timeout: number = 10000) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        config.withCredentials = config.withCredentials ?? true;
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => {
        if (error.response) {
          const { status } = error.response;
          switch (status) {
            case 401:
              console.error('未授权，请重新登录');
              break;
            case 403:
              console.error('拒绝访问');
              break;
            case 500:
              console.error('服务器错误');
              break;
            default:
              console.error(`请求错误：${status}`);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      return await this.instance(config);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public get<T = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request({ method: 'get', url, params, ...config });
  }

  public post<T = any>(
    url: string,
    data?: object | string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request({
      method: 'post',
      url,
      data: JSON.stringify(data),
      ...config,
    });
  }

  public put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request({ method: 'put', url, data, ...config });
  }

  public delete<T = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request({ method: 'delete', url, params, ...config });
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(
        `请求失败：${error.response.status} ${
          error.response.data?.message || ''
        }`
      );
    }
    return new Error('网络连接异常，请检查网络设置');
  }
}

export const httpService = new HttpService('https://tinygrail.com/api');
