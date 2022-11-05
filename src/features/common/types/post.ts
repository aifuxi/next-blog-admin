import { Post as PrismaPost, PostTag, PostCategory, Prisma } from '@prisma/client';
import { PaginationReq } from './base';
import { PostSortByEnum } from './sort-enum';

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

export interface FindManyPostReq extends PaginationReq {
  id?: string;
  title?: string;
  isPublished?: boolean;
  sortBy?: PostSortByEnum;
  order?: Prisma.SortOrder;
}
