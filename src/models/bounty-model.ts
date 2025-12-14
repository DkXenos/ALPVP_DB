export interface BountyResponse {
  id: string;
  title: string;
  company: string;
  deadline: string; // ISO Date string
  rewardXp: number;
  rewardMoney: number;
  status: string;
}
