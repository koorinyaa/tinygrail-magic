import {
  CharacterDetail,
  CharacterUserPageValue,
  CharacterUserValue,
  TempleItem,
} from '@/api/character';
import {
  getUserCharacterData,
  getUserTemples,
  UserCharacterValue,
} from '@/api/user';
import {
  fetchCharacterBoardMembersData,
  fetchCharacterDetailData,
  fetchCharacterLinksData,
  fetchCharacterTemplesData,
  fetchCharacterUsersPageData,
} from './character';
import { isEmpty } from '@/lib/utils';

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
 * 活股变化
 * @param {number} characterId - 角色ID
 * @param {string} userName - 用户名
 * @param {number} currentPage - 当前页数
 * @returns {Promise<{
 *   userCharacterData: UserCharacterValue;
 *   characterBoardMembersData: CharacterUserValue[];
 *   characterUsersPageData: CharacterUserPageValue;
 * }>} - 返回数据（用户角色数据、董事会成员、当前分页角色成员）
 */
export const onActiveStockChange = async (
  characterId: number,
  userName: string,
  currentPage: number
): Promise<{
  userCharacterData: UserCharacterValue;
  characterBoardMembersData: CharacterUserValue[];
  characterUsersPageData: CharacterUserPageValue;
}> => {
  const [userCharacterData, characterBoardMembersData, characterUsersPageData] =
    await Promise.all([
      fetchUserCharacterData(characterId, userName),
      fetchCharacterBoardMembersData(characterId),
      fetchCharacterUsersPageData(characterId, currentPage),
    ]);

  return {
    userCharacterData,
    characterBoardMembersData,
    characterUsersPageData,
  };
};

/**
 * 圣殿变化
 * @param {number} characterId - 角色ID
 * @param {string} userName - 用户名
 * @returns {Promise<{
 *   characterTemplesData: TempleItem[];
 *   characterLinksData: TempleItem[];
 *   userTempleData: TempleItem | null;
 *   characterDetailData: CharacterDetail;
 *   userCharacterData: UserCharacterValue;
 * }>} - 返回数据（圣殿数据、LINK数据、用户圣殿数据、角色详情数据、用户角色数据）
 */
export const onTemplesChange = async (
  characterId: number,
  userName: string
): Promise<{
  characterTemplesData: TempleItem[];
  characterLinksData: TempleItem[];
  userTempleData: TempleItem | null;
  characterDetailData: CharacterDetail;
  userCharacterData: UserCharacterValue;
}> => {
  const [
    characterTemplesData,
    characterLinksData,
    characterDetailData,
    userCharacterData,
  ] = await Promise.all([
    fetchCharacterTemplesData(characterId),
    fetchCharacterLinksData(characterId),
    fetchCharacterDetailData(characterId),
    fetchUserCharacterData(characterId, userName),
  ]);

  const userTempleData = await getUserTempleData(
    userCharacterData,
    characterTemplesData,
    characterLinksData,
    userName
  );

  return {
    characterTemplesData,
    characterLinksData,
    userTempleData,
    characterDetailData,
    userCharacterData,
  };
};
