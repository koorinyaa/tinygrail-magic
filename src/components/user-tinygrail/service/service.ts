import { CharacterICOItem, getCharacterICO } from '@/api/character';
import {
  getShareBonusTest,
  getUserAssets,
  getUserCharaList,
  getUserIcoCharacters,
  getUserLinks,
  getUserTemples,
  ShareBonusTestValue,
  UserAssets,
  UserCharaPageValue,
  UserIcoPageValue,
  UserLinkPageValue,
  UserTemplePageValue,
} from '@/api/user';

/**
 * 获取用户资产数据
 */
export const fatchUserAssetsData = async (
  userName: string
): Promise<UserAssets> => {
  const data = await getUserAssets(userName);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取用户资产数据失败');
  }
};

/**
 * 获取用户圣殿数据
 * @param userName 用户名
 * @param page 页数
 */
export const fatchUserLinkPageData = async (
  userName: string,
  page: number
): Promise<UserLinkPageValue> => {
  const data = await getUserLinks(userName, page, 24);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取用户LINK数据失败');
  }
};

/**
 * 获取用户圣殿数据
 * @param userName 用户名
 * @param page 页数
 */
export const fatchUserTemplePageData = async (
  userName: string,
  page: number
): Promise<UserTemplePageValue> => {
  const data = await getUserTemples(userName, page, 24);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取用户圣殿数据失败');
  }
};

/**
 * 获取用户角色数据
 * @param userName 用户名
 * @param page 页数
 */
export const fatchUserCharaPageData = async (
  userName: string,
  page: number
): Promise<UserCharaPageValue> => {
  const data = await getUserCharaList(userName, page, 24);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取用户角色数据失败');
  }
};

/**
 * 获取ICO角色数据
 * @param userName 用户名
 * @param page 页数
 */
export const fatchUserIcoPageData = async (
  userName: string,
  page: number
): Promise<UserIcoPageValue> => {
  const data = await getUserIcoCharacters(userName, page, 24);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取用户ICO数据失败');
  }
};

/**
 * 获取用户股息
 * @param userName 用户名
 */
export const fatchUserBonusData = async (
  userName: string
): Promise<ShareBonusTestValue> => {
  const data = await getShareBonusTest(userName);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取用户股息数据失败');
  }
};

/**
 * 获取ICO数据
 */
export const fetchICOData = async (): Promise<CharacterICOItem[]> => {
  const data = await getCharacterICO('rai');
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取ICO数据失败');
  }
};
