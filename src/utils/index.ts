import { setToken } from '@/utils/token';
import { message } from 'antd';
import { history } from 'ice';
import { LOGIN_URL } from '@/constants/path';

export const handleLogout = () => {
  setToken('');
  window.localStorage.clear();
  message.loading('即将跳转到登录页面...', 2.5).then(() => {
    message.success('退出登录成功', 2.5);
    history?.replace(LOGIN_URL);
  });
};

export const isEmail = (value: string): boolean => {
  const reg = new RegExp(/^\\s*\\w+(?:\\.{0,1}[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$/gi);
  return reg.test(value);
};
