import { request } from 'ice';
import { v1 } from '@/constants/apiVersion';
import { IListResponse, IResponse, About, CreateAboutReq, FindManyAboutReq, UpdateAboutReq } from '../types';
import qs from 'qs';

export const ABOUT = `${v1}/about`;

export function createAbout(data: CreateAboutReq): Promise<IResponse<About>> {
  return request.post(ABOUT, data);
}

export function getAbout(): Promise<IResponse<About>> {
  return request.get(ABOUT);
}

export function updateAbout(id: string, data: UpdateAboutReq): Promise<IResponse<About>> {
  return request.patch(`${ABOUT}/${id}`, data);
}

export function findManyAbout(data: FindManyAboutReq): Promise<IListResponse<About[]>> {
  const query = qs.stringify(data);
  return request.get(`${ABOUT}?${query}`);
}

export function deleteAbout(id: string): Promise<IResponse<About>> {
  return request.delete(`${ABOUT}/${id}`);
}
