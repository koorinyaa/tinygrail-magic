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

/**
 * 历史委托
 * @property {string | null} Seller - 卖家信息
 * @property {string | null} SellerName - 卖家名称
 * @property {string | null} Buyer - 买家信息
 * @property {string | null} BuyerName - 买家名称
 * @property {string | null} Name - 名称
 * @property {number} Id - 交易ID
 * @property {string} TradeTime - 交易时间
 * @property {number} SellerId - 卖家ID
 * @property {number} BuyerId - 买家ID
 * @property {string} SellerIp - 卖家IP
 * @property {string} BuyerIp - 买家IP
 * @property {number} CharacterId - 角色ID
 * @property {number} Price - 价格
 * @property {number} Amount - 数量
 * @property {number} Type - 交易类型
 */
export interface TradeHistoryItem {
  Seller: string | null;
  SellerName: string | null;
  Buyer: string | null;
  BuyerName: string | null;
  Name: string | null;
  Id: number;
  TradeTime: string;
  SellerId: number;
  BuyerId: number;
  SellerIp: string;
  BuyerIp: string;
  CharacterId: number;
  Price: number;
  Amount: number;
  Type: number;
}

/**
 * 当前委托
 * @property {number} Id - 订单ID
 * @property {number} UserId - 用户ID
 * @property {number} CharacterId - 角色ID
 * @property {number} Price - 价格
 * @property {number} Amount - 数量
 * @property {string} Begin - 开始时间
 * @property {string} End - 结束时间
 * @property {number} State - 状态
 * @property {number} Type - 类型
 */
export interface TradeOrderItem {
  Id: number;
  UserId: number;
  CharacterId: number;
  Price: number;
  Amount: number;
  Begin: string;
  End: string;
  State: number;
  Type: number;
}

/**
 * 用户交易数据
 * @property {number} Id - 用户内部ID
 * @property {number} Balance - 用户余额
 * @property {number} Amount - 可用活股数量
 * @property {number} Sacrifices - 固定资产上限
 * @property {TradeOrderItem[]} Asks - 卖单列表
 * @property {TradeOrderItem[]} Bids - 买单列表
 * @property {TradeHistoryItem[]} AskHistory - 卖出历史
 * @property {TradeHistoryItem[]} BidHistory - 买入历史
 */
export interface UserTradingValue {
  Id: number;
  Balance: number;
  Amount: number;
  Sacrifices: number;
  Asks: TradeOrderItem[];
  Bids: TradeOrderItem[];
  AskHistory: TradeHistoryItem[];
  BidHistory: TradeHistoryItem[];
}

export interface UserTradingResponse extends TinygrailBaseResponse<UserTradingValue> {}

/**
 * 获取用户角色交易数据
 * @param {number} characterId - 角色ID
 * @returns {Promise<UserTradingResponse>} - 用户角色交易数据
 */
