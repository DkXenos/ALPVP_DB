// Company Request & Response Types
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

// Company Auth Types
export interface RegisterCompanyRequest {
  name: string;
  email: string;
  password: string;
  description?: string;
}

export interface LoginCompanyRequest {
  email: string;
  password: string;
}

export interface CompanyAuthResponse {
  token: string;
  company: {
    id: number;
    name: string;
    email: string;
  };
}
