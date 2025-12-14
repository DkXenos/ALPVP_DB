import { BountyResponse, AssignedBountyResponse } from "../models/bounty-model";
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

  static async claimBounty(userId: number, bountyId: string): Promise<void> {
    // Check if bounty exists
    const bounty = await prismaClient.bounty.findUnique({
      where: { id: bountyId },
    });

    if (!bounty) {
      throw new ResponseError(404, "Bounty not found");
    }

    // Check if already claimed
    const existing = await prismaClient.bountyAssignment.findUnique({
      where: {
        user_id_bounty_id: {
          user_id: userId,
          bounty_id: bountyId,
        },
      },
    });

    if (existing) {
      throw new ResponseError(400, "You have already claimed this bounty");
    }

    // Create assignment
    await prismaClient.bountyAssignment.create({
      data: {
        user_id: userId,
        bounty_id: bountyId,
      },
    });
  }

  static async unclaimBounty(userId: number, bountyId: string): Promise<void> {
    // Check if assignment exists
    const assignment = await prismaClient.bountyAssignment.findUnique({
      where: {
        user_id_bounty_id: {
          user_id: userId,
          bounty_id: bountyId,
        },
      },
    });

    if (!assignment) {
      throw new ResponseError(404, "Bounty assignment not found");
    }

    // Delete assignment (bounty itself is not deleted)
    await prismaClient.bountyAssignment.delete({
      where: {
        user_id_bounty_id: {
          user_id: userId,
          bounty_id: bountyId,
        },
      },
    });
  }

  static async getMyBounties(userId: number): Promise<AssignedBountyResponse[]> {
    const assignments = await prismaClient.bountyAssignment.findMany({
      where: { user_id: userId },
      include: {
        bounty: true,
      },
      orderBy: {
        assigned_at: "desc",
      },
    });

    return assignments.map((assignment) => ({
      id: assignment.bounty.id,
      title: assignment.bounty.title,
      company: assignment.bounty.company,
      deadline: assignment.bounty.deadline.toISOString(),
      rewardXp: assignment.bounty.rewardXp,
      rewardMoney: assignment.bounty.rewardMoney,
      status: assignment.bounty.status,
      assignedAt: assignment.assigned_at.toISOString(),
      isCompleted: assignment.is_completed,
      completedAt: assignment.completed_at ? assignment.completed_at.toISOString() : null,
    }));
  }
}
