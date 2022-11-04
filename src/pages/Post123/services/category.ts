import { request } from 'ice';
import { IResponse } from '@/types/base';
import { Category, CreateCategoryReq, QueryCategoryDto, UpdateCategoryReq } from '@/types/post';

export const CATEGORIES = '/categories';

export function getCategories(): Promise<IResponse<Category[]>> {
  return request(CATEGORIES);
}

export function createCategory(data: CreateCategoryReq): Promise<IResponse<Category>> {
  return request.post(CATEGORIES, data);
}

export function updateCategory(id: string, data: UpdateCategoryReq): Promise<IResponse<Category>> {
  return request.patch(`${CATEGORIES}/${id}`, data);
}

export function queryCategory(data: QueryCategoryDto): Promise<IResponse<Category[]>> {
  return request.post(`${CATEGORIES}/query`, data);
}
