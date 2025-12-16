// Event Request & Response Types
export interface CreateEventRequest {
  title: string;
  description: string;
  event_date: string; // ISO date string
  company_id: number;
  registered_quota: number;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  event_date?: string; // ISO date string
  registered_quota?: number;
}

export interface RegisterToEventRequest {
  user_id: number;
  event_id: number;
}

export interface EventResponse {
  id: number;
  title: string;
  description: string;
  event_date: Date;
  company_id: number;
  company_name: string;
  registered_quota: number;
  current_registrations: number;
  created_at: Date;
  registered_users?: {
    id: number;
    username: string;
    email: string;
  }[];
  isOwner?: boolean;
}

export interface EventRegistrant {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}
