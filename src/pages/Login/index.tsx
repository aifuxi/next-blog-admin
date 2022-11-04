import React from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { LockOutlined, SmileTwoTone, UserOutlined } from '@ant-design/icons';
import { login } from '@/pages/Login/services/login';
import { setToken } from '@/utils/token';
import { useHistory } from 'ice';
import { notification } from 'antd';
import { HOME_URL } from '@/constants/path';
import { LoginDto } from '@/pages/Login/types/login';

const Login: React.FC = () => {
  const history = useHistory();
  return (
    <LoginForm
      title="F西的博客后台"
      subTitle="欢迎~欢迎~热烈欢迎~"
      initialValues={{ email: '123@qq.com', password: '123456' }}
      onFinish={async (value: LoginDto) => {
        const { data } = await login(value);
        setToken(data.token);
        notification.success({
          description: '欢迎回来，即使再忙，也要写博客哟(＾Ｕ＾)ノ~ＹＯ',
          message: '登录成功',
          icon: <SmileTwoTone />,
          duration: 3,
          top: 56,
        });
        history.push(HOME_URL);
      }}
    >
      <ProFormText
        name="email"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={'prefixIcon'} />,
        }}
        placeholder={'用户邮箱: xxx@xxx.com'}
        rules={[
          {
            required: true,
            message: '请输入用户邮箱!',
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        placeholder={'用户密码: xxxxxx'}
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      />
    </LoginForm>
  );
};

export default Login;
