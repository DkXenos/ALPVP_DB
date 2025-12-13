// Bounty Request & Response Types
export interface CreateBountyRequest {
  title: string;
  company: string;
  deadline: string;
  rewardXp: number;
  rewardMoney: number;
  description?: string;
  requirements: string[];
}

export interface UpdateBountyRequest {
  title?: string;
  company?: string;
  deadline?: string;
  rewardXp?: number;
  rewardMoney?: number;
  status?: string;
  description?: string;
  requirements?: string[];
}

export interface BountyResponse {
  id: string;
  title: string;
  company: string;
  deadline: string;
  rewardXp: number;
  rewardMoney: number;
  status: string;
  description: string | null;
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
  applicationCount?: number;
}

// Application Request & Response Types
export interface CreateApplicationRequest {
  bountyId: string;
  portfolioLinks: string[];
  cvImageUrl: string;
  whyHireYou: string;
}

export interface UpdateApplicationRequest {
  portfolioLinks?: string[];
  cvImageUrl?: string;
  whyHireYou?: string;
  status?: string;
}

export interface ApplicationResponse {
  id: string;
  bountyId: string;
  portfolioLinks: string[];
  cvImageUrl: string;
  whyHireYou: string;
  status: string;
  submittedAt: Date;
  bounty?: {
    id: string;
    title: string;
    company: string;
    deadline: string;
    rewardXp: number;
    rewardMoney: number;
  };
}
