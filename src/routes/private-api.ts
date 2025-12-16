import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { BountyController } from "../controllers/bounty-controller"
import { ProfileController } from "../controllers/profile-controller"
import { EventController } from "../controllers/event-controller"

export const privateRouter = express.Router()

privateRouter.use(authMiddleware)

// Profile routes
privateRouter.get("/profile", ProfileController.getProfile)
privateRouter.get("/profile/stats", ProfileController.getProfileStats)
privateRouter.put("/profile", ProfileController.updateProfile)
privateRouter.get("/profile/posts", ProfileController.getUserPosts)
privateRouter.get("/profile/events", ProfileController.getUserEvents)

// Bounty routes (users)
privateRouter.get("/bounties", BountyController.getAllBounties)
privateRouter.get("/bounties/:id", BountyController.getBountyById)
privateRouter.post("/bounties/:id/claim", BountyController.claimBounty)
privateRouter.delete("/bounties/:id/unclaim", BountyController.unclaimBounty)
privateRouter.get("/my-bounties", BountyController.getMyBounties)

// Bounty routes (companies only)
privateRouter.get("/bounties/:id/applicants", BountyController.getBountyApplicants)
privateRouter.post("/bounties", BountyController.createBounty)

// Event routes (companies only)
privateRouter.get("/events/:id/registrants", EventController.getEventRegistrants)

// Company routes
privateRouter.get("/company/my-bounties", BountyController.getCompanyBounties)
privateRouter.get("/company/my-events", EventController.getCompanyEvents)