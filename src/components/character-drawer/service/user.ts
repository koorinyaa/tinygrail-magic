import { TempleItem } from '@/api/character';
import {
  getUserCharacterData,
  getUserTemples,
  getUserTrading,
  UserCharacterValue,
  UserTradingValue,
} from '@/api/user';
import { isEmpty } from '@/lib/utils';
import { CharacterDrawerData } from '@/store/slices/character-drawer';
import {
  fetchCharacterBoardMemberItems,
  fetchCharacterDetailData,
  fetchCharacterLinkItems,
  fetchCharacterTempleItems,
  fetchCharacterUsersPageData
} from './character';

/**
 * 获取用户角色数据
 * @param {number | null} characterId - 角色ID
 * @param {string | undefined} userName - 用户名
 * @returns {Promise<UserCharacterValue>} - 用户角色数据
 */
export const fetchUserCharacterData = async (
  characterId: number,
  userName: string
): Promise<UserCharacterValue> => {
  if (isEmpty(userName)) throw new Error('用户名不能为空');

  const data = await getUserCharacterData(characterId, userName);

  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取用户角色数据失败');
  }
};

/**
 * 获取用户圣殿
 * @param {UserCharacterValue} userCharacterData - 用户角色数据
 * @param {TempleItem[]} temples - 圣殿数据
 * @param {TempleItem[]} links - LINK数据
 * @param {string} userName - 用户名
 * @returns {Promise<TempleItem | null>} - 用户圣殿数据
 */
export const getUserTempleData = async (
  userCharacterData: UserCharacterValue,
  temples: TempleItem[],
  links: TempleItem[],
  userName: string
): Promise<TempleItem | null> => {
  if (userCharacterData.Sacrifices <= 0) return null;

  const merged = [...temples, ...links];
  const uniqueMap = new Map(merged.map((item) => [item.Name, item]));

  let myTemple = Array.from(uniqueMap.values()).find(
    (item) => item.Name === userName
  );

  if (myTemple) {
    return myTemple;
  } else {
    // 如果在圣殿列表中找不到用户的圣殿，尝试通过API直接查询用户的圣殿列表
    const userTempleRes = await getUserTemples(
      userName,
      1,
      9999,
      userCharacterData.CharacterId.toString()
    );
    if (userTempleRes.State === 0 && userTempleRes.Value.Items.length > 0) {
      // 查找匹配当前角色ID的圣殿
      myTemple = userTempleRes.Value.Items.find(
        (item) => item.CharacterId === userCharacterData.CharacterId
      );
      return myTemple || null;
    } else {
      return null;
    }
  }
};

/**
 * 活股发生变化
 * @param {number} characterId - 角色ID
 * @param {string} userName - 用户名
 * @param {number} currentPage - 当前页数
 * @param {(CharacterDrawerData: CharacterDrawerData) => void} setCharacterDrawerData - 设置角色抽屉数据
 */
export const onActiveStockChange = async (
  characterId: number,
  userName: string,
  currentPage: number,
  setCharacterDrawerData: (CharacterDrawerData: CharacterDrawerData) => void
) => {
  const [userCharacterData, characterBoardMemberItems, characterUsersPageData] =
    await Promise.all([
      fetchUserCharacterData(characterId, userName),
      fetchCharacterBoardMemberItems(characterId),
      fetchCharacterUsersPageData(characterId, currentPage),
    ]);

  setCharacterDrawerData({
    userCharacterData,
    characterBoardMemberItems,
    characterUsersPageData,
  });
};

/**
 * 圣殿发生变化
 * @param {number} characterId - 角色ID
 * @param {string} userName - 用户名
 * @param {(CharacterDrawerData: CharacterDrawerData) => void} setCharacterDrawerData - 设置角色抽屉数据
 */
export const onTemplesChange = async (
  characterId: number,
  userName: string,
  setCharacterDrawerData: (CharacterDrawerData: CharacterDrawerData) => void
) => {
  const [
    characterTempleItems,
    characterLinkItems,
    characterDetailData,
    userCharacterData,
  ] = await Promise.all([
    fetchCharacterTempleItems(characterId),
    fetchCharacterLinkItems(characterId),
    fetchCharacterDetailData(characterId),
    fetchUserCharacterData(characterId, userName),
  ]);

  const userTempleData = await getUserTempleData(
    userCharacterData,
    characterTempleItems,
    characterLinkItems,
    userName
  );

  setCharacterDrawerData({
    userCharacterData,
    characterTempleItems,
    characterLinkItems,
    userTempleData,
    characterDetailData,
  });
};

/**
 * 获取用户委托数据
 * @param {number} characterId - 角色ID
 * @returns {Promise<UserTradingValue>} - 角色深度
 */
export const fatchUserTradingData = async (
  characterId: number
): Promise<UserTradingValue> => {
  const data = await getUserTrading(characterId);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取用户委托数据失败');
  }
};
