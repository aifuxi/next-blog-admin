import { request } from 'ice';
import { CreatePostReq, Post, QueryPostDto, UpdatePostReq } from '@/types/post';
import { IResponse } from '@/types/base';

export const POSTS = '/posts';

export function createPost(data: CreatePostReq): Promise<IResponse<Post>> {
  return request.post(POSTS, data);
}

export function getPost(id: string): Promise<IResponse<Post>> {
  return request(`${POSTS}/${id}`);
}

export function getPostList(): Promise<IResponse<Post[]>> {
  return request(POSTS);
}

export function updatePost(id: string, data: UpdatePostReq): Promise<IResponse<Post>> {
  return request.patch(`${POSTS}/${id}`, data);
}

export function queryPost(data: QueryPostDto): Promise<IResponse<Post[]>> {
  return request.post(`${POSTS}/query`, data);
}
