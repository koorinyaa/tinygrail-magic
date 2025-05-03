import { getOssSignature, uploadToOss } from '@/api/tinygrail-oss';
import { httpService, TinygrailBaseResponse } from '@/lib/http';
import { dataURLtoBlob } from '@/lib/utils';

/**
 * 角色献祭数据
 * @property {number} Id - 道具ID
 * @property {string} Name - 道具名称
 * @property {string} Icon - 道具图标
 * @property {number} Count - 道具数量
 */
export interface SacrificeItem {
  Id: number;
  Name: string;
  Icon: string;
  Count: number;
}

export interface SacrificeResponse
  extends TinygrailBaseResponse<{
    Balance: number;
    Items: SacrificeItem[];
  }> {}

/**
 * 角色献祭
 * @param {number} characterId - 角色ID
 * @param {number} amount - 献祭数量
 * @param {boolean} isFinancing - false为献祭，true为股权融资
 * @returns {Promise<SacrificeResponse>} - 献祭结果
 */
export async function sacrificeCharacter(
  characterId: number,
  amount: number,
  isFinancing: boolean = false
): Promise<SacrificeResponse> {
  try {
    return await httpService.post<SacrificeResponse>(
      `/chara/sacrifice/${characterId}/${amount}/${isFinancing}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 角色精炼
 * @param {number} characterId - 角色ID
 * @returns {Promise<TinygrailBaseResponse<string>>} - 精炼结果
 */
export async function refine(
  characterId: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      `/magic/refine/${characterId}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 上传圣殿图片
 * @param {number} characterId - 角色ID
 * @param {string} imageDataUrl - 图片数据URL
 * @param {string} imageType - 图片类型
 * @param {string} hash - 图片哈希
 * @returns {Promise<TinygrailBaseResponse<string>>} - 上传结果
 */
export async function uploadTempleImage(
  characterId: number,
  imageDataUrl: string,
  imageType: string,
  hash: string
): Promise<TinygrailBaseResponse<string>> {
  try {
    // 转换为Blob对象
    const blob = dataURLtoBlob(imageDataUrl);

    // 获取OSS签名
    const ossSignatureResponse = await getOssSignature(
      'cover',
      hash,
      encodeURIComponent(imageType)
    );

    if (ossSignatureResponse.State !== 0) {
      throw new Error(ossSignatureResponse.Message || '获取签名失败');
    }

    // 上传到OSS
    await uploadToOss(
      'cover',
      hash,
      blob,
      imageType,
      ossSignatureResponse.Value
    );

    // 更新角色头像
    return await httpService.post<TinygrailBaseResponse<string>>(
      `/chara/temple/cover/${characterId}`,
      `https://tinygrail.oss-cn-hangzhou.aliyuncs.com/cover/${hash}.jpg`
    );
  } catch (error) {
    throw error;
  }
}
