import { NextFunction, Request, Response } from "express";
import { EventService } from "../services/event-service";
import {
  CreateEventRequest,
  UpdateEventRequest,
  RegisterToEventRequest,
} from "../models/event-model";
import { UserRequest } from "../models/user-request-model";
import { CompanyRequest } from "../models/company-request-model";

export class EventController {
  static async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateEventRequest = {
        ...req.body,
        company_id: parseInt(req.body.company_id),
        registered_quota: parseInt(req.body.registered_quota),
      };
      const response = await EventService.createEvent(request);
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await EventService.getAllEvents();
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const response = await EventService.getEventById(id);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const request: UpdateEventRequest = {
        ...req.body,
        registered_quota: req.body.registered_quota
          ? parseInt(req.body.registered_quota)
          : undefined,
      };
      const response = await EventService.updateEvent(id, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await EventService.deleteEvent(id);
      res.status(200).json({
        message: "Event deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async registerToEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const request: RegisterToEventRequest = {
        user_id: parseInt(req.body.user_id),
        event_id: parseInt(req.body.event_id),
      };
      const response = await EventService.registerToEvent(request);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async unregisterFromEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId);
      const eventId = parseInt(req.params.eventId);
      const response = await EventService.unregisterFromEvent(userId, eventId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getEventsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = parseInt(req.params.companyId);
      const response = await EventService.getEventsByCompany(companyId);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get registrants for an event (company only)
  static async getEventRegistrants(req: CompanyRequest, res: Response, next: NextFunction) {
    try {
      if (!req.company) {
        return res.status(403).json({
          errors: "Only companies can view registrants",
        });
      }

      const eventId = parseInt(req.params.id);
      const companyId = req.company.id;
      const response = await EventService.getEventRegistrants(eventId, companyId);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get company's events
  static async getCompanyEvents(req: CompanyRequest, res: Response, next: NextFunction) {
    try {
      if (!req.company) {
        return res.status(403).json({
          errors: "Only companies can access this endpoint",
        });
      }

      const companyId = req.company.id;
      const response = await EventService.getCompanyEvents(companyId);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
