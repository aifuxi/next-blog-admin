import { PostCategory as PrismaPostPostCategory, Prisma } from '@prisma/client';
import { PaginationReq } from '@/types/base';
import { SortByEnum } from './post';

export interface CreatePostCategoryReq {
  name: string;
  description?: string;
}

export type UpdatePostCategoryReq = Partial<CreatePostCategoryReq & { isDeleted?: boolean }>;

export type PostCategory = PrismaPostPostCategory;

export interface FindManyPostCategoryReq extends PaginationReq {
  id?: string;
  name?: string;
  isDeleted?: boolean;
  sortBy?: SortByEnum;
  order?: Prisma.SortOrder;
}
