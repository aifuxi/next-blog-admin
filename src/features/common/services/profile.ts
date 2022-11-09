import { request } from 'ice';
import { v1 } from '@/constants/apiVersion';
import { IResponse, UpdateProfileReq, CreateProfileReq, Profile } from '../types';

export const PROFILE = `${v1}/profile`;

export function createProfile(data: CreateProfileReq): Promise<IResponse<Profile>> {
  return request.post(PROFILE, data);
}

export function getProfile(): Promise<IResponse<Profile>> {
  return request.get(PROFILE);
}

export function updateProfile(id: string, data: UpdateProfileReq): Promise<IResponse<Profile>> {
  return request.patch(`${PROFILE}/${id}`, data);
}

export function deleteProfile(id: string): Promise<IResponse<Profile>> {
  return request.delete(`${PROFILE}/${id}`);
}
