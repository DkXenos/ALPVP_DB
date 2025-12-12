import express from 'express';
import { UserController } from '../controllers/user-controller';
import { PostController } from '../controllers/post-controller';
import { CommentController } from '../controllers/comment-controller';
import { VoteController } from '../controllers/vote-controller';
import { EventController } from '../controllers/event-controller';
import { CompanyController } from '../controllers/company-controller';

export const publicRouter = express.Router();

publicRouter.post("/register", UserController.register);
publicRouter.post("/login", UserController.login);

publicRouter.post("/posts", PostController.createPost);
publicRouter.get("/posts", PostController.getAllPosts);
publicRouter.get("/posts/:id", PostController.getPostById);
publicRouter.put("/posts/:id", PostController.updatePost);
publicRouter.delete("/posts/:id", PostController.deletePost);

publicRouter.post("/comments", CommentController.createComment);
publicRouter.get("/comments/:id", CommentController.getCommentById);
publicRouter.put("/comments/:id", CommentController.updateComment);
publicRouter.delete("/comments/:id", CommentController.deleteComment);
publicRouter.get("/posts/:postId/comments", CommentController.getCommentsByPostId);

publicRouter.post("/votes", VoteController.addVote);
publicRouter.delete("/votes/:voteId", VoteController.removeVote);
// Note: vote stats removed from backend; frontend should compute totals from returned vote lists

// Company routes
publicRouter.post("/companies", CompanyController.createCompany);
publicRouter.get("/companies", CompanyController.getAllCompanies);
publicRouter.get("/companies/:id", CompanyController.getCompanyById);
publicRouter.put("/companies/:id", CompanyController.updateCompany);
publicRouter.delete("/companies/:id", CompanyController.deleteCompany);

// Event routes
publicRouter.post("/events", EventController.createEvent);
publicRouter.get("/events", EventController.getAllEvents);
publicRouter.get("/events/:id", EventController.getEventById);
publicRouter.put("/events/:id", EventController.updateEvent);
publicRouter.delete("/events/:id", EventController.deleteEvent);
publicRouter.get("/companies/:companyId/events", EventController.getEventsByCompany);

// Event registration routes
publicRouter.post("/events/register", EventController.registerToEvent);
publicRouter.delete("/events/:eventId/users/:userId", EventController.unregisterFromEvent);