export async function getUserTrading(
  characterId: number
): Promise<UserTradingResponse> {
  try {
    return await httpService.get<UserTradingResponse>(
      `/chara/user/${characterId}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 买入角色
 * @param {number} characterId - 角色ID
 * @param {number} price - 买入价格
 * @param {number} amount - 买入数量
 * @param {boolean} [isIce] - 是否冰山委托，可选参数
 * @returns {Promise<TinygrailBaseResponse<string>>} - 买入结果
 */
export async function bidCharacter(
  characterId: number,
  price: number,
  amount: number,
  isIce?: boolean
): Promise<TinygrailBaseResponse<string>> {
  try {
    const url = `/chara/bid/${characterId}/${price}/${amount}${isIce ? '/true' : ''}`;
    return await httpService.post<TinygrailBaseResponse<string>>(url);
  } catch (error) {
    throw error;
  }
}

/**
 * 卖出角色
 * @param {number} characterId - 角色ID
 * @param {number} price - 卖出价格
 * @param {number} amount - 卖出数量
 * @param {boolean} [isIce] - 是否冰山委托，可选参数
 * @returns {Promise<TinygrailBaseResponse<string>>} - 卖出结果
 */
export async function askCharacter(
  characterId: number,
  price: number,
  amount: number,
  isIce?: boolean
): Promise<TinygrailBaseResponse<string>> {
  try {
    const url = `/chara/ask/${characterId}/${price}/${amount}${isIce ? '/true' : ''}`;
    return await httpService.post<TinygrailBaseResponse<string>>(url);
  } catch (error) {
    throw error;
  }
}

/**
 * 取消买入委托
 * @param {number} orderId - 订单ID
 * @returns {Promise<TinygrailBaseResponse<string>>} - 取消结果
 */
export async function cancelBidOrder(
  orderId: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    const url = `/chara/bid/cancel/${orderId}`;
    return await httpService.post<TinygrailBaseResponse<string>>(url);
  } catch (error) {
    throw error;
  }
}

/**
 * 取消卖出委托
 * @param {number} orderId - 订单ID
 * @returns {Promise<TinygrailBaseResponse<string>>} - 取消结果
 */
export async function cancelAskOrder(
  orderId: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    const url = `/chara/ask/cancel/${orderId}`;
    return await httpService.post<TinygrailBaseResponse<string>>(url);
  } catch (error) {
    throw error;
  }
}

/**
 * 参与角色竞拍
 * @param {number} characterId - 角色ID
 * @param {number} amount - 竞拍数量
 * @param {number} price - 竞拍价格
 * @returns {Promise<TinygrailBaseResponse<string>>} - 竞拍结果
 */
export async function auctionCharacter(
  characterId: number,
  amount: number,
  price: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    const url = `/chara/auction/${characterId}/${amount}/${price}`;
    return await httpService.post<TinygrailBaseResponse<string>>(url);
  } catch (error) {
    throw error;
  }
}

/**
 * 取消角色竞拍
 * @param {number} auctionId - 拍卖ID
 * @returns {Promise<TinygrailBaseResponse<string>>} - 取消竞拍结果
 */
export async function cancelAuctionCharacter(
  auctionId: number
): Promise<TinygrailBaseResponse<string>> {
  try {
    const url = `/chara/auction/cancel/${auctionId}`;
    return await httpService.post<TinygrailBaseResponse<string>>(url);
  } catch (error) {
    throw error;
  }
}

/**
 * 拍卖项信息
 * @property {string | null} Name - 名称
 * @property {string | null} Icon - 图标
 * @property {string | null} Nickname - 昵称
 * @property {string | null} Username - 用户名
 * @property {number} Start - 未知
 * @property {number} Rate - 未知
 * @property {number} Total - 总数
 * @property {number} MarketValue - 市场价值
 * @property {number} Id - 拍卖ID
 * @property {number} CharacterId - 角色ID
 * @property {number} UserId - 用户内部ID
 * @property {number} Price - 价格
 * @property {number} Amount - 数量
 * @property {string} Bid - 竞拍时间
 * @property {number} Type - 类型（和数量一个值）
 * @property {number} State - 状态
 */
export interface AuctionItem {
  Name: string | null;
  Icon: string | null;
  Nickname: string | null;
  Username: string | null;
  Start: number;
  Rate: number;
  Total: number;
  MarketValue: number;
  Id: number;
  CharacterId: number;
  UserId: number;
  Price: number;
  Amount: number;
  Bid: string;
  Type: number;
  State: number;
}

/**
 * 获取拍卖列表
 * @param {number[]} auctionIds - 拍卖ID数组
 * @returns {Promise<TinygrailBaseResponse<AuctionItem[]>>} - 拍卖列表数据
 */
export async function getAuctionList(
  auctionIds: number[]
): Promise<TinygrailBaseResponse<AuctionItem[]>> {
  try {
    const url = `/chara/auction/list`;
    return await httpService.post<TinygrailBaseResponse<AuctionItem[]>>(url, auctionIds);
  } catch (error) {
    throw error;
  }
}
