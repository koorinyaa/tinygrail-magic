import { TempleItem } from '@/api/character';
import { getRecentTemples } from '@/api/temple';
import { decodeHTMLEntities, getCoverUrl, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { ArrowUpToLine } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Gallery,
  Image as GalleryImage,
  ImageExtended,
  ThumbnailImageProps,
} from 'react-grid-gallery';
import { PhotoProvider, PhotoView } from 'react-photo-view';

// 圣殿图片属性
type TempleImage = GalleryImage & {
  data: TempleItem;
};

/**
 * 最新圣殿
 */
export function LastTemples() {
  const { toTop, pageContainerRef, openCharacterDrawer } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 圣殿数据
  const [templeItems, setTempleItems] = useState<TempleItem[]>([]);
  // 总页数
  const [totalPages, setTotalPages] = useState(1);
  // 图片数据
  const [images, setImages] = useState<TempleImage[]>([]);
  // 返回顶部按钮是否显示
  const [showToTop, setShowToTop] = useState(false);

  // 加载锁
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    const container = pageContainerRef?.current;
    if (!container) return;

    // 节流器
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      // 正在加载或已经到达最后一页
      if (loading || currentPage >= totalPages) return;

      // 节流中或者加载锁已锁定
      if (throttleTimer !== null || isLoadingMoreRef.current) return;

      const { scrollHeight, scrollTop, clientHeight } = container;

      // 控制返回顶部按钮的显示
      setShowToTop(scrollTop > 200);

      // 滚动到距离底部100px时加载更多
      if (scrollHeight - scrollTop - clientHeight < 100) {
        // 设置加载锁
        isLoadingMoreRef.current = true;

        // 设置节流定时器
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
          // 只有在未加载状态和未达到最大页数时才增加页码
          if (!loading && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
          }
          // 延迟释放加载锁，确保状态已更新
          setTimeout(() => {
            isLoadingMoreRef.current = false;
          }, 300);
        }, 500);
      }
    };

    // 检查内容高度是否小于视口高度，如果是则自动加载更多
    const checkContentHeight = () => {
      if (loading || currentPage >= totalPages) return;
      if (isLoadingMoreRef.current) return;

      const { scrollHeight, clientHeight } = container;
      // 如果内容高度小于或等于视口高度，且有更多页可加载，则自动加载下一页
      if (scrollHeight <= clientHeight && currentPage < totalPages) {
        isLoadingMoreRef.current = true;

        // 设置节流定时器
        if (throttleTimer === null) {
          throttleTimer = setTimeout(() => {
            throttleTimer = null;
            if (!loading && currentPage < totalPages) {
              setCurrentPage((prev) => prev + 1);
            }
            setTimeout(() => {
              isLoadingMoreRef.current = false;
            }, 300);
          }, 500);
        }
      }
    };

    container.addEventListener('scroll', handleScroll);

    // 在组件挂载和数据加载完成后检查内容高度
    checkContentHeight();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      // 清除可能存在的定时器
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [loading, currentPage, totalPages]);

  // 检查是否需要加载更多
  useEffect(() => {
    // 只有在加载完成且不是最后一页时才检查
    if (!loading && currentPage < totalPages) {
      const container = pageContainerRef?.current;
      if (!container) return;

      const { scrollHeight, clientHeight } = container;
      // 内容高度小于或等于视口高度，自动加载下一页
      if (scrollHeight <= clientHeight && !isLoadingMoreRef.current) {
        console.log(
          'Auto loadMore after loading - content smaller than viewport'
        );
        // 设置短暂延迟，确保DOM已更新
        setTimeout(() => {
          if (currentPage < totalPages && !isLoadingMoreRef.current) {
            isLoadingMoreRef.current = true;
            setCurrentPage((prev) => prev + 1);
            // 延迟释放加载锁
            setTimeout(() => {
              isLoadingMoreRef.current = false;
            }, 300);
          }
        }, 100);
      }
    }
  }, [loading, currentPage, totalPages]);

  // 当页面变化或加载完成时，重置加载锁
  useEffect(() => {
    isLoadingMoreRef.current = false;
  }, [currentPage, loading]);

  useEffect(() => {
    fetchRecentTemplesData();
  }, [currentPage]);

  /**
   * 获取图片尺寸
   * @param url 图片地址
   * @returns 图片尺寸
   */
  const getImageDimensions = (url: string) => {
    return new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = url;
    });
  };

  /**
   * 获取圣殿数据
   */
  const fetchRecentTemplesData = async () => {
    setLoading(true);

    try {
      const resp = await getRecentTemples(currentPage);
      if (resp.State === 0) {
        if (currentPage === 1) {
          setTempleItems(resp.Value.Items);
          setTotalPages(resp.Value.TotalPages);

          const imageItems = await Promise.all(
            resp.Value.Items.map(async (item) => {
              const { width, height } = await getImageDimensions(
                getCoverUrl(item.Cover, 'large')
              );
              return {
                src: getCoverUrl(item.Cover, 'large'),
                width,
                height,
                data: item,
              };
            })
          );
          setImages(imageItems);
        } else {
          setTempleItems((prevItems) => [...prevItems, ...resp.Value.Items]);
          setTotalPages(resp.Value.TotalPages);

          const imageItems = await Promise.all(
            resp.Value.Items.map(async (item) => {
              const { width, height } = await getImageDimensions(
                getCoverUrl(item.Cover, 'large')
              );
              return {
                src: getCoverUrl(item.Cover, 'large'),
                width,
                height,
                data: item,
              };
            })
          );
          setImages((prevItems) => [...prevItems, ...imageItems]);
        }
      } else {
        throw new Error(resp.Message || '获取圣殿数据失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取圣殿数据失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 图片组件
   */
  const ImageComponent = (props: ThumbnailImageProps) => {
    const {
      Id: id,
      CharacterId: characterId,
      CharacterName: characterName,
      Nickname: nickname,
    } = (props as ThumbnailImageProps<ImageExtended<TempleImage>>).item.data;

    return (
      <PhotoView key={id} src={props.imageProps.src}>
        <div className="relative">
          <img
            {...{
              ...props.imageProps,
              title: props.imageProps.title || undefined,
              loading: 'lazy',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white">
            <div className="absolute bottom-0 w-full px-1.5 pt-4 pb-1.5 pointer-events-auto">
              <div
                className="flex items-center text-xs font-semibold cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openCharacterDrawer(characterId);
                }}
              >
                <span className="truncate">
                  {decodeHTMLEntities(characterName)}
                </span>
              </div>
              <div className="flex items-center text-xs opacity-60 cursor-pointer">
                <span className="truncate">
                  @{decodeHTMLEntities(nickname || '')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PhotoView>
    );
  };

  return (
    <div className="flex flex-col w-full">
      {loading && templeItems.length === 0 ? (
        <div className="flex justify-center items-center py-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
          </div>
        </div>
      ) : (
        <PhotoProvider
          bannerVisible={false}
          maskOpacity={0.4}
          className="pointer-events-auto backdrop-blur-xs"
        >
          <Gallery
            images={images}
            rowHeight={240}
            enableImageSelection={false}
            thumbnailImageComponent={ImageComponent}
          />
        </PhotoProvider>
      )}
      <div className="p-4">
        {loading && templeItems.length > 0 && (
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
            </div>
          </div>
        )}
      </div>
      {showToTop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={toTop}
            className="fixed bottom-10 right-4 md:right-10 opacity-80 hover:opacity-100 bg-card text-foreground/80 p-2 rounded-full shadow-lg transition-colors cursor-pointer"
            title="返回顶部"
          >
            <ArrowUpToLine className="size-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
