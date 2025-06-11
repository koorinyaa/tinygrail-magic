import { CharacterDetail, searchCharacter } from '@/api/character';
import { useGuidepost } from '@/api/magic-item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { verifyAuth } from '@/lib/auth';
import {
  cn,
  decodeHTMLEntities,
  formatCurrency,
  formatInteger,
  getAvatarUrl,
  notifyError,
  urlEncode,
} from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  fatchTinygrailCharacterData,
  fetchCharacterDetailData,
  fetchCharacterPoolAmount,
  fetchGensokyoCharacterData,
} from '../../service/character';
import {
  fetchUserCharacterData,
  onActiveStockChange,
  onTemplesChange,
} from '../../service/user';

/**
 * 虚空道标
 * @param {() => void} onClose 关闭回调
 */
export function Guidepost({ onClose }: { onClose: () => void }) {
  const {
    userAssets,
    setUserAssets,
    openCharacterDrawer,
    setCharacterDrawer,
    characterDrawerData,
    setCharacterDrawerData,
  } = useStore();
  const { characterDetailData } = characterDrawerData;
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  // 防抖搜索关键词
  const debouncedSearchTerm = useDebounce(keyword, 1000);
  // 搜索结果
  const [searchResults, setSearchResults] = useState<CharacterDetail[]>([]);
  // 上次选择
  const [lastGuidepost, setLastGuidepost] = useState<CharacterDetail | null>(
    localStorage.getItem('tinygrail-magic:lastGuidepost')
      ? (JSON.parse(
          localStorage.getItem('tinygrail-magic:lastGuidepost') as string
        ) as CharacterDetail)
      : null
  );
  // 选中角色
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterDetail | null>(null);

  useEffect(() => {
    setCharacterDrawer({
      handleOnly: true,
    });

    if (lastGuidepost) {
      updateLastGuidepost();
    }

    return () => {
      setCharacterDrawer({
        handleOnly: false,
      });
    };
  }, []);

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm]);

  /**
   * 更新上次选择角色信息
   */
  const updateLastGuidepost = async () => {
    if (!userAssets || !lastGuidepost) return;

    try {
      const characterDetailData = await fetchCharacterDetailData(
        lastGuidepost.CharacterId
      );
      const userCharacterData = await fetchUserCharacterData(
        lastGuidepost.CharacterId,
        userAssets.name
      );
      if ('Current' in characterDetailData) {
        setLastGuidepost({
          ...characterDetailData,
          UserTotal: userCharacterData.Total,
        });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '获取角色详情失败';
      console.error(errMsg);
      setLastGuidepost(null);
      localStorage.removeItem('tinygrail-magic:lastGuidepost');
    }
  };

  /**
   * 搜索角色
   */
  const handleSearch = async () => {
    try {
      const response = await searchCharacter(urlEncode(debouncedSearchTerm));
      if (response.State === 0) {
        const characters = response.Value.slice(0, 5);
        setSearchResults(characters);
      } else {
        throw new Error(response.Message || '搜索失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '搜索失败';
      notifyError(errMsg);
    }
  };

  /**
   * 使用虚空道标
   */
  const handleUseGuidepost = async () => {
    if (!userAssets || !characterDetailData || !selectedCharacter) return;

    setLoading(true);

    try {
      verifyAuth(setUserAssets);

      const response = await useGuidepost(
        characterDetailData.CharacterId,
        selectedCharacter.CharacterId
      );
      if (response.State === 0) {
        const {
          // 角色ID
          Id,
          // 角色名称
          Name,
          // 数量
          Amount,
          // 买一价
          SellPrice,
        } = response.Value;
        toast.success('使用成功', {
          duration: Infinity,
          cancel: {
            label: '查看',
            onClick: () => {
              openCharacterDrawer(Id);
            },
          },
          description: (
            <span>
              <span>
                获得#{Id}「{decodeHTMLEntities(Name)}」
                <span className='mr-0.5 text-green-400 dark:text-green-600"'>
                  {Amount}
                </span>
                股
              </span>
              <br />
              <span>
                当前买一价
                <span className='mx-0.5 text-green-400 dark:text-green-600"'>
                  ₵{formatCurrency(SellPrice)}
                </span>
              </span>
            </span>
          ),
        });
        onClose();

        // 更新上次选择
        localStorage.setItem(
          'tinygrail-magic:lastGuidepost',
          JSON.stringify(selectedCharacter)
        );

        // 圣殿变化更新相关数据
        await onTemplesChange(
          characterDetailData.CharacterId,
          userAssets.name,
          setCharacterDrawerData
        );

        // 如果当前角色是目标角色，则更新角色数据
        if (characterDetailData.CharacterId === Id) {
          // 活股变化更新相关数据
          await onActiveStockChange(
            characterDetailData.CharacterId,
            userAssets.name,
            characterDrawerData.currentCharacterUsersPage || 1,
            setCharacterDrawerData
          );

          // 获取幻想乡数据
          const gensokyoCharacterData = await fetchGensokyoCharacterData(
            characterDetailData.CharacterId
          );
          // 获取英灵殿数据
          const tinygrailCharacterData = await fatchTinygrailCharacterData(
            characterDetailData.CharacterId
          );
          // 获取奖池数量
          const characterPoolAmount = await fetchCharacterPoolAmount(
            characterDetailData.CharacterId
          );
          setCharacterDrawerData({
            gensokyoCharacterData,
            tinygrailCharacterData,
            characterPoolAmount,
          });
        }
      } else {
        onClose();
        throw new Error(response.Message || '虚空道标使用失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '虚空道标使用失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 角色项
   * @param {CharacterDetail} character 角色详情
   */
  const CharacterItem = ({ character }: { character: CharacterDetail }) => (
    <div
      key={character.CharacterId}
      className="flex flex-row gap-x-1.5 p-1 hover:bg-accent rounded-sm cursor-pointer"
      onClick={() => {
        setSelectedCharacter(character);
      }}
    >
      <div>
        <Avatar className="size-8 rounded-full">
          <AvatarImage
            className="object-cover object-top"
            src={getAvatarUrl(character.Icon)}
            alt={decodeHTMLEntities(character.Name)}
          />
          <AvatarFallback className="rounded-lg">C</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center text-xs font-semibold">
          <span className="truncate">
            #{character.CharacterId}「{decodeHTMLEntities(character.Name)}」
          </span>
          <BadgeLevel level={character.Level} zeroCount={character.ZeroCount} />
        </div>
        <div className="flex items-center gap-x-2 h-4 text-xs opacity-60">
          <span className="truncate">
            持股：{formatInteger(character.UserTotal)}
          </span>
        </div>
      </div>
    </div>
  );

  if (selectedCharacter) {
    if (!characterDetailData) return null;

    return (
      <div className="w-full h-fit flex flex-col gap-y-4 items-center">
        <div className="flex flex-col space-y-2 text-center">
          <h2 className="text-lg font-semibold">提示</h2>
          <p className="text-sm text-muted-foreground">
            是否消耗「{characterDetailData.Name}」100点固定资产获取「
            {selectedCharacter.Name}」的随机数量（10-100）股份？
          </p>
        </div>
        <div className="flex-1 flex flex-row w-full gap-x-2">
          <Button
            className="flex-1 h-8 rounded-full"
            disabled={loading}
            onClick={handleUseGuidepost}
          >
            <LoaderCircleIcon
              className={cn('-ms-1 animate-spin', { hidden: !loading })}
              size={16}
              aria-hidden="true"
            />
            确定
          </Button>
          <Button
            className="flex-1 h-8 rounded-full"
            variant="secondary"
            disabled={loading}
            onClick={() => {
              setSelectedCharacter(null);
            }}
          >
            <LoaderCircleIcon
              className={cn('-ms-1 animate-spin', { hidden: !loading })}
              size={16}
              aria-hidden="true"
            />
            重新选择
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit flex flex-col">
      <div className="*:not-first:mt-2">
        <div className="relative">
          <Input
            className="ps-9 pe-9 text-base"
            placeholder="搜索角色"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <SearchIcon size={16} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {lastGuidepost && (
          <>
            <p className="text-xs opacity-60 py-2">上次选择</p>
            <div>
              <CharacterItem character={lastGuidepost} />
            </div>
          </>
        )}
        <p className="text-xs opacity-60 py-2">请选择虚空道标的对象</p>
        <div className="flex flex-col">
          {searchResults.map((character) => {
            return (
              <CharacterItem
                key={character.CharacterId}
                character={character}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
