import { DrawCharacterValue } from '@/api/magic-item';
import { httpService, TinygrailBaseResponse } from '@/lib/http';
import { CharacterDetail, CharacterICOItem, TempleItem } from './character';

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

export interface UserTradingResponse
  extends TinygrailBaseResponse<UserTradingValue> {}

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
    const url = `/chara/bid/${characterId}/${price}/${amount}${
      isIce ? '/true' : ''
    }`;
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
    const url = `/chara/ask/${characterId}/${price}/${amount}${
      isIce ? '/true' : ''
    }`;
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
    const url = `/chara/auction/${characterId}/${price}/${amount}`;
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
 * @property {number} Type - 竞拍数量
 * @property {number} State - 竞拍人数
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
    return await httpService.post<TinygrailBaseResponse<AuctionItem[]>>(
      url,
      auctionIds
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 用户所持角色列表
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 数据总数
 * @property {number} ItemsPerPage - 每页数量
 * @property {CharacterDetail[]} Items - 角色列表
 * @property {any} Context - 上下文信息
 */
export interface UserCharaPageValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: CharacterDetail[];
  Context: any;
}

export interface UserCharaResponse
  extends TinygrailBaseResponse<UserCharaPageValue> {}

/**
 * 获取用户所持角色列表
 * @param {string} userName - 用户名
 * @param {number} [page] - 页码
 * @param {number} [pageSize] - 每页数量
 * @returns {Promise<UserCharaResponse>} - 用户所持角色列表数据
 */
export async function getUserCharaList(
  userName: string,
  page: number = 1,
  pageSize: number = 24
): Promise<UserCharaResponse> {
  page = Math.max(page, 1);
  try {
    const url = `/chara/user/chara/${userName}/${page}/${pageSize}`;
    return await httpService.get<UserCharaResponse>(url);
  } catch (error) {
    throw error;
  }
}

/**
 * 用户资产排行榜项
 * @property {string} Name - 用户名
 * @property {string} Nickname - 昵称
 * @property {number} TotalBalance - 流动资金
 * @property {string} Avatar - 头像
 * @property {number} Principal - 初始资金
 * @property {number} Assets - 总资产
 * @property {string} LastActiveDate - 最后活跃时间
 * @property {number} LastIndex - 上次排名
 * @property {number} State - 状态
 * @property {number} Share - 每周股息
 */
export interface UserAssetRankItem {
  Name: string;
  Nickname: string;
  TotalBalance: number;
  Avatar: string;
  Principal: number;
  Assets: number;
  LastActiveDate: string;
  LastIndex: number;
  State: number;
  Share: number;
}

/**
 * 获取用户资产排行榜
 * @param {number} [page] - 页码
 * @param {number} [pageSize] - 每页数量
 * @returns {Promise<TinygrailBaseResponse<UserAssetRankItem[]>>} - 用户资产排行榜
 */
