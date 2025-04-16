import { httpService, TinygrailBaseResponse } from "@/lib/http";

/**
 * 圣殿item
 * @property {string} Nickname - 用户昵称
 * @property {string} Name - 用户名称
 * @property {string} Avatar - 用户头像 URL
 * @property {number} Rate - 基础股息
 * @property {number} Price - 评估价
 * @property {number} Extra - 溢出金额
 * @property {number} CharacterLevel - 角色等级
 * @property {string} CharacterName - 角色名称
 * @property {number} CharacterRank - 角色排名
 * @property {number} CharacterStars - 角色星级
 * @property {number} CharacterStarForces - 角色星之力
 * @property {TempleItem | null} Link - LINK圣殿
 * @property {number} Id - ID
 * @property {number} UserId - 用户内部ID
 * @property {number} CharacterId - 角色ID
 * @property {string} Cover - 封面图片 URL
 * @property {string | null} LargeCover - 大图 URL
 * @property {any} Line - 台词
 * @property {any} Source - 未知
 * @property {any} Slots - 未知
 * @property {number} LinkId - 链接ID
 * @property {number} LinkedAssets - 疑似LINK固定资产余量（但是数据对不上）
 * @property {string} Create - 创建时间
 * @property {string} Upgrade - 升级时间
 * @property {string} LastActive - 最后活跃时间
 * @property {string} LastUpdate - 最后更新时间
 * @property {string} LastLink - 最后链接时间
 * @property {number} LastModifier - 最后修改人内部ID
 * @property {number} Assets - 固定资产余量
 * @property {number} Sacrifices - 固定资产上限
 * @property {number} Level - 圣殿等级
 * @property {number} StarForces - 已贡献星之力
 * @property {number} Refine - 精炼等级
 * @property {number} RaidWin - 疑似未实装道具
 * @property {number} RaidLose - 疑似未实装道具
 * @property {number} BattleWin - 疑似未实装道具
 * @property {number} BattleLose - 疑似未实装道具
 * @property {number} Type - 类型
 * @property {number} State - 状态
 */
export interface TempleItem {
  Nickname: string | null;
  Name: string | null;
  Avatar: string;
  Rate: number;
  Price: number;
  Extra: number;
  CharacterLevel: number;
  CharacterName: string;
  CharacterRank: number;
  CharacterStars: number;
  CharacterStarForces: number;
  Link: TempleItem | null;
  Id: number;
  UserId: number;
  CharacterId: number;
  Cover: string;
  LargeCover: string | null;
  Line: any;
  Source: any;
  Slots: any;
  LinkId: number;
  LinkedAssets: number;
  Create: string;
  Upgrade: string;
  LastActive: string;
  LastUpdate: string;
  LastLink: string;
  LastModifier: number;
  Assets: number;
  Sacrifices: number;
  Level: number;
  StarForces: number;
  Refine: number;
  RaidWin: number;
  RaidLose: number;
  BattleWin: number;
  BattleLose: number;
  Type: number;
  State: number;
}

/**
 * 当前萌王数据项
 * @extends {TempleItem}
 * @property {string} Avatar - 头像 URL
 * @property {number} Rate - 基础股息
 * @property {number} Price - 评估价
 * @property {number} Extra - 溢出金额
 * @property {number} CharacterLevel - 角色等级
 * @property {string} CharacterName - 角色名称
 * @property {number} Id - 角色内部ID
 * @property {number} CharacterId - 角色ID
 * @property {string} Cover - 封面图片 URL
 * @property {number} Assets - 拍卖数量
 * @property {number} Sacrifices - 英灵殿数量
 * @property {number} Type - 拍卖人数
 */
export interface CurrentTopWeekItem extends TempleItem {}
export interface TopWeekResponse extends TinygrailBaseResponse<Array<CurrentTopWeekItem>> { }

/**
 * 获取当前萌王数据
 */
export async function getTopWeek(): Promise<TopWeekResponse> {
  try {
    return await httpService.get<TopWeekResponse>('/chara/topweek');
  } catch (error) {
    console.error('获取每周萌王数据失败:', (error as Error).message);
    throw error;
  }
}


/**
 * 历史萌王数据项
 * @extends {TempleItem}
 * @property {number} Assets - 参与人数
 * @property {number} Avatar - 头像 URL
 * @property {number} CharacterId - 角色ID
 * @property {number} CharacterLevel - 角色等级
 * @property {string} Name - 角色名称
 * @property {number} Extra - 溢出金额
 * @property {number} Price - 拍卖总金额
 * @property {number} Create - 创建时间
 * @property {number} Level - 排名
 */
export interface HistoryTopWeekItem extends TempleItem {}
export interface TopWeekHistoryResponse extends TinygrailBaseResponse<{
  Items: HistoryTopWeekItem[];
  CurrentPage: number;
  TotalPages: number;
  TotalItems: number;
  ItemsPerPage: number;
  Context: any;
}> {}

/**
 * 获取历史萌王数据
 */
