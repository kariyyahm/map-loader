import { IRouterConfig } from 'ice';
import BasicLayout from '../src/layouts/BasicLayout';
import Dashboard from '../src/pages/Dashboard';

const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/',
        exact: true,
        component: Dashboard,
      },
    ],
  },
];
export default routerConfig;
