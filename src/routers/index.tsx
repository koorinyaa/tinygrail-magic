import Layout from '@/layouts';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';

// 创建路由配置
const newRoutes: RouteObject[] = [
  {
    path: '*',
    element: <Navigate to="/topWeek" />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/topWeek',
        element: <div className="h-1000">每周萌王页面</div>,
      },
      {
        path: '/starTower',
        element: <div>通天塔页面</div>,
      },
      {
        path: '/character',
        element: <div>角色页面</div>,
      },
      {
        path: '/ico',
        element: <div>ICO页面</div>,
      },
      {
        path: '/ranking',
        element: <div>排行榜页面</div>,
      },
      {
        path: '/lastTemple',
        element: <div>最新圣殿页面</div>,
      },
      {
        path: '/myTinygrail',
        element: <div>我的小圣杯页面</div>,
      },
    ],
  },
];

function Router() {
  const routes = useRoutes(newRoutes);
  return routes;
}

export default Router;
