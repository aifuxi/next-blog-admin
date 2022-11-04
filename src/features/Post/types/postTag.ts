import { PostTag as PrismaPostPostTag, Prisma } from '@prisma/client';
import { PaginationReq } from '@/types/base';
import { SortByEnum } from './post';

export interface CreatePostTagReq {
  name: string;
  description?: string;
}

export type UpdatePostTagReq = Partial<CreatePostTagReq & { isDeleted?: boolean }>;

export type PostTag = PrismaPostPostTag;

export interface FindManyPostTagReq extends PaginationReq {
  id?: string;
  name?: string;
  isDeleted?: boolean;
  sortBy?: SortByEnum;
  order?: Prisma.SortOrder;
}
