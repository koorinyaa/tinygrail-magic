import { httpService, TinygrailBaseResponse } from '@/lib/http';

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
