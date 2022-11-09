export interface CreateProfileReq {
  avatar?: string;
  author?: string;
  slogan?: string;
  github?: string;
  email?: string;
  wechat?: string;
  site?: string;
}

export type UpdateProfileReq = CreateProfileReq;

export interface Profile {
  id: string;
  avatar?: string;
  author?: string;
  slogan?: string;
  github?: string;
  email?: string;
  wechat?: string;
  site?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
