import { Prisma } from '@prisma/client';
import { PaginationReq } from '@/features/common/types/base';
import { IS_DELETED_ENUM, SORT_BY_ENUM } from './enum';

export interface CreatePostTagReq {
  name: string;
  description?: string;
}

export type UpdatePostTagReq = Partial<CreatePostTagReq & { isDeleted?: IS_DELETED_ENUM }>;

export interface PostTag {
  id: string;
  name: string;
  description?: string;
  isDeleted: IS_DELETED_ENUM;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FindManyPostTagReq extends PaginationReq {
  id?: string;
  name?: string;
  isDeleted?: IS_DELETED_ENUM;
  sortBy?: SORT_BY_ENUM;
  order?: Prisma.SortOrder;
}
