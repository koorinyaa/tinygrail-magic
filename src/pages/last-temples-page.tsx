import { LastLinks } from '@/components/last-links';
import { LastTemples } from '@/components/last-temples';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export function LastTemplesPage() {
  const [selectedCategory, setSelectedCategory] = useState('temple'); // 选中的分类

  // 分类选项数据
  const categories = [
    { value: 'temple', label: '最新圣殿' },
    { value: 'link', label: '最新连接' },
  ];

  const renderContent = () => {
    switch (selectedCategory) {
      case 'temple':
        return <LastTemples />;
      case 'link':
        return <LastLinks />;
    }
  };
  return (
    <div className="flex-1 flex flex-col gap-y-2 w-full max-w-screen-xl m-auto">
      <div className="w-full flex flex-col">
        <div className="mb-6 flex flex-wrap flex-row items-center justify-between">
          <h2 className="text-xl font-bold flex-1 w-22">
            {selectedCategory === 'temple' ? '最新圣殿' : '最新连接'}
          </h2>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
        {renderContent()}
      </div>
    </div>
  );
}
