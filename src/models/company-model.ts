// Company Request & Response Types
export interface CreateCompanyRequest {
  name: string;
  description?: string;
  email: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  description?: string;
  email?: string;
}

export interface CompanyResponse {
  id: number;
  name: string;
  description: string | null;
  email: string;
  created_at: Date;
}
