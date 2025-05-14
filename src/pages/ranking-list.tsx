import { RefineRank } from '@/components/refine-rank';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

/**
 * 排行榜
 */
export function RankIngList() {
  const [selectedCategory, setSelectedCategory] = useState('asset'); // 选中的分类

  // 分类选项数据
  const categories = [
    { value: 'asset', label: '番市首富' },
    { value: 'refine', label: '精炼排行' },
  ];

  const renderContent = () => {
    switch (selectedCategory) {
      case 'asset':
        return <></>;
      case 'refine':
        return <RefineRank />;
    }
  };
  return (
    <div className="flex flex-col w-full max-w-screen-xl m-auto">
      <div className="flex flex-col xl:gap-x-6 xl:flex-row w-full">
        <div className="w-full">
          <div className="mb-6 flex flex-wrap flex-row items-center justify-between">
            <h2 className="text-xl font-bold flex-1 w-22">排行榜</h2>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.value}
                      value={category.value}
                      className="hover:bg-accent cursor-pointer"
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
