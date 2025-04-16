import { CharacterDetail, getCharacterDetail, getCharacterLinks, getCharacterTemple, getUserTemples, TempleItem } from "@/api/character";
import { getUserCharacterData, UserCharacterValue } from "@/api/user";
import { useAppState } from "@/components/app-state-provider";
import { cn, getCoverUrl } from "@/lib/utils";
import { ReactNode, useEffect, useRef, useState } from "react";
import CharacterDrawerBackground from "./character-drawer-background";
import styles from "./character-drawer-content.module.css";
import CharacterDrawerInfoCard from "./character-drawer-info-card";
import CharacterDrawerTabs from "./character-drawer-tabs";
import CharacterDrawerHeader from "./character-drawer-header";

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
  const [characterDetail, setCharacterDetail] = useState<CharacterDetail | null>(null);
  const [myTemple, setMyTemple] = useState<TempleItem | null>(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userCharacterData, setUserCharacterData] = useState<UserCharacterValue | null>(null);
  const [templeData, setTempleData] = useState<TempleItem[]>([]);
  const [linksData, setLinksData] = useState<TempleItem[]>([]);
  const { state } = useAppState();

  useEffect(() => {
    if (characterId) {
      initializeCharacterData();
    }
  }, [characterId, state.userAssets.name]);

  /**
   * 监听圣殿数据变化，更新背景图片
   */
  useEffect(() => {
    const merged = [...templeData, ...linksData];
    const uniqueMap = new Map(merged.map(item => [item.Name, item]));

    let maxSacrificesTemple = null;

    for (const item of uniqueMap.values()) {
      if (!maxSacrificesTemple || (item.Sacrifices || 0) > (maxSacrificesTemple.Sacrifices || 0)) {
        maxSacrificesTemple = item;
      }
    }

    setBackgroundImage(getCoverUrl(maxSacrificesTemple?.Cover || ""));
  }, [templeData, linksData]);

  /**
   * 初始化角色数据
   */
  const initializeCharacterData = async () => {
    if (!characterId) return;

    try {
      setLoading(true);
      const [characterDetailRes, userCharacterDataRes, templeDataRes, linkDataRes] = await Promise.all([
        getCharacterDetail(characterId),
        getUserCharacterData(characterId, state.userAssets.name),
        getCharacterTemple(characterId),
        getCharacterLinks(characterId),
      ]);

      if (characterDetailRes.State === 0) {
        setCharacterDetail(characterDetailRes.Value);
      } else {
        throw new Error(characterDetailRes.Message || '获取角色详情失败');
      }

      if (userCharacterDataRes.State === 0) {
        setUserCharacterData(userCharacterDataRes.Value);
      } else {
        throw new Error(userCharacterDataRes.Message || '获取用户角色数据失败');
      }

      if (templeDataRes.State === 0) {
        setTempleData(templeDataRes.Value);
      } else {
        throw new Error(templeDataRes.Message || '获取圣殿数据失败');
      }

      if (linkDataRes.State === 0) {
        setLinksData(linkDataRes.Value);
      } else {
        throw new Error(linkDataRes.Message || '获取LINK圣殿数据失败');
      }

      const myTempleResult = await getMyTemple(userCharacterDataRes.Value, templeDataRes.Value, linkDataRes.Value);
      setMyTemple(myTempleResult);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "数据加载失败";
      console.error(errMsg);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取我的圣殿
   * @param {UserCharacterValue} userCharacterData - 用户角色数据
   * @param {TempleItem[]} temples - 圣殿数据
   * @param {TempleItem[]} links - LINK数据
   */
  const getMyTemple = async (userCharacterData: UserCharacterValue | null, temples: TempleItem[], links: TempleItem[]) => {
    if (!userCharacterData || userCharacterData.Sacrifices <= 0) return null;

    const merged = [...temples, ...links];
    const uniqueMap = new Map(merged.map(item => [item.Name, item]));

    let myTemple = Array.from(uniqueMap.values()).find(item => item.Name === state.userAssets.name);

    if (myTemple) {
      return myTemple;
    } else {
      if (userCharacterData && userCharacterData.CharacterId) {
        // 如果在圣殿列表中找不到用户的圣殿，尝试通过API直接查询用户的圣殿列表
        try {
          const userTempleRes = await getUserTemples(state.userAssets.name, 1, 9999, userCharacterData.CharacterId.toString());
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

  // 获取角色详情
  const fetchCharacterDetail = async (characterId: number | null) => {
    if (!characterId) return;
    try {
      const data = await getCharacterDetail(characterId);
      if (data.State === 0) {
        setCharacterDetail(data.Value);
      } else {
        throw new Error(data.Message || '获取角色详情失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "获取角色详情失败";
      console.error(errMsg);
    }
  };

  // 获取用户角色数据
  const fetchUserCharacterData = async (characterId: number | null, userName: string) => {
    if (!characterId || !userName) return;
    try {
      const data = await getUserCharacterData(characterId, userName);
      if (data.State === 0) {
        setUserCharacterData(data.Value);
      } else {
        throw new Error(data.Message || '获取用户角色数据失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "获取用户角色数据失败";
      console.error(errMsg);
    }
  };

  // 获取圣殿数据
  const fetchCharacterTemple = async (characterId: number | null) => {
    if (!characterId) return;
    try {
      const data = await getCharacterTemple(characterId);
      if (data.State === 0) {
        setTempleData(data.Value);
      } else {
        throw new Error(data.Message || '获取圣殿数据失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "获取圣殿数据失败";
      console.error(errMsg);
    }
  };

  // 获取LINK数据
  const fetchCharacterLinks = async (characterId: number | null) => {
    if (!characterId) return;
    try {
      const data = await getCharacterLinks(characterId);
      if (data.State === 0) {
        setLinksData(data.Value);
      } else {
        throw new Error(data.Message || '获取LINK圣殿数据失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "获取LINK圣殿数据失败";
      console.error(errMsg);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className={cn("w-full pt-2 overflow-y-auto", styles.characterDrawerContent)}
    >
      <CharacterDrawerBackground backgroundImage={backgroundImage} scrollContainerRef={scrollContainerRef} />
      <CharacterDrawerHeader scrollContainerRef={scrollContainerRef} data={characterDetail} />
      <CharacterDrawerInfoCard
        loading={loading}
        data={characterDetail}
      />
      <CharacterDrawerTabs
        loading={loading}
        characterDetail={characterDetail}
        userCharacterData={userCharacterData}
        myTemple={myTemple}
      />
    </div>
  );
};