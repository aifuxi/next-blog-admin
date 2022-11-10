import {
  HeartOutlined,
  HomeOutlined,
  FileMarkdownOutlined,
  SolutionOutlined,
  SettingOutlined,
  BoldOutlined,
} from '@ant-design/icons';
import {
  BLOG_ABOUT_URL,
  HOME_URL,
  POST_CATEGORY_URL,
  POST_CREAT_URL,
  POST_MANAGE_URL,
  POST_TAG_URL,
  POST_URL,
  BLOG_PROFILE_URL,
  BLOG_URL,
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
    name: '博客配置',
    path: BLOG_URL,
    icon: BoldOutlined,
    routes: [
      {
        name: '关于',
        path: BLOG_ABOUT_URL,
        icon: SolutionOutlined,
      },
      {
        name: '首页',
        path: BLOG_PROFILE_URL,
        icon: SettingOutlined,
      },
    ],
  },
];

export { asideMenuConfig };