export async function getUserAssetRank(
  page: number = 1,
  pageSize: number = 20
): Promise<TinygrailBaseResponse<UserAssetRankItem[]>> {
  page = Math.max(1, page);
  pageSize = Math.max(1, pageSize);
  try {
    return await httpService.get<TinygrailBaseResponse<UserAssetRankItem[]>>(
      `/chara/top/${page}/${pageSize}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 用户ICO注资信息
 * @property {string | null} Name - 用户名称
 * @property {string | null} NickName - 用户昵称
 * @property {string | null} Avatar - 用户头像
 * @property {number} LastIndex - 首富排名
 * @property {number} Id - ID
 * @property {number} InitialId - ICO ID
 * @property {number} UserId - 用户内部ID
 * @property {number} Amount - 金额
 * @property {string} Begin - 首次注资时间
 * @property {string} End - 结束时间
 * @property {number} State - 状态
 */
export interface UserIcoValue {
  Name: string | null;
  NickName: string | null;
  Avatar: string | null;
  LastIndex: number;
  Id: number;
  InitialId: number;
  UserId: number;
  Amount: number;
  Begin: string;
  End: string;
  State: number;
}

/**
 * 获取用户ICO注资信息
 * @param {number} icoId - ICO ID
 * @returns {Promise<TinygrailBaseResponse<UserIcoValue>>} - ICO注资信息响应
 */
export async function getUserIco(
  icoId: number
): Promise<TinygrailBaseResponse<UserIcoValue>> {
  try {
    const url = `/chara/initial/${icoId}`;
    return await httpService.get<TinygrailBaseResponse<UserIcoValue>>(url);
  } catch (error) {
    throw error;
  }
}

/**
 * 参与ICO
 * @param {number} icoId - ICO ID
 * @param {number} amount - 参与金额
 * @returns {Promise<TinygrailBaseResponse<UserIcoValue>>} - 参与ICO的响应
 */
export const joinIco = async (
  icoId: number,
  amount: number
): Promise<TinygrailBaseResponse<UserIcoValue>> => {
  try {
    const url = `/chara/join/${icoId}/${amount}`;
    return await httpService.post<TinygrailBaseResponse<UserIcoValue>>(url);
  } catch (error) {
    throw error;
  }
};

/**
 * 用户连接列表分页数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 总条目数
 * @property {number} ItemsPerPage - 每页条目数
 * @property {TempleItem[]} Items - 连接列表
 * @property {any | null} Context - 上下文
 */
export interface UserLinkPageValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: TempleItem[];
  Context: any | null;
}

/**
 * 获取用户连接列表
 * @param {string} userName - 用户名
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise<TinygrailBaseResponse<UserLinkPageValue>>} - 用户连接列表
 */
export async function getUserLinks(
  userName: string,
  page: number = 1,
  pageSize: number = 24
): Promise<TinygrailBaseResponse<UserLinkPageValue>> {
  page = Math.max(1, page);
  pageSize = Math.max(1, pageSize);
  try {
    return await httpService.get<TinygrailBaseResponse<UserLinkPageValue>>(
      `/chara/user/link/${userName}/${page}/${pageSize}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 用户初始角色列表分页数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 总条目数
 * @property {number} ItemsPerPage - 每页条目数
 * @property {CharacterICOItem[]} Items - 初始角色列表
 * @property {any | null} Context - 上下文
 */
export interface UserIcoPageValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: CharacterICOItem[];
  Context: any | null;
}

/**
 * 获取用户初始角色列表
 * @param {string} userName - 用户名
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise<TinygrailBaseResponse<UserIcoPageValue>>} - 用户初始角色列表
 */
export async function getUserIcoCharacters(
  userName: string,
  page: number = 1,
  pageSize: number = 24
): Promise<TinygrailBaseResponse<UserIcoPageValue>> {
  page = Math.max(1, page);
  pageSize = Math.max(1, pageSize);
  try {
    return await httpService.get<TinygrailBaseResponse<UserIcoPageValue>>(
      `/chara/user/initial/${userName}/${page}/${pageSize}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 用户股息数据
 * @property {number} Total - 计息股份
 * @property {number} Temples - 圣殿数量
 * @property {number} Share - 预期股息
 * @property {number} Tax - 税收
 * @property {number} Daily - 每日签到奖励
 */
export interface ShareBonusTestValue {
  Total: number;
  Temples: number;
  Share: number;
  Tax: number;
  Daily: number;
}

/**
 * 获取用户分股息
 * @param {string} userName - 用户名
 * @returns {Promise<TinygrailBaseResponse<ShareBonusTestValue>>} - 股息数据
 */
export async function getShareBonusTest(
  userName: string
): Promise<TinygrailBaseResponse<ShareBonusTestValue>> {
  try {
    return await httpService.get<TinygrailBaseResponse<ShareBonusTestValue>>(
      `/event/share/bonus/test/${userName}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 领取每周分红
 * @returns {Promise<TinygrailBaseResponse<string>>} - 领取分红结果
 */
export async function claimWeeklyShareBonus(): Promise<
  TinygrailBaseResponse<string>
> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      '/event/share/bonus'
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 领取每日签到奖励
 * @returns {Promise<TinygrailBaseResponse<string>>} - 领取每日签到奖励结果
 */
export async function claimBonusDaily(): Promise<
  TinygrailBaseResponse<string>
> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      '/event/bangumi/bonus/daily'
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 发送红包
 * @param {string} userName - 用户名
 * @param {number} amount - 金额
 * @param {string} message - 留言
 * @returns {Promise<TinygrailBaseResponse<string>>} - 发送红包结果
 */
export async function sendRedPacket(
  userName: string,
  amount: number,
  message: string
): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      `/event/send/${userName}/${amount}/${message}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 资金日志项
 * @property {string | null} RelatedName - 关联角色名称
 * @property {number} Id - 日志ID
 * @property {number} UserId - 用户内部ID
 * @property {number} Change - 变动金额
 * @property {number} Amount - 关联角色数量
 * @property {number} Balance - 余额
 * @property {number} RelatedId - 关联角色ID
 * @property {string} Description - 描述
 * @property {string} LogTime - 记录时间
 * @property {number} Type - 类型
 * @property {number} State - 状态
 */
export interface BalanceLogItem {
  RelatedName: string | null;
  Id: number;
  UserId: number;
  Change: number;
  Amount: number;
  Balance: number;
  RelatedId: number;
  Description: string;
  LogTime: string;
  Type: number;
  State: number;
}

/**
 * 资金日志分页数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 总条目数
 * @property {number} ItemsPerPage - 每页条目数
 * @property {BalanceLogItem[]} Items - 日志列表
 * @property {any | null} Context - 上下文
 */
export interface BalanceLogPageValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: BalanceLogItem[];
  Context: any | null;
}

/**
 * 获取资金日志
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise<TinygrailBaseResponse<BalanceLogPageValue>>} - 资金日志数据
 */
export async function getBalanceLog(
  page: number = 1,
  pageSize: number = 10
): Promise<TinygrailBaseResponse<BalanceLogPageValue>> {
  page = Math.max(1, page);
  pageSize = Math.max(1, pageSize);
  try {
    return await httpService.get<TinygrailBaseResponse<BalanceLogPageValue>>(
      `/chara/user/balance/${page}/${pageSize}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 用户拍卖列表分页数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 总条目数
 * @property {number} ItemsPerPage - 每页条目数
 * @property {AuctionItem[]} Items - 拍卖列表
 * @property {any | null} Context - 上下文
 */
export interface UserAuctionPageValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: AuctionItem[];
  Context: any | null;
}

/**
 * 获取用户拍卖列表
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise<TinygrailBaseResponse<UserAuctionPageValue>>} - 用户拍卖列表数据
 */
export async function getUserAuctions(
  page: number = 1,
  pageSize: number = 10
): Promise<TinygrailBaseResponse<UserAuctionPageValue>> {
  page = Math.max(1, page);
  pageSize = Math.max(1, pageSize);
  try {
    return await httpService.get<TinygrailBaseResponse<UserAuctionPageValue>>(
      `/chara/user/auction/${page}/${pageSize}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 用户买单角色列表分页数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 总条目数
 * @property {number} ItemsPerPage - 每页条目数
 * @property {CharacterDetail[]} Items - 角色列表
 * @property {any | null} Context - 上下文
 */
export interface UserBidsPageValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: CharacterDetail[];
  Context: any | null;
}

/**
 * 获取用户买单角色列表
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise<TinygrailBaseResponse<UserBidsPageValue>>} - 用户买单角色列表数据
 */
export async function getUserBids(
  page: number = 1,
  pageSize: number = 10
): Promise<TinygrailBaseResponse<UserBidsPageValue>> {
  page = Math.max(1, page);
  pageSize = Math.max(1, pageSize);
  try {
    return await httpService.get<TinygrailBaseResponse<UserBidsPageValue>>(
      `/chara/bids/0/${page}/${pageSize}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 用户卖单角色列表分页数据
 * @property {number} CurrentPage - 当前页码
 * @property {number} TotalPages - 总页数
 * @property {number} TotalItems - 总条目数
 * @property {number} ItemsPerPage - 每页条目数
 * @property {CharacterDetail[]} Items - 角色列表
 * @property {any | null} Context - 上下文
 */
export interface UserAsksPageValue {
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Items: CharacterDetail[];
  Context: any | null;
}

/**
 * 获取用户卖单角色列表
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise<TinygrailBaseResponse<UserAsksPageValue>>} - 用户卖单角色列表数据
 */
export async function getUserAsks(
  page: number = 1,
  pageSize: number = 10
): Promise<TinygrailBaseResponse<UserAsksPageValue>> {
  page = Math.max(1, page);
  pageSize = Math.max(1, pageSize);
  try {
    return await httpService.get<TinygrailBaseResponse<UserAsksPageValue>>(
      `/chara/asks/0/${page}/${pageSize}`
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 用户登出
 * @returns {Promise<TinygrailBaseResponse<string>>} - 登出结果
 */
export async function logout(): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.post<TinygrailBaseResponse<string>>(
      '/account/logout'
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 检查是否是节日
 * @returns {Promise<TinygrailBaseResponse<string>>} - 结果
 */
export async function holidayCheck(): Promise<TinygrailBaseResponse<string>> {
  try {
    return await httpService.get<TinygrailBaseResponse<string>>(
      '/event/holiday/bonus/check'
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 领取节日奖励
 * @returns {Promise<TinygrailBaseResponse<string>>} - 结果
 */
export async function claimHolidayBonus(): Promise<
  TinygrailBaseResponse<string>
> {
  try {
    return await httpService.get<TinygrailBaseResponse<string>>(
      '/event/holiday/bonus'
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 刮刮乐奖励
 * @param {boolean} isGensokyo - 是否是幻想乡刮刮乐
 * @returns {Promise<TinygrailBaseResponse<DrawCharacterValue[]>>} - 刮刮乐奖励结果
 */
export async function scratch(
  isGensokyo: boolean = false
): Promise<TinygrailBaseResponse<DrawCharacterValue[]>> {
  try {
    const url = `/event/scratch/bonus2${isGensokyo ? '/true' : ''}`;
    return await httpService.post<TinygrailBaseResponse<DrawCharacterValue[]>>(
      url
    );
  } catch (error) {
    throw error;
  }
}

/**
 * 获取用户已使用幻想乡刮刮乐次数
 * @returns {Promise<TinygrailBaseResponse<number>>} - 已使用次数
 */
export async function getGensokyoScratchCount(): Promise<TinygrailBaseResponse<number>> {
  try {
    return await httpService.get<TinygrailBaseResponse<number>>(
      '/event/daily/count/10'
    );
  } catch (error) {
    throw error;
  }
}
