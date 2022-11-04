import { IRouterConfig, lazy } from 'ice';
import Layout from '@/components/layouts/BasicLayout';
import Login from '@/pages/Login';
import {
  HOME_URL,
  LOGIN_URL,
  POST_CREAT_URL,
  /*  POST_CATEGORY_URL,
  POST_CREAT_URL,
  POST_EDIT_URL,
  POST_MANAGE_URL,
  POST_TAG_URL,
  USER_PROFILE_URL, */
} from '@/constants/path';

// const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Home = lazy(() => import('@/pages/Home'));
const PostCreate = lazy(() => import('@/pages/Post/PostCreate'));
const NotFound = lazy(() => import('@/components/NotFound'));

const routerConfig: IRouterConfig[] = [
  {
    path: LOGIN_URL,
    component: Login,
  },
  {
    path: HOME_URL,
    component: Layout,
    children: [
      {
        path: POST_CREAT_URL,
        component: PostCreate,
      },
      /*      {
        path: USER_PROFILE_URL,
        component: UserProfile,
      },
      {
        path: POST_CATEGORY_URL,
        component: PostCategory,
      },
      {
        path: POST_TAG_URL,
        component: PostTag,
      },
      {
        path: POST_CREAT_URL,
        component: PostCreate,
      },
      {
        path: POST_EDIT_URL,
        component: PostCreate,
      },
      {
        path: POST_MANAGE_URL,
        component: PostManage,
      }, */
      {
        path: HOME_URL,
        component: Home,
      },
      {
        component: NotFound,
      },
    ],
  },
];

export default routerConfig;
