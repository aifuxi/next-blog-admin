import { Post as PrismaPost, PostTag, PostCategory, Prisma } from '@prisma/client';
import { PaginationReq } from '@/types/base';

export interface CreatePostReq {
  title: string;
  description?: string;
  content: string;
  categories?: string[];
  tags?: string[];
}

export type UpdatePostReq = Partial<CreatePostReq>;

export interface Post extends PrismaPost {
  categories?: PostTag[];
  tags?: PostCategory[];
}

export enum SortByEnum {
  createdTime = 'createdTime',
  updatedTime = 'updatedTime',
}

export enum PostSortByEnum {
  createdTime = 'createdTime',
  updatedTime = 'updatedTime',
  publishedTime = 'publishedTime',
}

export interface FindManyPostReq extends PaginationReq {
  id?: string;
  title?: string;
  isPublished?: boolean;
  sortBy?: PostSortByEnum;
  order?: Prisma.SortOrder;
}
