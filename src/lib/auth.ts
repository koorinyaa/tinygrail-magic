import { getUserAssets } from '@/api/user';
import { decodeHTMLEntities } from './utils';

/**
 * 登录验证并获取用户资产数据
 * @param setUserAssets - 设置用户资产的回调函数
 */
export function verifyAuth(setUserAssets: (assets: any) => void) {
  getUserAssets()
    .then((response) => {
      if (response.State === 0 && response.Value) {
        const {
          Id: id,
          Name: name,
          Avatar: avatar,
          Nickname: nickname,
          Balance: balance,
          Assets: assets,
          Type: type,
          State: state,
          LastIndex: lastIndex,
          ShowWeekly: showWeekly,
          ShowDaily: showDaily,
        } = response.Value;

        setUserAssets({
          id,
          name,
          avatar,
          nickname: decodeHTMLEntities(nickname),
          balance,
          assets,
          type,
          state,
          lastIndex,
          showWeekly,
          showDaily,
        });
      } else {
        setUserAssets(null);
        throw new Error(response.Message || '登录已过期');
      }
    })
    .catch((err) => {
      const errMsg =
        err instanceof Error ? err.message : '获取用户资产数据失败';
      console.error(errMsg);
    });
}
