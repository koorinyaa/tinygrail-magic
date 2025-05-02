import { httpService, TinygrailBaseResponse } from '@/lib/http';
import { TempleItem } from './character';

export const AUTHORIZE_URL =
  'https://bgm.tv/oauth/authorize?response_type=code&client_id=bgm2525b0e4c7d93fec&redirect_uri=https%3A%2F%2Ftinygrail.com%2Fapi%2Faccount%2Fcallback';

/**
 * 用户资产数据
 * @property {number} Id - 用户内部ID
 * @property {string} Name - 用户name
 * @property {string} Avatar - 用户头像
 * @property {string} Nickname - 用户昵称
 * @property {number} Balance - 用户余额
 * @property {number} Assets - 用户总资产
 * @property {number} Type - 用户类型
 * @property {number} State - 用户状态
 * @property {number} LastIndex - 用户资产排名
 * @property {boolean} ShowWeekly - 是否显示每周签到
 * @property {boolean} ShowDaily - 是否显示每日签到
 */
export interface UserAssets {
  Id: number;
  Name: string;
  Avatar: string;
  Nickname: string;
  Balance: number;
  Assets: number;
  Type: number;
  State: number;
  LastIndex: number;
  ShowWeekly: boolean;
  ShowDaily: boolean;
}

/**
 * 获取用户资产数据
 * @param {string} Name - 用户name
 */
export async function getUserAssets(Name?: string) {
  try {
    return await httpService.get<TinygrailBaseResponse<UserAssets>>(
      `/chara/user/assets${Name ? `/${Name}` : ''}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 用户角色关联数据
 * @property {number} State - 状态
 * @property {number} Id - 未知
 * @property {number} UserId - 用户内部ID
 * @property {number} CharacterId - 角色ID
 * @property {string | null} Icon - 角色头像
 * @property {number} Amount - 可用活股数量
 * @property {number} Total - 持股数量
 * @property {number} Price - 未知
 * @property {number} Bonus - 未知
 * @property {number} Sacrifices - 固定资产上限
 */
export interface UserCharacterValue {
  State: number;
  Id: number;
  UserId: number;
  CharacterId: number;
  Icon: string | null;
  Amount: number;
  Total: number;
  Price: number;
  Bonus: number;
  Sacrifices: number;
}

export interface UserCharacterResponse
  extends TinygrailBaseResponse<UserCharacterValue> {}
/**
 * 获取用户角色关联数据
 * @param {string} characterId - 角色ID
 * @param {string} userName - 用户ID
 * @returns {Promise<UserCharacterResponse>} - 用户角色关联数据
 */
export async function getUserCharacterData(
  characterId: number,
  userName: string
): Promise<UserCharacterResponse> {
  try {
    return await httpService.get<UserCharacterResponse>(
      `/chara/user/${characterId}/${userName}/false`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 英灵殿角色数据
 * @property {number} AuctionUsers - 竞拍用户数
 * @property {number} AuctionTotal - 竞拍数量
 */
export interface TinygrailCharacterValue extends UserCharacterValue {
  AuctionUsers: number;
  AuctionTotal: number;
}

export interface TinygrailCharacterrResponse
  extends TinygrailBaseResponse<TinygrailCharacterValue> {}

/**
 * 获取英灵殿角色数据
 * @param {number} characterId - 角色ID
 * @returns {Promise<ExtendedUserCharacterResponse>} - 用户角色拍卖数据
 */
export async function getTinygrailCharacterData(
  characterId: number
): Promise<TinygrailCharacterrResponse> {
  try {
    return await httpService.get<TinygrailCharacterrResponse>(
      `/chara/user/${characterId}/tinygrail/false`
    );
  } catch (error) {
    throw error;
  }
}
/**
 * 用户圣殿列表分页数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 数据总数
 * @property {number} ItemsPerPage - 每页数量
 * @property {TempleItem[]} Items - 圣殿列表
 * @property {any} Context - 上下文信息
 */
export interface UserTemplePageValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: TempleItem[];
  Context: any;
}

export interface UserTempleResponse
  extends TinygrailBaseResponse<UserTemplePageValue> {}

/**
 * 获取用户圣殿列表
 * @param {string} userName - 用户名
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @param {string} [keyword] - 搜索关键词
 * @returns {Promise<UserTempleResponse>} - 用户圣殿列表数据
 */
export async function getUserTemples(
  userName: string,
  page: number = 1,
  pageSize: number = 10,
  keyword?: string
): Promise<UserTempleResponse> {
  page = Math.max(page, 1);
  try {
    const url = `/chara/user/temple/${userName}/${page}/${pageSize}${
      keyword ? `?keyword=${keyword}` : ''
    }`;
    return await httpService.get<UserTempleResponse>(url);
  } catch (error) {
    throw error;
  }
}
