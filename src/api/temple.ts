import { TempleItem } from '@/api/character';
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

/**
 * 重置圣殿图片
 * @param {number} characterId - 角色ID
 * @param {number} userId - 用户ID
 * @returns {Promise<TinygrailBaseResponse<TempleItem>>} - 重置结果
 */
export async function resetTempleImage(
  characterId: number,
  userId: number
): Promise<TinygrailBaseResponse<TempleItem>> {
  try {
    return await httpService.post<TinygrailBaseResponse<TempleItem>>(
      `chara/temple/cover/reset/${characterId}/${userId}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 角色链接
 * @param {number} sourceCharacterId - 源角色ID
 * @param {number} targetCharacterId - 目标角色ID
 * @returns {Promise<TinygrailBaseResponse<string>>} - 链接结果
 */
export async function templeLink(
  sourceCharacterId: number,
  targetCharacterId: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      `chara/link/${sourceCharacterId}/${targetCharacterId}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 修改台词
 * @param {number} characterId - 角色ID
 * @param {string} line - 台词
 * @returns {Promise<TinygrailBaseResponse<string>>} - 修改结果
 */
export async function changeLine(
  characterId: number,
  line: string
): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      `chara/temple/line/${characterId}`,
      line
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 拆除圣殿
 * @param {number} characterId - 角色ID
 * @returns {Promise<TinygrailBaseResponse<string>>} - 拆除结果
 */
export async function destroyTemple(
  characterId: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      `chara/temple/destroy/${characterId}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 转换星之力
 * @param {number} characterId - 角色ID
 * @param {number} amount - 转换数量
 * @returns {Promise<TinygrailBaseResponse<string>>} - 转换结果
 */
export async function convertStarForces(
  characterId: number,
  amount: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      `chara/star/${characterId}/${amount}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 精炼排行数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 数据总数
 * @property {number} ItemsPerPage - 每页数量
 * @property {TempleItem[]} Items - 圣殿列表
 * @property {any} Context - 上下文信息
 */
export interface RefineRankValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: TempleItem[];
  Context: any | null;
}

/**
 * 获取精炼排行数据
 * @param {number} [page] - 页码
 * @param {number} [pageSize] - 每页数量
 * @returns {Promise<TinygrailBaseResponse<RefineRankValue>>} - 精炼排行数据
 */
export async function getRefineRank(
  page: number = 1,
  pageSize: number = 24
): Promise<TinygrailBaseResponse<RefineRankValue>> {
  try {
    return await httpService.get<TinygrailBaseResponse<RefineRankValue>>(
      `/chara/refine/temple/${page}/${pageSize}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 最近链接数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 数据总数
 * @property {number} ItemsPerPage - 每页数量
 * @property {TempleItem[]} Items - 圣殿列表
 * @property {any} Context - 上下文信息
 */
export interface RecentLinkValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: TempleItem[];
  Context: any | null;
}

/**
 * 获取最近圣殿链接记录
 * @param {number} [page] - 页码
 * @param {number} [pageSize] - 每页数量
 * @returns {Promise<TinygrailBaseResponse<RecentLinkValue>>} - 最近圣殿链接数据
 */
export async function getRecentLinks(
  page: number = 1,
  pageSize: number = 48
): Promise<TinygrailBaseResponse<RecentLinkValue>> {
  try {
    return await httpService.get<TinygrailBaseResponse<RecentLinkValue>>(
      `/chara/link/last/${page}/${pageSize}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 最近圣殿数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 数据总数
 * @property {number} ItemsPerPage - 每页数量
 * @property {TempleItem[]} Items - 圣殿列表
 * @property {any} Context - 上下文信息
 */
export interface RecentTempleValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: TempleItem[];
  Context: any | null;
}

/**
 * 获取最近圣殿记录
 * @param {number} [page] - 页码
 * @param {number} [pageSize] - 每页数量
 * @returns {Promise<TinygrailBaseResponse<RecentTempleValue>>} - 最近圣殿数据
 */
export async function getRecentTemples(
  page: number = 1,
  pageSize: number = 12
): Promise<TinygrailBaseResponse<RecentTempleValue>> {
  try {
    return await httpService.get<TinygrailBaseResponse<RecentTempleValue>>(
      `/chara/temple/last/${page}/${pageSize}`
    );
  } catch (error) {
    throw error;
  }
}
