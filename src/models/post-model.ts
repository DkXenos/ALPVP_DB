import { CommentResponse } from "./comment-model";

export interface PostResponse {
  id: number;
  user_id: number;
  content: string;
  image?: string | null;
  created_at: Date;
  username?: string;
  comments?: CommentResponse[];
}

export interface CreatePostRequest {
  user_id: number;
  content: string;
  image?: string;
}

export interface UpdatePostRequest {
  content?: string;
  image?: string;
}
