export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  message: string;
}

export interface CaseParty {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  role: string;
  partyName?: string;
  partyType?: string;
  address?: string;
}

export interface CaseRequest {
  firstName: string;
  lastName: string;
  caseNumber?: string;
  caseTitle: string;
  courtName?: string;
  caseSummary?: string;
  crimeCategory?: string;
  crimeType?: string;
  crimeDescription?: string;
  crimeCommittedDate?: string;
  crimeCommittedTime?: string;
  caseParties?: CaseParty[];
}

export interface CaseResponse {
  id: number;
  firstName: string;
  lastName: string;
  caseNumber: string;
  status: string;
  description: string;
  createdBy?: string;
  courtName?: string;
  caseParties?: CaseParty[];
  crimes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type TabType = 'registration' | 'my-cases' | 'laws';
export type StatusFilter = 'all' | 'Open' | 'Pending' | 'Closed';
