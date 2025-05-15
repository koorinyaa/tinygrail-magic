import { TempleItem } from '@/api/character';
import { getRecentTemples } from '@/api/temple';
import { decodeHTMLEntities, getCoverUrl, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
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
  const { openCharacterDrawer } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 圣殿数据
  const [templeItems, setTempleItems] = useState<TempleItem[]>([]);
  // 总页数
  const [totalPages, setTotalPages] = useState(1);
  const [images, setImages] = useState<TempleImage[]>([]);

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
        // 追加新数据而不是替换
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
      CharacterId: characterId,
      CharacterName: characterName,
      Nickname: nickname,
    } = (props as ThumbnailImageProps<ImageExtended<TempleImage>>).item.data;

    return (
      <PhotoView src={props.imageProps.src}>
        <div className="relative">
          <img
            {...{
              ...props.imageProps,
              title: props.imageProps.title || undefined,
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

  /**
   * 加载更多
   */
  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage(currentPage + 1);
    }
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
        {/* 加载状态提示 */}
        {loading && templeItems.length > 0 && (
          <div className="flex justify-center items-center py-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
            </div>
          </div>
        )}

        {/* 加载更多按钮 */}
        {!loading && currentPage < totalPages && (
          <div className="mt-4 flex justify-center">
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer"
              onClick={loadMore}
              disabled={loading}
            >
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
