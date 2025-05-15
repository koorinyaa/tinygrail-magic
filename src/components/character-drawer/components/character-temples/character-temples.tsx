import { Link } from '@/components/link';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Switch } from '@/components/ui/switch';
import { TempleCard } from '@/components/ui/temple-card';
import {
  cn,
  decodeHTMLEntities,
  formatInteger,
  getCoverUrl,
  isEmpty,
} from '@/lib/utils';
import { useStore } from '@/store';
import { Grid2x2, Image, ImageOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';

export function CharacterTemples() {
  const { characterDrawerData } = useStore();
  const {
    characterDetailData,
    characterLinkItems = [],
    characterTempleItems = [],
  } = characterDrawerData;
  const [templeCurrentPage, setTempleCurrentPage] = useState(1);
  const [linkCurrentPage, setLinkCurrentPage] = useState(1);
  // 圣殿显示模式
  const [templeShowMode, setTempleShowMode] = useState<'temple' | 'image'>(
    'temple'
  );
  // 存储图片高度信息
  const [imageHeights, setImageHeights] = useState<{ [key: string]: number }>(
    {}
  );
  // 添加状态跟踪图片加载情况
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {}
  );

  // 合并圣殿和链接数据
  const allTempleItems = useMemo(() => {
    return [...characterTempleItems, ...characterLinkItems].sort(
      (a, b) => b.Sacrifices - a.Sacrifices
    );
  }, [characterTempleItems, characterLinkItems]);

  // 计算圣殿总页数
  const templeTotalPages = useMemo(() => {
    const itemsPerPage = 12;
    return Math.max(1, Math.ceil(allTempleItems.length / itemsPerPage));
  }, [allTempleItems]);

  // 获取圣殿当前页的数据
  const currentTemplePageItems = useMemo(() => {
    const itemsPerPage = 12;
    const startIndex = (templeCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allTempleItems.slice(startIndex, endIndex);
  }, [allTempleItems, templeCurrentPage]);

  // 计算LINK总页数
  const linkTotalPages = useMemo(() => {
    const itemsPerPage = 3;
    return Math.max(1, Math.ceil(characterLinkItems.length / itemsPerPage));
  }, [characterLinkItems]);

  // 获取LINK当前页的数据
  const currentLinkPageItems = useMemo(() => {
    const itemsPerPage = 3;
    const startIndex = (linkCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return characterLinkItems.slice(startIndex, endIndex);
  }, [characterLinkItems, linkCurrentPage]);

  // 当数据变化时重置页码
  useEffect(() => {
    setTempleCurrentPage(1);
    setLinkCurrentPage(1);
  }, [characterTempleItems, characterLinkItems]);

  // 获取所有不重复的Cover图片
  const uniqueCovers = useMemo(() => {
    const covers = allTempleItems
      .filter((item) => item.Cover) // 过滤掉没有Cover的项
      .map((item) => item.Cover);
    return [...new Set(covers)]; // 使用Set去重
  }, [allTempleItems]);

  // 处理图片加载完成事件
  const handleImageLoad = (
    cover: string,
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const img = event.currentTarget;

    // 获取图片原始宽高
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // 根据宽高比计算高度
    const calculatedHeight = (100 / naturalWidth) * naturalHeight;

    // 更新高度信息
    setImageHeights((prev) => ({
      ...prev,
      [cover]: calculatedHeight,
    }));

    // 标记该图片已加载
    setLoadedImages((prev) => ({
      ...prev,
      [cover]: true,
    }));
  };

  // 当数据变化重置图片加载状态
  useEffect(() => {
    if (templeShowMode === 'image') {
      setImageHeights({});
      setLoadedImages({});
    }
  }, [uniqueCovers]);

  // 圣殿页面切换处理函数
  const handleTemplePageChange = (page: number) => {
    setTempleCurrentPage(page);
  };

  // LINK页面切换处理函数
  const handleLinkPageChange = (page: number) => {
    setLinkCurrentPage(page);
  };

  // 渲染圣殿图片瀑布
  const renderImageColumns = () => {
    // 平衡两列高度
    const leftColumn: React.ReactNode[] = [];
    const rightColumn: React.ReactNode[] = [];
    let leftHeight = 0;
    let rightHeight = 0;

    uniqueCovers.forEach((cover, index) => {
      const isLoaded = loadedImages[cover];

      const imageElement = (
        <div
          key={`cover-${index}`}
          className={`w-full overflow-hidden rounded-sm ${
            !isLoaded ? 'absolute opacity-0 pointer-events-none' : ''
          }`}
        >
          <PhotoView key={index} src={getCoverUrl(cover, 'large')}>
            <img
              src={getCoverUrl(cover, 'large')}
              alt="圣殿图片"
              className="w-full h-auto object-cover"
              onLoad={(e) => handleImageLoad(cover, e)}
              style={{ display: isLoaded ? 'block' : 'none' }}
            />
          </PhotoView>
        </div>
      );

      // 已加载的图片
      if (isLoaded) {
        const height = imageHeights[cover] || 300;

        // 将图片添加到高度较小的列
        if (leftHeight <= rightHeight) {
          leftColumn.push(imageElement);
          leftHeight += height;
        } else {
          rightColumn.push(imageElement);
          rightHeight += height;
        }
      } else {
        // 未加载的图片
        if (index % 2 === 0) {
          leftColumn.push(imageElement);
        } else {
          rightColumn.push(imageElement);
        }
      }
    });

    return (
      <PhotoProvider
        bannerVisible={false}
        maskOpacity={0.4}
        className="pointer-events-auto backdrop-blur-xs"
      >
        <div className="flex flex-col gap-2">{leftColumn}</div>
        <div className="flex flex-col gap-2">{rightColumn}</div>
      </PhotoProvider>
    );
  };

  return (
    <div className="flex flex-col gap-y-2 px-2 bg-card">
      <div className="w-full bg-slate-200/50 dark:bg-slate-800/60 rounded-sm p-2">
        <div className="text-xs mb-1.5 opacity-70">LINK</div>
        <div
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-y-1 py-8 opacity-60',
            {
              hidden: !isEmpty(currentLinkPageItems),
            }
          )}
        >
          <ImageOff className="size-12" />
          <span className="text-sm">暂无LINK</span>
        </div>
        <div
          className={cn(
            'grid grid-cols-[repeat(auto-fill,minmax(214px,1fr))] gap-2 w-full',
            {
              hidden: isEmpty(currentLinkPageItems),
            }
          )}
        >
          {currentLinkPageItems.map((item) => {
            if (!item || !item.Link) return null;
            return (
              <div
                key={item.UserId}
                className="flex items-center justify-center w-full"
              >
                <div className="flex flex-col gap-y-1 w-[214px]">
                  <Link
                    link1={{
                      ...item,
                      CharacterName: characterDetailData?.Name || '',
                      CharacterId: characterDetailData?.CharacterId || 0,
                    }}
                    link2={{
                      ...item.Link,
                      CharacterName: item.Link.Name || '',
                    }}
                    jumpable
                  />
                  <div className="text-xs opacity-60 hover:opacity-80 w-full truncate cursor-pointer">
                    @{decodeHTMLEntities(item.Nickname || '')} +
                    {formatInteger(
                      item.Assets < item.Link.Assets
                        ? item.Assets
                        : item.Link.Assets
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {characterLinkItems.length > 3 && (
          <PaginationWrapper
            currentPage={linkCurrentPage}
            totalPages={linkTotalPages}
            onPageChange={handleLinkPageChange}
            size="sm"
            className={cn('h-6.5 mt-2', {
              hidden: linkTotalPages <= 1 || isEmpty(currentLinkPageItems),
            })}
          />
        )}
      </div>
      <div className="w-full bg-slate-200/50 dark:bg-slate-800/60 rounded-sm p-2">
        <div className="flex flex-row items-center mb-1.5">
          <div className="flex-1 text-xs opacity-70">圣殿</div>
          <div className="relative inline-grid h-4 grid-cols-[1fr_1fr] items-center text-sm font-medium">
            <Switch
              checked={templeShowMode === 'image'}
              onCheckedChange={(checked) => {
                setTempleShowMode(checked ? 'image' : 'temple');
              }}
              className={cn(
                'peer absolute inset-0 h-[inherit] w-auto rounded-[3px] cursor-pointer',
                'data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50',
                '[&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-[3px] [&_span]:transition-transform [&_span]:duration-300',
                '[&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full',
                '[&_[data-slot=switch-thumb]]:h-full [&_[data-slot=switch-thumb]]:w-1/2 [&_[data-slot=switch-thumb]]:data-[state=unchecked]:bg-primary-foreground'
              )}
            />
            <span className="peer-data-[state=checked]:text-muted-foreground/70 pointer-events-none relative ms-px flex min-w-5 items-center justify-center text-center">
              <Grid2x2 aria-hidden="true" className="size-3" />
            </span>
            <span className="peer-data-[state=unchecked]:text-muted-foreground/70 pointer-events-none relative me-px flex min-w-5 items-center justify-center text-center">
              <Image aria-hidden="true" className="size-3" />
            </span>
          </div>
        </div>
        <div
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-y-1 py-8 opacity-60',
            {
              hidden:
                !isEmpty(currentTemplePageItems) || templeShowMode !== 'temple',
            }
          )}
        >
          <ImageOff className="size-12" />
          <span className="text-sm">暂无圣殿</span>
        </div>
        <div
          className={cn({
            hidden: templeShowMode === 'image',
          })}
        >
          <div
            className={cn(
              'grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 w-full',
              {
                hidden: isEmpty(currentTemplePageItems),
              }
            )}
          >
            {currentTemplePageItems.map((item) => {
              return (
                <div className="flex flex-col gap-y-1">
                  <TempleCard
                    key={item.UserId}
                    data={item}
                    className="w-full"
                  />
                  <div className="text-xs opacity-60 hover:opacity-80 w-full truncate	cursor-pointer">
                    @{decodeHTMLEntities(item.Nickname || '')}
                  </div>
                </div>
              );
            })}
          </div>
          <PaginationWrapper
            currentPage={templeCurrentPage}
            totalPages={templeTotalPages}
            onPageChange={handleTemplePageChange}
            size="sm"
            className={cn('h-6.5 mt-2', {
              hidden: templeTotalPages <= 1 || isEmpty(currentTemplePageItems),
            })}
          />
        </div>
        <div
          className={cn({
            hidden: templeShowMode === 'temple',
          })}
        >
          <div
            className={cn('grid grid-cols-2 gap-2 w-full', {
              hidden: isEmpty(uniqueCovers),
            })}
          >
            {uniqueCovers.length > 0 && renderImageColumns()}
          </div>

          {/* 加载中提示 */}
          {uniqueCovers.length > 0 &&
            Object.keys(loadedImages).length < uniqueCovers.length && (
              <div className="flex justify-center items-center py-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                </div>
              </div>
            )}

          <div
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-y-1 py-8 opacity-60',
              {
                hidden: !isEmpty(uniqueCovers),
              }
            )}
          >
            <ImageOff className="size-12" />
            <span className="text-sm">暂无图片</span>
          </div>
        </div>
      </div>
    </div>
  );
}
