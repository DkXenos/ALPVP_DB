import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { BountyController } from "../controllers/bounty-controller"
import { ProfileController } from "../controllers/profile-controller"

export const privateRouter = express.Router()

privateRouter.use(authMiddleware)

// Profile routes
privateRouter.get("/profile", ProfileController.getProfile)
privateRouter.get("/profile/stats", ProfileController.getProfileStats)
privateRouter.put("/profile", ProfileController.updateProfile)
privateRouter.get("/profile/posts", ProfileController.getUserPosts)
privateRouter.get("/profile/events", ProfileController.getUserEvents)

// Bounty routea
privateRouter.get("/bounties", BountyController.getAllBounties)
privateRouter.get("/bounties/:id", BountyController.getBountyById)
privateRouter.post("/bounties/:id/claim", BountyController.claimBounty)
privateRouter.delete("/bounties/:id/unclaim", BountyController.unclaimBounty)
<<<<<<< HEAD
privateRouter.get("/my-bounties", BountyController.getMyBounties)
=======
privateRouter.get("/my-bounties", BountyController.getMyBounties)
>>>>>>> main
