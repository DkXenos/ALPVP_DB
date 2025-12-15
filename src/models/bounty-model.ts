export interface BountyResponse {
  id: string;
  title: string;
  company: string;
  deadline: string; // ISO Date string
  rewardXp: number;
  rewardMoney: number;
  status: string;
}

export interface AssignedBountyResponse extends BountyResponse {
  assignedAt: string;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface ClaimBountyRequest {
  bountyId: string;
}

export interface UnclaimBountyRequest {
  bountyId: string;
}
