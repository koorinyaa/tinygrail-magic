import { httpService, TinygrailBaseResponse } from '@/lib/http';

/**
 * 用户道具数据
 * @property {number} Id - 道具ID
 * @property {string} Name - 道具名称
 * @property {string} Icon - 道具图标
 * @property {string} Line - 道具描述文本
 * @property {string | null} Description - 未知
 * @property {string | null} ModelTemplate - 未知
 * @property {number} Value - 未知
 * @property {number} Rate - 未知
 * @property {number} Cost - 未知
 * @property {number} Limit - 道具每日限制
 * @property {number} Type - 道具类型
 * @property {number} State - 道具状态
 * @property {number} Amount - 道具数量
 * @property {string} Last - 最后更新时间
 */
export interface UserItemValue {
  Id: number;
  Name: string;
  Icon: string;
  Line: string;
  Description: string | null;
  ModelTemplate: string | null;
  Value: number;
  Rate: number;
  Cost: number;
  Limit: number;
  Type: number;
  State: number;
  Amount: number;
  Last: string;
}

/**
 * 用户道具列表分页数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 数据总数
 * @property {number} ItemsPerPage - 每页数量
 * @property {UserItemValue[]} Items - 道具列表
 * @property {string | null} Context - 上下文信息
 */
export interface UserItemsPageValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: UserItemValue[];
  Context: string | null;
}

/**
 * 获取用户道具列表
 * @param {number} page - 页码
 * @param {number} size - 每页数量
 * @returns {Promise<TinygrailBaseResponse<UserItemsPageValue>>} - 用户道具列表数据
 */
export async function getUserItems(
  page: number = 1,
  size: number = 50
): Promise<TinygrailBaseResponse<UserItemsPageValue>> {
  try {
    return await httpService.get<TinygrailBaseResponse<UserItemsPageValue>>(
      `/chara/user/item/0/${page}/${size}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 使用鲤鱼之眼
 * @param {number} consumeCharacterId - 消耗角色ID
 * @param {number} targetCharacterId - 目标角色ID
 * @returns {Promise<TinygrailBaseResponse<string>>} - 结果
 */
export async function useFisheye(
  consumeCharacterId: number,
  targetCharacterId: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      `/magic/fisheye/${consumeCharacterId}/${targetCharacterId}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 抽奖角色数据
 * @property {number} Id - 角色ID
 * @property {string} Name - 角色名称
 * @property {number} Level - 角色等级
 * @property {string} Cover - 角色封面图片URL
 * @property {number} Amount - 数量
 * @property {number} Rate - 基础股息
 * @property {number} CurrentPrice - 当前价格
 * @property {number} SellPrice - 可出售价格
 * @property {number} SellAmount - 可出售数量
 * @property {number} FinancePrice - 融资价格
 */
export interface DrawCharacterValue {
  Id: number;
  Name: string;
  Level: number;
  Cover: string;
  Amount: number;
  Rate: number;
  CurrentPrice: number;
  SellPrice: number;
  SellAmount: number;
  FinancePrice: number;
}

/**
 * 使用混沌魔方
 * @param {number} consumeCharacterId - 消耗角色ID
 * @returns {Promise<TinygrailBaseResponse<DrawCharacterValue>>} - 结果
 */
export async function useChaos(
  consumeCharacterId: number
): Promise<TinygrailBaseResponse<DrawCharacterValue>> {
  try {
    return await httpService.post<TinygrailBaseResponse<DrawCharacterValue>>(
      `/magic/chaos/${consumeCharacterId}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 使用虚空道标
 * @param {number} consumeCharacterId - 消耗角色ID
 * @param {number} targetCharacterId - 目标角色ID
 * @returns {Promise<TinygrailBaseResponse<DrawCharacterValue>>} - 结果
 */
export async function useGuidepost(
  consumeCharacterId: number,
  targetCharacterId: number
): Promise<TinygrailBaseResponse<DrawCharacterValue>> {
  try {
    return await httpService.post<TinygrailBaseResponse<DrawCharacterValue>>(
      `/magic/guidepost/${consumeCharacterId}/${targetCharacterId}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 使用星光碎片
 * @param {number} consumeCharacterId - 消耗角色ID
 * @param {number} targetCharacterId - 目标角色ID
 * @param {number} amount - 数量
 * @returns {Promise<TinygrailBaseResponse<string>>} - 结果
 */
export async function useStardust(
  consumeCharacterId: number,
  targetCharacterId: number,
  amount: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      `/magic/stardust/${consumeCharacterId}/${targetCharacterId}/${amount}/false`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 使用闪光结晶
 * @param {number} consumeCharacterId - 消耗角色ID
 * @param {number} targetCharacterId - 目标角色ID
 * @returns {Promise<TinygrailBaseResponse<string>>} - 结果
 */
export async function useStarbreak(
  consumeCharacterId: number,
  targetCharacterId: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      `/magic/starbreak/${consumeCharacterId}/${targetCharacterId}`
    );
  } catch (error) {
    throw error;
  }
}
