export type UUID = string;
export type TaskTypeEnum = "daily" | "weekly" | "zone";
export type RoleEnum = "owner" | "member";

export interface MetadataPagination {
  page: number;
  size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ErrorResponse{
  error_code:string;
  message:string;
  request_id:UUID;
  timestamp: string;
}