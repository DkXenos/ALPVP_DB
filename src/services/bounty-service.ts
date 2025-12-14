import { BountyResponse } from "../models/bounty-model";
import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../error/response-error";

export class BountyService {
  static async getAllBounties(): Promise<BountyResponse[]> {
    const bounties = await prismaClient.bounty.findMany({
      orderBy: {
        deadline: "asc",
      },
    });

    return bounties.map((bounty) => ({
      id: bounty.id,
      title: bounty.title,
      company: bounty.company,
      deadline: bounty.deadline.toISOString(),
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
    }));
  }

  static async getBountyById(id: string): Promise<BountyResponse> {
    const bounty = await prismaClient.bounty.findUnique({
      where: { id },
    });

    if (!bounty) {
      throw new ResponseError(404, "Bounty not found");
    }

    return {
      id: bounty.id,
      title: bounty.title,
      company: bounty.company,
      deadline: bounty.deadline.toISOString(),
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
    };
  }
}
