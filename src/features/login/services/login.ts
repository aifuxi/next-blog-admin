import { request } from 'ice';
import { IResponse } from '@/features/common/types/base';
import { LoginDto, LoginRes } from '../types';
import { v1 } from '@/constants/apiVersion';

export const LOGIN = `${v1}/auth/login`;

export function login(data: LoginDto): Promise<IResponse<LoginRes>> {
  return request.post(LOGIN, data);
}
