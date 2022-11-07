import { runApp, IAppConfig } from 'ice';
import { getToken, setToken } from '@/utils/token';
import { message } from 'antd';
import { HTTP_STATUS_CODE } from '@/constants/http';
import { LOGIN_URL } from '@/constants/path';
import { AxiosError } from 'axios';
import { IResponse } from '@/features/common/types/base';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
  router: {
    type: 'browser',
    basename: '/admin',
  },
  request: {
    // 拦截器
    interceptors: {
      request: {
        onConfig: (config) => {
          if (config.url !== LOGIN_URL) {
            // 添加Authorization请求头
            return { ...config, headers: { ...config.headers, Authorization: `Bearer ${getToken()}` } };
          }
          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        },
      },
      response: {
        onConfig: (response) => {
          return response;
        },
        onError: (error: AxiosError<IResponse<any>, any>) => {
          // 未登录，或登录过期
          if (error?.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
            message.destroy();
            message.loading('登录信息过期···', 1).then(() => {
              setToken('');
              window.localStorage.clear();
              window.location.href = LOGIN_URL;
            });
          } else if (error?.response?.status === HTTP_STATUS_CODE.BAD_REQUEST) {
            message.error(error?.response?.data.message || '请求参数错误');
          } else {
            message.error(error?.response?.data.message || '系统错误');
          }

          return Promise.reject(error);
        },
      },
    },
  },
};

runApp(appConfig);
