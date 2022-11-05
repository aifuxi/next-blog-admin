import { request } from 'ice';
import { PostTag, CreatePostTagReq, UpdatePostTagReq, FindManyPostTagReq, IListResponse, IResponse } from '../types';
import qs from 'qs';
import { v1 } from '@/constants/apiVersion';

export const POST_TAGS = `${v1}/post_tags`;

export function createPostTag(data: CreatePostTagReq): Promise<IResponse<PostTag>> {
  return request.post(POST_TAGS, data);
}

export function updatePostTag(id: string, data: UpdatePostTagReq): Promise<IResponse<PostTag>> {
  return request.patch(`${POST_TAGS}/${id}`, data);
}

export function findManyPostTag(data: FindManyPostTagReq): Promise<IListResponse<PostTag[]>> {
  const query = qs.stringify(data);
  return request.get(`${POST_TAGS}?${query}`);
}

export function deletePostTag(id: string): Promise<IResponse<PostTag>> {
  return request.delete(`${POST_TAGS}/${id}`);
}
