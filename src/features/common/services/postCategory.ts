import { request } from 'ice';
import { v1 } from '@/constants/apiVersion';
import {
  PostCategory,
  CreatePostCategoryReq,
  UpdatePostCategoryReq,
  FindManyPostCategoryReq,
  IListResponse,
  IResponse,
} from '../types';
import qs from 'qs';

export const POST_CATEGORIES = `${v1}/post_categories`;

export function createPostCategory(data: CreatePostCategoryReq): Promise<IResponse<PostCategory>> {
  return request.post(POST_CATEGORIES, data);
}

export function updatePostCategory(id: string, data: UpdatePostCategoryReq): Promise<IResponse<PostCategory>> {
  return request.patch(`${POST_CATEGORIES}/${id}`, data);
}

export function findManyPostCategory(data: FindManyPostCategoryReq): Promise<IListResponse<PostCategory[]>> {
  const query = qs.stringify(data);
  return request.get(`${POST_CATEGORIES}?${query}`);
}

export function deletePostCategory(id: string): Promise<IResponse<PostCategory>> {
  return request.delete(`${POST_CATEGORIES}/${id}`);
}
