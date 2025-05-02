import { TinygrailBaseResponse, httpService } from "@/lib/http";

export interface OssSignatureValue {
  Key: string;
  Sign: string;
  Date: string;
}

export interface OssSignatureResponse extends TinygrailBaseResponse<OssSignatureValue> { }
/**
 * 获取OSS签名信息
 * @param {string} path - 存储路径
 * @param {string} hash - 文件哈希值
 * @param {string} type - 文件MIME类型（需要编码）
 * @returns {Promise<TinygrailBaseResponse<OssSignatureValue>>} - OSS签名信息
 */
export async function getOssSignature(
  path: string,
  hash: string,
  type: string
): Promise<OssSignatureResponse> {
  try {
    return await httpService.post<OssSignatureResponse>(
      `/chara/oss/sign/${path}/${hash}/${type}`,
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 上传图片到OSS
 * @param {string} path - 存储路径
 * @param {string} hash - 文件哈希值
 * @param {Blob} blob - 要上传的文件Blob对象
 * @param {string} contentType - 文件MIME类型
 * @param {OssSignatureValue} signature - OSS签名信息
 * @returns {Promise<null>} - 返回上传后的文件URL
 */
export async function uploadToOss(
  path: string,
  hash: string,
  blob: Blob,
  contentType: string,
  signature: OssSignatureValue
): Promise<null> {
  try {
    return await httpService.put(`https://tinygrail.oss-cn-hangzhou.aliyuncs.com/${path}/${hash}.jpg`, blob, {
      headers: {
        'Content-Type': contentType,
        'Authorization': `OSS ${signature.Key}:${signature.Sign}`,
        'x-oss-date': signature.Date
      }
    });
  } catch (error) {
    throw error;
  }
}