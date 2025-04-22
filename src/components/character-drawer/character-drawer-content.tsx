import { getCharacterDetail, getCharacterLinks, getCharacterPoolAmount, getCharacterTemple, getCharacterUsers, TempleItem } from "@/api/character";
import { getTinygrailCharacterData, getUserCharacterData, UserCharacterValue, getUserTemples } from "@/api/user";
import { cn, getCoverUrl } from "@/lib/utils";
import { useStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import CharacterDrawerBackground from "./character-drawer-background";
import styles from "./character-drawer-content.module.css";
import CharacterDrawerHeader from "./character-drawer-header";
import CharacterDrawerInfoCard from "./character-drawer-info-card";
import CharacterDrawerTabs from "./character-drawer-tabs";
import { verifyAuth } from "@/lib/auth";

interface CharacterDrawerContentProps {
  characterId: number | null;
}
/**
 * 角色抽屉Content
 * @param {CharacterDrawerContentProps} props - 组件属性
 * @param {number | null} props.characterId - 角色ID
 */
export default function CharacterDrawerContent({ characterId }: CharacterDrawerContentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
      initializeCharacterData();
      fatchTinygrailCharacterData(characterId);
      fetchGensokyoCharacterData(characterId);
      fetchCharacterPoolAmount(characterId);
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

      const userTemple = await getUserTemple(userCharacterDataRes.Value, templeDataRes.Value, linkDataRes.Value);

      setCharacterDrawerData({
        characterDetail: characterDetailRes.Value,
        userCharacterData: userCharacterDataRes.Value,
        characterTemples: templeDataRes.Value,
        characterlinks: linkDataRes.Value,
        userTemple: userTemple,
        currentCharacterUserPages: characterUsersRes.Value.Items,
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

  /**
   * 获取用户圣殿
   * @param {UserCharacterValue} userCharacterData - 用户角色数据
   * @param {TempleItem[]} temples - 圣殿数据
   * @param {TempleItem[]} links - LINK数据
   */
  const getUserTemple = async (userCharacterData: UserCharacterValue | null, temples: TempleItem[], links: TempleItem[]) => {
    if (!userCharacterData || userCharacterData.Sacrifices <= 0 || !userAssets?.name) return null;

    const merged = [...temples, ...links];
    const uniqueMap = new Map(merged.map(item => [item.Name, item]));

    let myTemple = Array.from(uniqueMap.values()).find(item => item.Name === userAssets.name);

    if (myTemple) {
      return myTemple;
    } else {
      if (userCharacterData && userCharacterData.CharacterId) {
        // 如果在圣殿列表中找不到用户的圣殿，尝试通过API直接查询用户的圣殿列表
        try {
          const userTempleRes = await getUserTemples(userAssets.name, 1, 9999, userCharacterData.CharacterId.toString());
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
   * 获取角色详情
   * @param {number | null} characterId - 角色ID
   */
  const fetchCharacterDetail = async (characterId: number | null) => {
    if (!characterId) return;
    try {
      const data = await getCharacterDetail(characterId);
      if (data.State === 0) {
        setCharacterDrawerData({
          characterDetail: data.Value, 
        });
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
   * @param {string} userName - 用户名
   */
  const fetchUserCharacterData = async (characterId: number | null, userName: string) => {
    if (!characterId || !userName) return;
    try {
      const data = await getUserCharacterData(characterId, userName);
      if (data.State === 0) {
        setCharacterDrawerData({
          userCharacterData: data.Value,
        });
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
   */
  const fetchCharacterTemple = async (characterId: number | null) => {
    if (!characterId) return;
    try {
      const data = await getCharacterTemple(characterId);
      if (data.State === 0) {
        setCharacterDrawerData({
          characterTemples: data.Value,
        });
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
   */
  const fetchCharacterLinks = async (characterId: number | null) => {
    if (!characterId) return;
    try {
      const data = await getCharacterLinks(characterId);
      if (data.State === 0) {
        setCharacterDrawerData({
          characterlinks: data.Value,
        });
      } else {
        throw new Error(data.Message || '获取LINK圣殿数据失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "获取LINK圣殿数据失败";
      console.error(errMsg);
    }
  };

  /**
   * 获取英灵殿角色数据
   * @param {number | null} characterId - 角色ID
   */
  const fatchTinygrailCharacterData = async (characterId: number | null) => {
    if (!characterId) return;
    try {
      const data = await getTinygrailCharacterData(characterId);
      if (data.State === 0) {
        setCharacterDrawerData({
          tinygrailCharacterData: data.Value,
        });
      } else {
        throw new Error(data.Message || '获取英灵殿角色数据失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "获取英灵殿角色数据失败";
      console.error(errMsg);
    }
  }

  /**
   * 获取幻想乡角色数据
   * @param {number | null} characterId - 角色ID
   */
  const fetchGensokyoCharacterData = async (characterId: number) => {
    if (!characterId) return;
    try {
      const data = await getUserCharacterData(characterId, "blueleaf");
      if (data.State === 0) {
        setCharacterDrawerData({
          gensokyoCharacterData: data.Value,
        });
      } else {
        throw new Error(data.Message || '获取幻想乡角色数据失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "获取幻想乡角色数据失败";
      console.error(errMsg);
    }
  };

  /**
   * 获取角色奖池数据
   * @param {number | null} characterId - 角色ID
   */
  const fetchCharacterPoolAmount = async (characterId: number | null) => {
    if (!characterId) return;
    try {
      const data = await getCharacterPoolAmount(characterId);
      if (data.State === 0) {
        setCharacterDrawerData({
          characterPoolAmount: data.Value,
        });
      } else {
        throw new Error(data.Message || '获取角色奖池数据失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "获取角色奖池数据失败";
      console.error(errMsg);
    }
  };

  /**
   * 获取角色持股用户分页数据
   * @param {number | null} characterId - 角色ID
   * @param {number} page - 页码
   */
  const fetchCharacterUserPages = async (characterId: number | null, page: number) => {
    if (!characterId) return;
    page = Math.max(page, 1);
    try {
      const data = await getCharacterUsers(characterId, page);
      if (data.State === 0) {
        setCharacterDrawerData({
          currentCharacterUserPages: data.Value.Items,
        });
      } else {
        throw new Error(data.Message || '获取角色持股用户分页数据失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "获取角色持股用户分页数据失败";
      console.error(errMsg);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className={cn("w-full pt-2 overflow-y-auto", styles.characterDrawerContent)}
    >
      <CharacterDrawerBackground backgroundImage={backgroundImage} scrollContainerRef={scrollContainerRef} />
      <CharacterDrawerHeader scrollContainerRef={scrollContainerRef} />
      <CharacterDrawerInfoCard />
      <CharacterDrawerTabs />
    </div>
  );
};