import { CommentResponse } from "./comment-model";
import { VoteResponse } from "./vote-model";

export interface PostResponse {
  id: number;
  user_id: number;
  content: string;
  image?: string | null;
  created_at: Date;
  username?: string;
  postVotes?: VoteResponse[];
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
