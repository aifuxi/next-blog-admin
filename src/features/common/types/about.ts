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
