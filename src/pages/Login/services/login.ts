import { request } from 'ice';
import { IResponse } from '@/types/base';
import { LoginDto, LoginRes } from '@/pages/Login/types/login';
import { v1 } from '@/constants/apiVersion';

export const LOGIN = `${v1}/auth/login`;

export function login(data: LoginDto): Promise<IResponse<LoginRes>> {
  return request.post(LOGIN, data);
}
