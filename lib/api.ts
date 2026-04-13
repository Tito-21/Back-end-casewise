import { ApiResponse, LoginRequest, LoginResponse, CaseRequest, CaseResponse } from './types';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('casewise_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('casewise_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('casewise_token');
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function validateToken(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_BASE}/auth/validate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data: ApiResponse<boolean> = await response.json();
    return data.success && data.data;
  } catch {
    return false;
  }
}

export async function getCases(): Promise<ApiResponse<CaseResponse[]>> {
  const response = await fetch(`${API_BASE}/cases`, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401 || response.status === 403) {
    removeAuthToken();
    throw new Error('Session expired');
  }
  
  return response.json();
}

export async function getCaseById(id: number): Promise<ApiResponse<CaseResponse>> {
  const response = await fetch(`${API_BASE}/cases/${id}/complete`, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401 || response.status === 403) {
    removeAuthToken();
    throw new Error('Session expired');
  }
  
  return response.json();
}

export async function searchCases(query: string): Promise<ApiResponse<CaseResponse[]>> {
  const response = await fetch(`${API_BASE}/cases/search?query=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function getCasesByStatus(status: string): Promise<ApiResponse<CaseResponse[]>> {
  const response = await fetch(`${API_BASE}/cases/status/${status}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function createCase(caseData: CaseRequest): Promise<ApiResponse<CaseResponse>> {
  const response = await fetch(`${API_BASE}/cases/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(caseData),
  });
  
  if (response.status === 401 || response.status === 403) {
    removeAuthToken();
    throw new Error('Session expired');
  }
  
  return response.json();
}

export async function deleteCase(id: number): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE}/cases/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
}
