import { TempleItem } from '@/api/character';
import { templeLink } from '@/api/temple';
import { getUserTemples, UserTemplePageValue } from '@/api/user';
import { Link } from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { verifyAuth } from '@/lib/auth';
import { cn, decodeHTMLEntities, getAvatarUrl, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { onTemplesChange } from '../../service/user';

/**
 * 更换LINK
 */
export function ChangeLink({ onClose }: { onClose: () => void }) {
  const {
    userAssets,
    setUserAssets,
    characterDrawer,
    setCharacterDrawer,
    characterDrawerData,
    setCharacterDrawerData,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const { characterDetailData, userTempleData } = characterDrawerData;
  const [keyword, setKeyword] = useState('');
  const debouncedSearchTerm = useDebounce(keyword, 1000);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 当前圣殿分页数据
  const [userTemplePageValue, setUserTemplePageValue] =
    useState<UserTemplePageValue>();
  // 选中的圣殿
  const [selectedTemple, setSelectedTemple] = useState<TempleItem>();

  useEffect(() => {
    setCharacterDrawer({
      handleOnly: true,
    });

    return () => {
      setCharacterDrawer({
        handleOnly: false,
      });
    };
  }, []);

  useEffect(() => {
    searchUserTemple();
  }, [debouncedSearchTerm, currentPage]);

  /**
   * 搜索用户圣殿
   */
  const searchUserTemple = async () => {
    if (!userAssets?.name) return;

    setLoading(true);

    try {
      const result = await getUserTemples(
        userAssets?.name,
        currentPage,
        6,
        keyword
      );
      if (result.State === 0) {
        setUserTemplePageValue(result.Value);
      } else {
        notifyError(result.Message || '');
      }
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : '获取用户圣殿数据失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * LINK
   */
  const handleLink = async () => {
    if (!userAssets?.id || !characterDrawer.characterId || !selectedTemple)
      return;

    setLoading(true);

    try {
      // 验证用户登录状态
      verifyAuth(setUserAssets);
      const result = await templeLink(
        characterDrawer.characterId,
        selectedTemple.CharacterId
      );
      if (result.State === 0) {
        toast.success(result.Message || 'LINK成功');
        onClose();

        // 圣殿变化更新相关数据
        onTemplesChange(
          characterDrawer.characterId,
          userAssets.name,
          setCharacterDrawerData
        );
      } else {
        toast.warning(result.Message || 'LINK失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'LINK失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedTemple) {
    return (
      <div className="w-full h-fit flex flex-col">
        <div className="*:not-first:mt-2">
          <div className="relative">
            <Input
              className="ps-9 pe-9 text-base"
              placeholder="搜索圣殿"
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
          <p className="text-xs opacity-60 py-2">请选择你想要LINK的圣殿</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
            {loading
              ? Array(6)
                  .fill(null)
                  .map((_, index) => (
                    <Skeleton key={index} className="aspect-[3/4] w-full" />
                  ))
              : userTemplePageValue?.Items.map((temple) => {
                  return (
                    <div
                      key={temple.CharacterId}
                      className={cn(
                        'aspect-[3/4] bg-cover bg-top bg-no-repeat',
                        'relative border-2 rounded-md',
                        'overflow-hidden cursor-pointer',
                        {
                          'border-gray-400': temple.Level === 0,
                          'border-green-500': temple.Level === 1,
                          'border-purple-500': temple.Level === 2,
                          'border-amber-500': temple.Level === 3,
                        }
                      )}
                      style={{
                        backgroundImage: `url(${getAvatarUrl(
                          temple.Cover,
                          'medium'
                        )})`,
                      }}
                      onClick={() => {
                        if (
                          temple.CharacterId ===
                          characterDetailData?.CharacterId
                        ) {
                          toast.warning('不能LINK自己');
                          return;
                        }
                        if (temple.Level === 0) {
                          toast.warning('圣殿等级不足');
                          return;
                        }
                        setSelectedTemple(temple);
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white">
                        <div className="absolute bottom-0 w-full px-2 pt-4 pb-1.5">
                          <div className="text-xs truncate">
                            {decodeHTMLEntities(temple.Name || '')}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn('absolute top-0 -right-1 scale-75', {
                          hidden: temple.Link,
                        })}
                      >
                        NO LINK
                      </Badge>
                    </div>
                  );
                })}
          </div>
          <PaginationWrapper
            currentPage={currentPage}
            totalPages={userTemplePageValue?.TotalPages || 0}
            onPageChange={setCurrentPage}
            size="sm"
            className="h-6.5 mt-2"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit flex flex-col gap-y-4 items-center">
      {userTempleData && (
        <>
          <Link
            link1={{
              ...userTempleData,
              CharacterName: characterDetailData?.Name || '',
              CharacterId: characterDetailData?.CharacterId || 0,
            }}
            link2={{
              ...selectedTemple,
              CharacterName: selectedTemple?.Name || '',
            }}
          />
          <div className="flex-1 flex flex-row w-full gap-x-2">
            <Button
              className="flex-1 h-8 rounded-full"
              disabled={loading}
              onClick={handleLink}
            >
              <LoaderCircleIcon
                className={cn('-ms-1 animate-spin', { hidden: !loading })}
                size={16}
                aria-hidden="true"
              />
              LINK
            </Button>
            <Button
              className="flex-1 h-8 rounded-full"
              variant="secondary"
              disabled={loading}
              onClick={() => {
                setSelectedTemple(undefined);
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
        </>
      )}
    </div>
  );
}
