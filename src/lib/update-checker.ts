import { APP_VERSION, UPDATE_CHECK_URL } from '@/config';

/**
 * 从元数据文件中提取版本号
 * @param metaContent 元数据文件内容
 * @returns 版本号
 */
function extractVersionFromMeta(metaContent: string): string | null {
  const versionMatch = metaContent.match(/\/\/ @version\s+([0-9.]+)/);
  return versionMatch ? versionMatch[1] : null;
}

/**
 * 比较版本号
 * @param currentVersion 当前版本
 * @param latestVersion 最新版本
 * @returns 如果有更新返回 true，否则返回 false
 */
function hasNewerVersion(currentVersion: string, latestVersion: string): boolean {
  const current = currentVersion.split('.').map(Number);
  const latest = latestVersion.split('.').map(Number);
  
  for (let i = 0; i < Math.max(current.length, latest.length); i++) {
    const a = current[i] || 0;
    const b = latest[i] || 0;
    
    if (a < b) return true;
    if (a > b) return false;
  }
  
  return false;
}

/**
 * 检查更新
 * @returns 更新信息对象
 */
export async function checkForUpdates(): Promise<{
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string | null;
  error?: string;
}> {
  try {
    // 获取最新的元数据文件
    const response = await fetch(UPDATE_CHECK_URL, {
      cache: 'no-cache', // 避免缓存
      headers: {
        'Content-Type': 'application/javascript'
      }
    });
    
    if (!response.ok) {
      throw new Error(`获取更新信息失败: ${response.status} ${response.statusText}`);
    }
    
    const metaContent = await response.text();
    const latestVersion = extractVersionFromMeta(metaContent);
    
    if (!latestVersion) {
      throw new Error('无法从元数据文件中提取版本号');
    }
    
    const hasUpdate = hasNewerVersion(APP_VERSION, latestVersion);
    
    return {
      hasUpdate,
      currentVersion: APP_VERSION,
      latestVersion
    };
  } catch (error) {
    console.error('检查更新失败:', error);
    return {
      hasUpdate: false,
      currentVersion: APP_VERSION,
      latestVersion: null,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}