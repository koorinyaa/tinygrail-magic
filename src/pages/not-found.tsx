import { useState, useEffect } from 'react';
import { SparklesText } from "@/components/sparkles-text";

export default function NotFound() {
  const [screenWidth, setScreenWidth] = useState(document.documentElement.clientWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(document.documentElement.clientWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <SparklesText text="404 Not Found" />
      <span className="text-sm text-muted-foreground">当前屏幕宽度：{screenWidth}px</span>
    </div>
  );
}
