import { CharacterDetail, CharacterUserPageValue, CharacterUserValue, getCharacterDetail, getCharacterLinks, getCharacterPoolAmount, getCharacterTemple, getCharacterUsers, TempleItem } from "@/api/character";
import { getTinygrailCharacterData, getUserCharacterData, getUserTemples, TinygrailCharacterValue, UserCharacterValue } from "@/api/user";
import { verifyAuth } from "@/lib/auth";
import { cn, getCoverUrl } from "@/lib/utils";
import { useStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import CharacterDrawerBackground from "./character-drawer-background";
import styles from "./character-drawer-content.module.css";
import CharacterDrawerHeader from "./character-drawer-header";
import CharacterDrawerInfoCard from "./character-drawer-info-card";
import CharacterDrawerTabs from "./character-drawer-tabs";

interface CharacterDrawerContentProps {
  characterId: number | null;
}
/**
 * 角色抽屉Content
 * @param {CharacterDrawerContentProps} props - 组件属性
 * @param {number | null} props.characterId - 角色ID
 */
export default function CharacterDrawerContent({ characterId }: CharacterDrawerContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const { userAssets, setUserAssets, characterDrawerData, setCharacterDrawerData } = useStore();
  const {
    characterTemples = [],
    characterlinks = [],
  } = characterDrawerData;

  useEffect(() => {
    setBackgroundImage("");

    if (characterId) {
      verifyAuth(setUserAssets);
      initializeCharacterData().then(() => {
        fatchTinygrailCharacterData(
          characterId,
          (tinygrailCharacterData) => {
            setCharacterDrawerData({ tinygrailCharacterData });
          }
        );
        fetchGensokyoCharacterData(
          characterId,
          (gensokyoCharacterData) => {
            setCharacterDrawerData({ gensokyoCharacterData });
          }
        );
        fetchCharacterPoolAmount(
          characterId,
          (characterPoolAmount) => {
            setCharacterDrawerData({ characterPoolAmount });
          }
        );
      });
      // 滚动到顶部
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  }, [characterId, userAssets?.name]);

  /**
   * 监听圣殿数据变化，更新背景图片
   */
  useEffect(() => {
    const merged = [...characterTemples, ...characterlinks];
    const uniqueMap = new Map(merged.map(item => [item.Name, item]));

    let maxSacrificesTemple = null;

    for (const item of uniqueMap.values()) {
      if (!maxSacrificesTemple || (item.Sacrifices || 0) > (maxSacrificesTemple.Sacrifices || 0)) {
        maxSacrificesTemple = item;
      }
    }

    setBackgroundImage(getCoverUrl(maxSacrificesTemple?.Cover || ""));
  }, [characterTemples, characterlinks]);

  /**
   * 初始化角色数据
   */
  const initializeCharacterData = async () => {
    if (!characterId || !userAssets?.name) return;

    try {
      setCharacterDrawerData({
        loading: true,
      })
      const [characterDetailRes, userCharacterDataRes, templeDataRes, linkDataRes, characterUsersRes] = await Promise.all([
        getCharacterDetail(characterId),
        getUserCharacterData(characterId, userAssets.name),
        getCharacterTemple(characterId),
        getCharacterLinks(characterId),
        getCharacterUsers(characterId),
      ]);

      if (characterDetailRes.State !== 0) {
        throw new Error(characterDetailRes.Message || '获取角色详情失败');
      }

      if (userCharacterDataRes.State !== 0) {
        throw new Error(userCharacterDataRes.Message || '获取用户角色数据失败');
      }

      if (templeDataRes.State !== 0) {
        throw new Error(templeDataRes.Message || '获取圣殿数据失败');
      }

      if (linkDataRes.State !== 0) {
        throw new Error(linkDataRes.Message || '获取LINK圣殿数据失败');
      }

      if (characterUsersRes.State !== 0) {
        throw new Error(characterUsersRes.Message || '获取角色持股用户失败');
      }

      const userTemple = await getUserTemple(userCharacterDataRes.Value, templeDataRes.Value, linkDataRes.Value, userAssets.name);

      setCharacterDrawerData({
        characterDetail: characterDetailRes.Value,
        userCharacterData: userCharacterDataRes.Value,
        characterTemples: templeDataRes.Value,
        characterlinks: linkDataRes.Value,
        userTemple: userTemple,
        currentCharacterUserPageData: characterUsersRes.Value,
        characterBoardMembers: characterUsersRes.Value.Items.slice(0, 10),
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "数据加载失败";
      console.error(errMsg);
      setCharacterDrawerData({
        error: errMsg,
      });
    } finally {
      setCharacterDrawerData({
        loading: false,
      })
    }
  };

  return (
    <div
      ref={contentRef}
      className={cn("w-full pt-2 overflow-y-auto", styles.characterDrawerContent)}
    >
      <CharacterDrawerBackground backgroundImage={backgroundImage} scrollContainerRef={contentRef} />
      <CharacterDrawerHeader scrollContainerRef={contentRef} />
      <CharacterDrawerInfoCard />
      <CharacterDrawerTabs />
    </div>
  );
};

/**
 * 获取角色详情
 * @param {number | null} characterId - 角色ID
 * @param {(characterDetail: CharacterDetail) => void} callback - 回调函数
 * @returns {Promise<CharacterDetail | undefined>} - 角色详情
 */
export const fetchCharacterDetail = async (
  characterId: number | null,
  callback: (characterDetail: CharacterDetail) => void
): Promise<CharacterDetail | undefined> => {
  if (!characterId) return;
  try {
    const data = await getCharacterDetail(characterId);
    if (data.State === 0) {
      callback(data.Value);
      return data.Value;
    } else {
      throw new Error(data.Message || '获取角色详情失败');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "获取角色详情失败";
    console.error(errMsg);
  }
};

/**
   * 获取用户角色数据
   * @param {number | null} characterId - 角色ID
   * @param {string | undefined} userName - 用户名
   * @param {(userCharacterData: UserCharacterValue) => void} callback - 回调函数
   * @returns {Promise<UserCharacterValue | undefined>} - 用户角色数据
   */
export const fetchUserCharacterData = async (
  characterId: number | null,
  userName: string | undefined,
  callback: (userCharacterData: UserCharacterValue) => void
): Promise<UserCharacterValue | undefined> => {
  if (!characterId || !userName) return;
  try {
    const data = await getUserCharacterData(characterId, userName);
    if (data.State === 0) {
      callback(data.Value);
      return data.Value;
    } else {
      throw new Error(data.Message || '获取用户角色数据失败');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "获取用户角色数据失败";
    console.error(errMsg);
  }
};

/**
 * 获取圣殿数据
 * @param {number | null} characterId - 角色ID
 * @param {(characterTemples: TempleItem[]) => void} callback - 回调函数
 * @returns {Promise<TempleItem[] | undefined>} - 圣殿数据
 */
export const fetchCharacterTemple = async (
  characterId: number | null,
  callback: (characterTemples: TempleItem[]) => void
): Promise<TempleItem[] | undefined> => {
  if (!characterId) return;
  try {
    const data = await getCharacterTemple(characterId);
    if (data.State === 0) {
      callback(data.Value);
      return data.Value;
    } else {
      throw new Error(data.Message || '获取圣殿数据失败');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "获取圣殿数据失败";
    console.error(errMsg);
  }
};

/**
 * 获取LINK数据
 * @param {number | null} characterId - 角色ID
 * @param {(characterlinks: TempleItem[]) => void} callback - 回调函数
 * @returns {Promise<TempleItem[] | undefined>} - LINK数据
 */
export const fetchCharacterLinks = async (
  characterId: number | null,
  callback: (characterlinks: TempleItem[]) => void
): Promise<TempleItem[] | undefined> => {
  if (!characterId) return;
  try {
    const data = await getCharacterLinks(characterId);
    if (data.State === 0) {
      callback(data.Value);
      return data.Value;
    } else {
      throw new Error(data.Message || '获取LINK圣殿数据失败');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "获取LINK圣殿数据失败";
    console.error(errMsg);
  }
};


/**
 * 获取用户圣殿
 * @param {UserCharacterValue | null} userCharacterData - 用户角色数据
 * @param {TempleItem[]} temples - 圣殿数据
 * @param {TempleItem[]} links - LINK数据
 * @param {string | undefined} userName - 用户名
 * @returns {Promise<TempleItem | null>} - 用户圣殿数据
 */
export const getUserTemple = async (
  userCharacterData: UserCharacterValue | null,
  temples: TempleItem[],
  links: TempleItem[],
  userName: string | undefined
): Promise<TempleItem | null> => {
  if (!userCharacterData || userCharacterData.Sacrifices <= 0 || !userName) return null;

  const merged = [...temples, ...links];
  const uniqueMap = new Map(merged.map(item => [item.Name, item]));

  let myTemple = Array.from(uniqueMap.values()).find(item => item.Name === userName) || null;

  if (myTemple) {
    return myTemple;
  } else {
    if (userCharacterData && userCharacterData.CharacterId) {
      // 如果在圣殿列表中找不到用户的圣殿，尝试通过API直接查询用户的圣殿列表
      try {
        const userTempleRes = await getUserTemples(userName, 1, 9999, userCharacterData.CharacterId.toString());
        if (userTempleRes.State === 0 && userTempleRes.Value.Items.length > 0) {
          // 查找匹配当前角色ID的圣殿
          const foundTemple = userTempleRes.Value.Items.find(item => item.CharacterId === userCharacterData.CharacterId);
          if (foundTemple) {
            myTemple = foundTemple;
          }
        }
      } catch (err) {
        console.error('获取用户圣殿数据失败:', err);
      }
    }
  }

  return myTemple || null;
}

/**
 * 获取幻想乡角色数据
 * @param {number | null} characterId - 角色ID
 * @param {(gensokyoCharacterData: UserCharacterValue) => void} callback - 回调函数
 * @returns {Promise<UserCharacterValue | undefined>} - 幻想乡角色数据
 */
export const fetchGensokyoCharacterData = async (
  characterId: number,
  callback: (gensokyoCharacterData: UserCharacterValue) => void
): Promise<UserCharacterValue | undefined> => {
  if (!characterId) return;
  try {
    const data = await getUserCharacterData(characterId, "blueleaf");
    if (data.State === 0) {
      callback(data.Value);
      return data.Value;
    } else {
      throw new Error(data.Message || '获取幻想乡角色数据失败');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "获取幻想乡角色数据失败";
    console.error(errMsg);
  }
};

/**
 * 获取英灵殿角色数据
 * @param {number | null} characterId - 角色ID
 * @param {(tinygrailCharacterData: TinygrailCharacterValue) => void} callback - 回调函数
 * @returns {Promise<TinygrailCharacterValue | undefined>} - 英灵殿角色数据
 */
export const fatchTinygrailCharacterData = async (
  characterId: number | null,
  callback: (tinygrailCharacterData: TinygrailCharacterValue) => void
): Promise<TinygrailCharacterValue | undefined> => {
  if (!characterId) return;
  try {
    const data = await getTinygrailCharacterData(characterId);
    if (data.State === 0) {
      callback(data.Value);
      return data.Value;
    } else {
      throw new Error(data.Message || '获取英灵殿角色数据失败');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "获取英灵殿角色数据失败";
    console.error(errMsg);
  }
}

/**
 * 获取角色奖池数据
 * @param {number | null} characterId - 角色ID
 * @returns {Promise<void>} - 角色奖池数量
 * @returns {Promise<number | undefined>} - 角色奖池数量
 */
export const fetchCharacterPoolAmount = async (
  characterId: number | null,
  callback: (characterPoolAmount: number) => void
): Promise<number | undefined> => {
  if (!characterId) return;
  try {
    const data = await getCharacterPoolAmount(characterId);
    if (data.State === 0) {
      callback(data.Value);
      return data.Value;
    } else {
      throw new Error(data.Message || '获取角色奖池数据失败');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "获取角色奖池数据失败";
    console.error(errMsg);
  }
};

/**
 * 获取角色董事会成员
 * @param {number | null} characterId - 角色ID
 * @param {(characterBoardMembers: CharacterUserValue[]) => void} callback - 回调函数
 */
export const fetchCharacterBoardMembers = async (
  characterId: number | null,
  callback: (characterBoardMembers: CharacterUserValue[]) => void
): Promise<CharacterUserValue[] | undefined> => {
  if (!characterId) return;
  try {
    const data = await getCharacterUsers(characterId, 1, 10);
    if (data.State === 0) {
      callback(data.Value.Items);
      return data.Value.Items;
    } else {
      throw new Error(data.Message || '获取角色董事会成员数据失败');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "获取角色董事会成员数据失败";
    console.error(errMsg);
  }
};

/**
 * 获取角色持股用户分页数据
 * @param {number | null} characterId - 角色ID
 * @param {number} page - 页码
 */
export const fetchCharacterUserPageData = async (
  characterId: number | null,
  page: number,
  callback: (currentCharacterUserPageData: CharacterUserPageValue) => void
): Promise<CharacterUserPageValue | undefined> => {
  if (!characterId) return;
  page = Math.max(page, 1);
  try {
    const data = await getCharacterUsers(characterId, page);
    if (data.State === 0) {
      callback(data.Value);
      return data.Value;
    } else {
      throw new Error(data.Message || '获取角色持股用户分页数据失败');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "获取角色持股用户分页数据失败";
    console.error(errMsg);
  }
};
