import { IRouterConfig } from 'ice';
import Layout from '@/components/layouts/BasicLayout';
import {
  ABOUT_URL,
  HOME_URL,
  LOGIN_URL,
  POST_CATEGORY_URL,
  POST_CREAT_URL,
  POST_EDIT_URL,
  POST_MANAGE_URL,
  POST_TAG_URL,
} from '@/constants/path';
import Home from '@/pages/Home';
import { LoginPage } from '@/pages/Login';
import { PostCreate, PostManagement } from '@/pages/Post';
import { PostTagManagement } from '@/pages/PostTags';
import { PostCategoryManagement } from '@/pages/PostCategories';
import NotFound from '@/components/NotFound';
import { AboutPage } from '@/features/about';

const routerConfig: IRouterConfig[] = [
  {
    path: LOGIN_URL,
    component: LoginPage,
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
        path: POST_EDIT_URL,
        component: PostCreate,
      },
      {
        path: POST_MANAGE_URL,
        component: PostManagement,
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
        path: ABOUT_URL,
        component: AboutPage,
      },
      {
        component: NotFound,
      },
    ],
  },
];

export default routerConfig;