export async function getTopWeekHistory(page: number, pageSize: number = 12): Promise<TopWeekHistoryResponse> {
  page = Math.max(page, 1);
  try {
    return await httpService.get<TopWeekHistoryResponse>(`/chara/topweek/history/${page}/${pageSize}`);
  } catch (error) {
    console.error('获取历史萌王数据失败:', (error as Error).message);
    throw error;
  }
}


/**
 * 角色详细信息数据项
 * @property {number} CharacterId - 角色ID
 * @property {number} Change - 变动(意义不明)
 * @property {number} UserTotal - 持股总量
 * @property {number} UserAmount - 可用活股
 * @property {number} Id - 和角色ID一致
 * @property {string} Name - 角色名称
 * @property {string} Icon - 角色头像
 * @property {number} Total - 流通量
 * @property {number} Current - 当前价
 * @property {number} Fluctuation - 价格变动
 * @property {number} Asks - 卖单数量
 * @property {number} Bids - 买单数量
 * @property {string} LastOrder - 最后卖出委托成交时间（包括道具造成的交易）
 * @property {string} LastDeal - 最后买入委托成交时间（包括道具造成的交易）
 * @property {number} LastModifier - 最后修改人小圣杯内部id
 * @property {number} MarketValue - 市场价值
 * @property {number} Sacrifices - 固定资产上限
 * @property {number} StarForces - 星之力
 * @property {number} Stars - 星级
 * @property {number} Rank - 通天塔排名
 * @property {number} SubjectId - 所属主题ID
 * @property {string} SubjectName - 所属主题名称
 * @property {string} AirDate - 未知
 * @property {string} ListedDate - 上市时间
 * @property {string} LastUpdate - 最后更新时间
 * @property {number} Bonus - 新番加成剩余时间（周为单位）
 * @property {number} Level - 角色等级
 * @property {number} Price - 评估价
 * @property {number} Rate - 基础股息
 * @property {number} Crown - 萌王次数
 * @property {number} ZeroCount - ST等级
 */
export interface CharacterDetail {
  CharacterId: number;
  Change: number;
  UserTotal: number;
  UserAmount: number;
  Id: number;
  Name: string;
  Icon: string;
  Total: number;
  Current: number;
  Fluctuation: number;
  Asks: number;
  Bids: number;
  LastOrder: string;
  LastDeal: string;
  LastModifier: number;
  MarketValue: number;
  Sacrifices: number;
  StarForces: number;
  NextStar: number;
  Stars: number;
  Rank: number;
  SubjectId: number;
  SubjectName: string;
  AirDate: string;
  ListedDate: string;
  LastUpdate: string;
  Bonus: number;
  Level: number;
  Price: number;
  Rate: number;
  Crown: number;
  RaidWin: number;
  RaidLose: number;
  BattleWin: number;
  BattleLose: number;
  ZeroCount: number;
  State: number;
  Type: number;
}
export interface CharacterDetailResponse extends TinygrailBaseResponse<CharacterDetail> {}

/**
 * 获取角色详细信息
 * @param characterId 角色ID
 */
export async function getCharacterDetail(characterId: number): Promise<CharacterDetailResponse> {
  try {
    return await httpService.get<CharacterDetailResponse>(`/chara/${characterId}`);
  } catch (error) {
    console.error('获取角色详情失败:', (error as Error).message);
    throw error;
  }
}


export interface TempleResponse extends TinygrailBaseResponse<TempleItem[]> {}

/**
 * 获取角色圣殿数据
 * @param characterId 角色ID
 */
export async function getCharacterTemple(characterId: number): Promise<TempleResponse> {
  try {
    return await httpService.get<TempleResponse>(`/chara/temple/${characterId}`);
  } catch (error) {
    console.error('获取角色圣殿数据失败:', (error as Error).message);
    throw error;
  }
}


export interface LinksResponse extends TinygrailBaseResponse<TempleItem[]> {}

/**
 * 获取角色LINK圣殿数据
 * @param characterId 角色ID
 */
export async function getCharacterLinks(characterId: number): Promise<LinksResponse> {
  try {
    return await httpService.get<LinksResponse>(`chara/links/${characterId}`);
  } catch (error) {
    console.error('获取角色LINK数据失败:', (error as Error).message);
    throw error;
  }
}


export interface CharacterSearchResponse extends TinygrailBaseResponse<CharacterDetail[]> {}

/**
 * 搜索角色
 * @param {string} [keyword] 搜索关键字
 */
export async function searchCharacter(keyword: string): Promise<CharacterSearchResponse> {
  try {
    return await httpService.get<CharacterSearchResponse>(`/chara/search/character?keyword=${keyword}`);
  } catch (error) {
    console.error('搜索角色失败:', (error as Error).message);
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

export interface UserTempleResponse extends TinygrailBaseResponse<UserTemplePageValue> {}

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
    const url = `/chara/user/temple/${userName}/${page}/${pageSize}${keyword ? `?keyword=${keyword}` : ''}`;
    return await httpService.get<UserTempleResponse>(url);
  } catch (error) {
    console.error('获取用户圣殿列表失败:', (error as Error).message);
    throw error;
  }
}

