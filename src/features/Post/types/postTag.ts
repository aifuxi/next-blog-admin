import { Prisma } from '@prisma/client';
import { PaginationReq } from '@/types/base';
import { SortByEnum } from './post';

export interface CreatePostTagReq {
  name: string;
  description?: string;
}

export type UpdatePostTagReq = Partial<CreatePostTagReq & { isDeleted?: boolean }>;

export interface PostTag {
  id: string;
  name: string;
  description?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FindManyPostTagReq extends PaginationReq {
  id?: string;
  name?: string;
  isDeleted?: boolean;
  sortBy?: SortByEnum;
  order?: Prisma.SortOrder;
}
