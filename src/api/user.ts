import { httpService, TinygrailBaseResponse } from "@/lib/http";

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
    console.error('获取用户资产数据失败:', (error as Error).message);
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

export interface UserCharacterResponse extends TinygrailBaseResponse<UserCharacterValue> {}
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
    console.error('获取用户角色数据失败:', (error as Error).message);
    throw error;
  }
}
