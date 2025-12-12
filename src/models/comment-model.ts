import { VoteResponse } from "./vote-model";

export interface CommentResponse {
  id: number;
  post_id: number;
  content: string;
  created_at: Date;
  // raw votes attached to this comment; frontend can compute totals
  commentVotes?: VoteResponse[];
}

export interface CreateCommentRequest {
  post_id: number;
  content: string;
}

export interface UpdateCommentRequest {
  content?: string;
}
