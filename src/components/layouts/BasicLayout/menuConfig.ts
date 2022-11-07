import { HeartOutlined, HomeOutlined, FileMarkdownOutlined, UserOutlined } from '@ant-design/icons';
import {
  ABOUT_URL,
  HOME_URL,
  POST_CATEGORY_URL,
  POST_CREAT_URL,
  POST_MANAGE_URL,
  POST_TAG_URL,
  POST_URL,
  USER_PROFILE_URL,
} from '@/constants/path';

const asideMenuConfig = [
  {
    name: '首页',
    path: HOME_URL,
    icon: HomeOutlined,
  },
  {
    name: '文章管理',
    path: POST_URL,
    icon: FileMarkdownOutlined,
    routes: [
      {
        name: '创建文章',
        path: POST_CREAT_URL,
        icon: HeartOutlined,
      },
      {
        name: '文章列表',
        path: POST_MANAGE_URL,
        icon: HeartOutlined,
      },
      {
        name: '文章分类',
        path: POST_CATEGORY_URL,
        icon: HeartOutlined,
      },
      {
        name: '文章标签',
        path: POST_TAG_URL,
        icon: HeartOutlined,
      },
    ],
  },
  {
    name: '个人信息',
    path: USER_PROFILE_URL,
    icon: UserOutlined,
  },
  {
    name: '关于',
    path: ABOUT_URL,
    icon: UserOutlined,
  },
];

export { asideMenuConfig };
