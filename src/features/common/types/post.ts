import { PaginationReq } from './base';
import { PostCategory } from './postCategory';
import { PostTag } from './postTag';
import { POST_SORT_BY_ENUM, IS_DELETED_ENUM, IS_PUBLISHED_ENUM, POST_TYPE_ENUM } from './enum';
import { Prisma } from '@prisma/client';

export interface CreatePostReq {
  title: string;
  description?: string;
  content: string;
  categories?: string[];
  tags?: string[];
  type: POST_TYPE_ENUM;
}

export type UpdatePostReq = Partial<CreatePostReq & { isDeleted: IS_DELETED_ENUM; isPublished?: IS_PUBLISHED_ENUM }>;

export interface Post {
  id: string;
  title: string;
  description?: string;
  content: string;
  view: number;
  isDeleted: IS_DELETED_ENUM;
  isPublished: IS_PUBLISHED_ENUM;
  type: POST_TYPE_ENUM;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  categories?: PostTag[];
  tags?: PostCategory[];
}

export interface FindManyPostReq extends PaginationReq {
  id?: string;
  title?: string;
  type?: POST_TYPE_ENUM;
  isPublished?: boolean;
  isDeleted?: boolean;
  categories?: string[];
  tags?: string[];
  sortBy?: POST_SORT_BY_ENUM;
  order?: Prisma.SortOrder;
}
