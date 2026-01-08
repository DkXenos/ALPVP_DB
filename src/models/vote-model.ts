export interface VoteResponse {
  id: number;
  vote_type: "upvote" | "downvote";
  comment_id?: number;
  post_id?: number;
}

export interface CreateVoteRequest {
  comment_id: number;
  vote_type: "upvote" | "downvote";
}

export interface CreatePostVoteRequest {
  post_id: number;
  vote_type: "upvote" | "downvote";
}

