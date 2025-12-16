export interface BountyResponse {
  id: string;
  title: string;
  company: string;
  companyId: number;
  description?: string;
  deadline: string; // ISO Date string
  rewardXp: number;
  rewardMoney: number;
  status: string;
  isOwner?: boolean;
  applicantsCount?: number;
}

export interface AssignedBountyResponse extends BountyResponse {
  assignedAt: string;
  isCompleted: boolean;
  completedAt: string | null;
  submissionUrl: string | null;
  submissionNotes: string | null;
  isWinner: boolean;
}

export interface ClaimBountyRequest {
  bountyId: string;
}

export interface UnclaimBountyRequest {
  bountyId: string;
}

export interface CreateBountyRequest {
  title: string;
  description?: string;
  deadline: string; // ISO date string
  rewardXp: number;
  rewardMoney: number;
}

export interface BountyApplicant {
  user: {
    id: number;
    username: string;
    email: string;
  };
  assignedAt: string;
  isCompleted: boolean;
  completedAt: string | null;
  submissionUrl: string | null;
  submissionNotes: string | null;
  isWinner: boolean;
}

export interface SubmitBountyRequest {
  submissionUrl: string;
  submissionNotes?: string;
}

export interface SelectWinnerRequest {
  userId: number;
}
