import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { TodoController } from "../controllers/todo-controller"
import { BountyController } from "../controllers/bounty-controller"

export const privateRouter = express.Router()

privateRouter.use(authMiddleware)

privateRouter.get("/todo-list", TodoController.getAllTodos)
privateRouter.get("/todo-list/:todoListId", TodoController.getTodo)
privateRouter.post("/todo-list", TodoController.createTodo)
privateRouter.put("/todo-list/:todoListId", TodoController.updateTodo)
privateRouter.delete("/todo-list/:todoListId", TodoController.deleteTodo)

// Bounty routes
privateRouter.get("/bounties", BountyController.getAllBounties)
privateRouter.get("/bounties/:id", BountyController.getBountyById)
privateRouter.post("/bounties/:id/claim", BountyController.claimBounty)
privateRouter.delete("/bounties/:id/unclaim", BountyController.unclaimBounty)
privateRouter.get("/my-bounties", BountyController.getMyBounties)
