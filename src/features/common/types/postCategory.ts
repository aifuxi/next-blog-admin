import { Prisma } from '@prisma/client';
import { PaginationReq } from './base';
import { IS_DELETED_ENUM, SORT_BY_ENUM } from './enum';

export interface CreatePostCategoryReq {
  name: string;
  description?: string;
}

export type UpdatePostCategoryReq = Partial<CreatePostCategoryReq & { isDeleted?: IS_DELETED_ENUM }>;

export interface PostCategory {
  id: string;
  name: string;
  description?: string;
  isDeleted: IS_DELETED_ENUM;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FindManyPostCategoryReq extends PaginationReq {
  id?: string;
  name?: string;
  isDeleted?: IS_DELETED_ENUM;
  sortBy?: SORT_BY_ENUM;
  order?: Prisma.SortOrder;
}
