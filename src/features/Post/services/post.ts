import { request } from 'ice';
import { IListResponse, IResponse } from '@/types/base';
import { v1 } from '@/constants/apiVersion';
import { CreatePostReq, UpdatePostReq, Post } from '../types';
import { FindManyPostReq } from '@/features/Post/types';
import qs from 'qs';

export const POSTS = `${v1}/posts`;

export function createPost(data: CreatePostReq): Promise<IResponse<Post>> {
  return request.post(POSTS, data);
}

export function getPost(id: string): Promise<IResponse<Post>> {
  return request(`${POSTS}/${id}`);
}

export function updatePost(id: string, data: UpdatePostReq): Promise<IResponse<Post>> {
  return request.patch(`${POSTS}/${id}`, data);
}

export function findManyPosts(data: FindManyPostReq): Promise<IListResponse<Post[]>> {
  const query = qs.stringify(data);
  return request.get(`${POSTS}?${query}`);
}
