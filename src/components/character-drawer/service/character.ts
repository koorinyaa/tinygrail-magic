import {
  CharacterDepthInfo,
  CharacterDetail,
  CharacterICOItem,
  CharacterUserPageValue,
  CharacterUserValue,
  getCharacterDepth,
  getCharacterDetail,
  getCharacterLinks,
  getCharacterPoolAmount,
  getCharacterTemples,
  getCharacterUsers,
  getIcoUsersPage,
  IcoUsersPageValue,
  TempleItem,
} from '@/api/character';
import {
  getTinygrailCharacterData,
  getUserCharacterData,
  TinygrailCharacterValue,
  UserCharacterValue,
} from '@/api/user';

/**
 * 获取角色详情
 * @param {number | null} characterId - 角色ID
 * @returns {Promise<CharacterDetail | CharacterICOItem>} - 角色详情
 */
export const fetchCharacterDetailData = async (
  characterId: number
): Promise<CharacterDetail | CharacterICOItem> => {
  const data = await getCharacterDetail(characterId);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取角色详情失败');
  }
};

/**
 * 获取圣殿数据
 * @param {number} characterId - 角色ID
 * @returns {Promise<TempleItem[]>} - 圣殿数据
 */
export const fetchCharacterTempleItems = async (
  characterId: number
): Promise<TempleItem[]> => {
  const data = await getCharacterTemples(characterId);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取圣殿数据失败');
  }
};

/**
 * 获取LINK数据
 * @param {number} characterId - 角色ID
 * @returns {Promise<TempleItem[]>} - LINK数据
 */
export const fetchCharacterLinkItems = async (
  characterId: number
): Promise<TempleItem[]> => {
  const data = await getCharacterLinks(characterId);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取LINK圣殿数据失败');
  }
};

/**
 * 获取幻想乡角色数据
 * @param {number} characterId - 角色ID
 * @returns {Promise<UserCharacterValue>} - 幻想乡角色数据
 */
export const fetchGensokyoCharacterData = async (
  characterId: number
): Promise<UserCharacterValue> => {
  const data = await getUserCharacterData(characterId, 'blueleaf');
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取幻想乡角色数据失败');
  }
};

/**
 * 获取英灵殿角色数据
 * @param {number} characterId - 角色ID
 * @returns {Promise<TinygrailCharacterValue>} - 英灵殿角色数据
 */
export const fatchTinygrailCharacterData = async (
  characterId: number
): Promise<TinygrailCharacterValue> => {
  const data = await getTinygrailCharacterData(characterId);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取英灵殿角色数据失败');
  }
};

/**
 * 获取角色奖池数量
 * @param {number} characterId - 角色ID
 * @returns {Promise<number>} - 角色奖池数量
 */
export const fetchCharacterPoolAmount = async (
  characterId: number
): Promise<number | undefined> => {
  const data = await getCharacterPoolAmount(characterId);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取角色奖池数据失败');
  }
};

/**
 * 获取角色董事会成员
 * @param {number} characterId - 角色ID
 * @returns {Promise<CharacterUserValue[]>} - 角色董事会成员
 */
export const fetchCharacterBoardMemberItems = async (
  characterId: number
): Promise<CharacterUserValue[]> => {
  const data = await getCharacterUsers(characterId, 1, 10);
  if (data.State === 0) {
    return data.Value.Items;
  } else {
    throw new Error(data.Message || '获取角色董事会成员数据失败');
  }
};

/**
 * 获取角色持股用户分页数据
 * @param {number} characterId - 角色ID
 * @param {number} page - 页码
 * @returns {Promise<CharacterUserPageValue>} - 角色持股用户分页数据
 */
export const fetchCharacterUsersPageData = async (
  characterId: number,
  page: number
): Promise<CharacterUserPageValue> => {
  page = Math.max(page, 1);

  const data = await getCharacterUsers(characterId, page);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取角色持股用户分页数据失败');
  }
};

/**
 * 获取角色深度数据
 * @param {number} characterId - 角色ID
 * @returns {Promise<CharacterDepthInfo>} - 角色深度
 */
export const fatchCharacterDepthData = async (
  characterId: number
): Promise<CharacterDepthInfo> => {
  const data = await getCharacterDepth(characterId);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取角色深度数据失败');
  }
};

/**
 * 获取ICO用户分页数据
 * @param {number} icoId  - ICO ID
 * @param {number} [page] - 页码
 * @returns {Promise<IcoUsersPageValue>} - ICO用户分页数据
 */
export const fatchIcoUsersPageData = async (
  icoId: number,
  page: number = 1
): Promise<IcoUsersPageValue> => {
  page = Math.max(page, 1);

  const data = await getIcoUsersPage(icoId, page);
  if (data.State === 0) {
    return data.Value;
  } else {
    throw new Error(data.Message || '获取ICO用户分页数据失败');
  }
};
