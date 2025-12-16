import {
  CreateEventRequest,
  EventResponse,
  UpdateEventRequest,
  RegisterToEventRequest,
} from "../models/event-model";
import { prismaClient } from "../utils/database-util";
import { EventValidation } from "../validations/event-validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../error/response-error";

export class EventService {
  static async createEvent(request: CreateEventRequest): Promise<EventResponse> {
    const createRequest = Validation.validate(EventValidation.CREATE_EVENT, request);

    // Check if company exists
    const company = await prismaClient.company.findUnique({
      where: { id: createRequest.company_id },
    });

    if (!company) {
      throw new ResponseError(404, "Company not found");
    }

    const event = await prismaClient.event.create({
      data: {
        title: createRequest.title,
        description: createRequest.description,
        event_date: new Date(createRequest.event_date),
        company_id: createRequest.company_id,
        registered_quota: createRequest.registered_quota,
        // image removed: events no longer accept images
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
        eventRegistrations: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      company_id: event.company_id,
      company_name: event.company.name,
      registered_quota: event.registered_quota,
      current_registrations: event.eventRegistrations.length,
      created_at: event.created_at,
      registered_users: event.eventRegistrations.map((reg) => reg.user),
    };
  }

  static async getAllEvents(): Promise<EventResponse[]> {
    const events = await prismaClient.event.findMany({
      include: {
        company: {
          select: {
            name: true,
          },
        },
        eventRegistrations: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        event_date: "asc",
      },
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      company_id: event.company_id,
      company_name: event.company.name,
      registered_quota: event.registered_quota,
      current_registrations: event.eventRegistrations.length,
      // image removed: events no longer have images
      created_at: event.created_at,
      registered_users: event.eventRegistrations.map((reg) => reg.user),
    }));
  }

  static async getEventById(id: number): Promise<EventResponse> {
    const event = await prismaClient.event.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            name: true,
          },
        },
        eventRegistrations: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new ResponseError(404, "Event not found");
    }

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      company_id: event.company_id,
      company_name: event.company.name,
      registered_quota: event.registered_quota,
      current_registrations: event.eventRegistrations.length,
      created_at: event.created_at,
      registered_users: event.eventRegistrations.map((reg) => reg.user),
    };
  }

  static async updateEvent(id: number, request: UpdateEventRequest): Promise<EventResponse> {
    const updateRequest = Validation.validate(EventValidation.UPDATE_EVENT, request);

    // Check if event exists
    const existingEvent = await prismaClient.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      throw new ResponseError(404, "Event not found");
    }

    const event = await prismaClient.event.update({
      where: { id },
      data: {
        title: updateRequest.title,
        description: updateRequest.description,
        event_date: updateRequest.event_date ? new Date(updateRequest.event_date) : undefined,
        registered_quota: updateRequest.registered_quota,
        // image removed: events no longer have images
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
        eventRegistrations: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      company_id: event.company_id,
      company_name: event.company.name,
      registered_quota: event.registered_quota,
      current_registrations: event.eventRegistrations.length,
      // image removed: events no longer have images
      created_at: event.created_at,
      registered_users: event.eventRegistrations.map((reg) => reg.user),
    };
  }

  static async deleteEvent(id: number): Promise<void> {
    const event = await prismaClient.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new ResponseError(404, "Event not found");
    }

    await prismaClient.event.delete({
      where: { id },
    });
  }

  static async registerToEvent(request: RegisterToEventRequest): Promise<{ message: string }> {
    const registerRequest = Validation.validate(EventValidation.REGISTER_EVENT, request);

    // Check if user exists
    const user = await prismaClient.user.findUnique({
      where: { id: registerRequest.user_id },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    // Check if event exists
    const event = await prismaClient.event.findUnique({
      where: { id: registerRequest.event_id },
      include: {
        eventRegistrations: true,
      },
    });

    if (!event) {
      throw new ResponseError(404, "Event not found");
    }

    // Check if quota is full
    if (event.eventRegistrations.length >= event.registered_quota) {
      throw new ResponseError(400, "Event registration quota is full");
    }

    // Check if user already registered
    const existingRegistration = await prismaClient.eventRegistration.findUnique({
      where: {
        user_id_event_id: {
          user_id: registerRequest.user_id,
          event_id: registerRequest.event_id,
        },
      },
    });

    if (existingRegistration) {
      throw new ResponseError(400, "User already registered to this event");
    }

    await prismaClient.eventRegistration.create({
      data: {
        user_id: registerRequest.user_id,
        event_id: registerRequest.event_id,
      },
    });

    return { message: "Successfully registered to event" };
  }

  static async unregisterFromEvent(userId: number, eventId: number): Promise<{ message: string }> {
    // Check if registration exists
    const registration = await prismaClient.eventRegistration.findUnique({
      where: {
        user_id_event_id: {
          user_id: userId,
          event_id: eventId,
        },
      },
    });

    if (!registration) {
      throw new ResponseError(404, "Registration not found");
    }

    await prismaClient.eventRegistration.delete({
      where: {
        user_id_event_id: {
          user_id: userId,
          event_id: eventId,
        },
      },
    });

    return { message: "Successfully unregistered from event" };
  }

  static async getEventsByCompany(companyId: number): Promise<EventResponse[]> {
    const events = await prismaClient.event.findMany({
      where: { company_id: companyId },
      include: {
        company: {
          select: {
            name: true,
          },
        },
        eventRegistrations: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        event_date: "asc",
      },
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      company_id: event.company_id,
      company_name: event.company.name,
      registered_quota: event.registered_quota,
      current_registrations: event.eventRegistrations.length,
      // image removed: events no longer have images
      created_at: event.created_at,
      registered_users: event.eventRegistrations.map((reg) => reg.user),
    }));
  }

  // Get registrants for an event (company only)
  static async getEventRegistrants(eventId: number, companyId: number) {
    // Check if event exists and belongs to company
    const event = await prismaClient.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new ResponseError(404, "Event not found");
    }

    if (event.company_id !== companyId) {
      throw new ResponseError(403, "You don't have permission to view registrants for this event");
    }

    // Get all users registered for this event
    const registrations = await prismaClient.eventRegistration.findMany({
      where: { event_id: eventId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return registrations.map((registration) => ({
      user: {
        id: registration.user.id,
        username: registration.user.username,
        email: registration.user.email,
        role: registration.user.role,
      },
    }));
  }

  // Get company's events
  static async getCompanyEvents(companyId: number): Promise<EventResponse[]> {
    const events = await prismaClient.event.findMany({
      where: { company_id: companyId },
      include: {
        company: {
          select: {
            name: true,
          },
        },
        eventRegistrations: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      company_id: event.company_id,
      company_name: event.company.name,
      registered_quota: event.registered_quota,
      current_registrations: event.eventRegistrations.length,
      created_at: event.created_at,
      registered_users: event.eventRegistrations.map((reg) => reg.user),
      isOwner: true,
    }));
  }
}
