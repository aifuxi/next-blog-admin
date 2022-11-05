import { IRouterConfig, lazy } from 'ice';
import Layout from '@/components/layouts/BasicLayout';
import { HOME_URL, LOGIN_URL, POST_CATEGORY_URL, POST_CREAT_URL, POST_TAG_URL } from '@/constants/path';

const Login = lazy(() => import('@/pages/Login'));
const Home = lazy(() => import('@/pages/Home'));
const PostCreate = lazy(() => import('@/pages/Post/PostCreate'));
const PostCategoryManagement = lazy(() => import('@/pages/PostCategories/PostCategoryManagement'));
const PostTagManagement = lazy(() => import('@/pages/PostTags/PostTagManagement'));
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
        path: HOME_URL,
        component: Home,
        exact: true,
      },
      {
        path: POST_CREAT_URL,
        component: PostCreate,
      },
      {
        path: POST_TAG_URL,
        component: PostTagManagement,
      },
      {
        path: POST_CATEGORY_URL,
        component: PostCategoryManagement,
      },
      {
        component: NotFound,
      },
    ],
  },
];

export default routerConfig;
