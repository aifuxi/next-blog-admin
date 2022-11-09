import { request } from 'ice';
import { v1 } from '@/constants/apiVersion';
import { IResponse } from '../types';

export function uploadFile(file: File, filedName = 'file'): Promise<IResponse<{ url: string }>> {
  const formData = new FormData();
  formData.set(filedName, file);
  return request.post(`${v1}/file/upload`, formData);
}
