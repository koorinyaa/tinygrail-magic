import { httpService, TinygrailBaseResponse } from "@/lib/http";

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
    console.error('获取用户道具列表失败:', (error as Error).message);
    throw error;
  }
}