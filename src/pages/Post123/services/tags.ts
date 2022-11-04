import { request } from 'ice';
import { IResponse } from '@/types/base';
import { CreateTagReq, QueryTagDto, Tag, UpdateTagReq } from '@/types/post';

export const TAGS = '/tags';

export function getTags(): Promise<IResponse<Tag[]>> {
  return request(TAGS);
}

export function createTag(data: CreateTagReq): Promise<IResponse<Tag>> {
  return request.post(TAGS, data);
}

export function updateTag(id: string, data: UpdateTagReq): Promise<IResponse<Tag>> {
  return request.patch(`${TAGS}/${id}`, data);
}

export function queryTag(data: QueryTagDto): Promise<IResponse<Tag[]>> {
  return request.post(`${TAGS}/query`, data);
}
