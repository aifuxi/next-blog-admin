import { Prisma } from '@prisma/client';
import { PaginationReq } from '@/types/base';
import { SortByEnum } from './post';

export interface CreatePostCategoryReq {
  name: string;
  description?: string;
}

export type UpdatePostCategoryReq = Partial<CreatePostCategoryReq & { isDeleted?: boolean }>;

export interface PostCategory {
  id: string;
  name: string;
  description?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FindManyPostCategoryReq extends PaginationReq {
  id?: string;
  name?: string;
  isDeleted?: boolean;
  sortBy?: SortByEnum;
  order?: Prisma.SortOrder;
}
