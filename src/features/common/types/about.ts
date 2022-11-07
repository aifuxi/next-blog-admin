import { Prisma } from '@prisma/client';
import { PaginationReq } from './base';
import { SortByEnum } from './sort-enum';

export interface CreateAboutReq {
  content: string;
}

export type UpdateAboutReq = CreateAboutReq;

export interface About {
  id: string;
  content: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FindManyAboutReq extends PaginationReq {
  id?: string;
  name?: string;
  isDeleted?: boolean;
  sortBy?: SortByEnum;
  order?: Prisma.SortOrder;
}
