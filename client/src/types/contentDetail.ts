export interface ContentDetailResponseData {
  idx: number;
  fileIds: number[];
  title: string;
  tags: string[];
  location: string;
  description: string;
  createdAt: string;
  registeredUserId: string | null;
  registeredUsername: string | null;
  commentCount: number | null;
}

export interface ContentDetail {
  idx: number;
  imageUrl: string;
  title: string;
  tags: string[];
  location: string;
  description: string;
  createdAt: string;
  registeredUserId: string | null;
  registeredUsername: string | null;
}