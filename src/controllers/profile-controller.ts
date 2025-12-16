import { Request, Response, NextFunction } from "express"
import { UserRequest } from "../models/user-request-model"
import { prismaClient } from "../utils/database-util"
import { ResponseError } from "../error/response-error"

export class ProfileController {
    // Get current user profile with all related data
    static async getProfile(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id

            if (!userId) {
                throw new ResponseError(401, "Unauthorized")
            }

            const user = await prismaClient.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    xp: true,
                    balance: true,
                    posts: {
                        select: {
                            id: true,
                            content: true,
                            image: true,
                            created_at: true,
                            comments: {
                                select: {
                                    id: true,
                                    content: true,
                                    created_at: true,
                                },
                            },
                        },
                        orderBy: {
                            created_at: "desc",
                        },
                    },
                    eventRegistrations: {
                        select: {
                            event: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    event_date: true,
                                    registered_quota: true,
                                    company: {
                                        select: {
                                            id: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    bountyAssignments: {
                        select: {
                            bounty: {
                                select: {
                                    id: true,
                                    title: true,
                                    company: true,
                                    deadline: true,
                                    rewardXp: true,
                                    rewardMoney: true,
                                    status: true,
                                },
                            },
                            assigned_at: true,
                            is_completed: true,
                            completed_at: true,
                        },
                    },
                },
            })

            if (!user) {
                throw new ResponseError(404, "User not found")
            }

            res.status(200).json({
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    xp: user.xp,
                    balance: user.balance,
                    posts: user.posts,
                    events: user.eventRegistrations.map((reg) => reg.event),
                    bounties: user.bountyAssignments.map((assignment) => ({
                        ...assignment.bounty,
                        assignedAt: assignment.assigned_at,
                        isCompleted: assignment.is_completed,
                        completedAt: assignment.completed_at,
                    })),
                },
            })
        } catch (error) {
            next(error)
        }
    }

    // Get user statistics
    static async getProfileStats(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id

            if (!userId) {
                throw new ResponseError(401, "Unauthorized")
            }

            const [
                totalPosts,
                totalEvents,
                totalBounties,
                completedBounties,
                user,
            ] = await Promise.all([
                prismaClient.post.count({
                    where: { user_id: userId },
                }),
                prismaClient.eventRegistration.count({
                    where: { user_id: userId },
                }),
                prismaClient.bountyAssignment.count({
                    where: { user_id: userId },
                }),
                prismaClient.bountyAssignment.count({
                    where: { user_id: userId, is_completed: true },
                }),
                prismaClient.user.findUnique({
                    where: { id: userId },
                    select: {
                        xp: true,
                        balance: true,
                    },
                }),
            ])

            if (!user) {
                throw new ResponseError(404, "User not found")
            }

            res.status(200).json({
                data: {
                    totalPosts,
                    totalEvents,
                    totalBounties,
                    completedBounties,
                    activeBounties: totalBounties - completedBounties,
                    totalXP: user.xp,
                    totalEarnings: user.balance,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    // Update user profile
    static async updateProfile(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id

            if (!userId) {
                throw new ResponseError(401, "Unauthorized")
            }

            const { username, email } = req.body

            // Check if email is already taken by another user
            if (email) {
                const existingUser = await prismaClient.user.findFirst({
                    where: {
                        email: email,
                        NOT: { id: userId },
                    },
                })

                if (existingUser) {
                    throw new ResponseError(400, "Email is already taken")
                }
            }

            const updatedUser = await prismaClient.user.update({
                where: { id: userId },
                data: {
                    ...(username && { username }),
                    ...(email && { email }),
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            })

            res.status(200).json({
                data: updatedUser,
            })
        } catch (error) {
            next(error)
        }
    }

    // Get user posts
    static async getUserPosts(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id

            if (!userId) {
                throw new ResponseError(401, "Unauthorized")
            }

            const posts = await prismaClient.post.findMany({
                where: { user_id: userId },
                select: {
                    id: true,
                    content: true,
                    image: true,
                    created_at: true,
                    comments: {
                        select: {
                            id: true,
                            content: true,
                            created_at: true,
                        },
                    },
                },
                orderBy: {
                    created_at: "desc",
                },
            })

            res.status(200).json({
                data: posts,
            })
        } catch (error) {
            next(error)
        }
    }

    // Get user events
    static async getUserEvents(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id

            if (!userId) {
                throw new ResponseError(401, "Unauthorized")
            }

            const eventRegistrations = await prismaClient.eventRegistration.findMany({
                where: { user_id: userId },
                select: {
                    event: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            event_date: true,
                            registered_quota: true,
                            created_at: true,
                            company: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            })

            const events = eventRegistrations.map((reg) => reg.event)

            res.status(200).json({
                data: events,
            })
        } catch (error) {
            next(error)
        }
    }
}
