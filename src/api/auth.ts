import api from './axios';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth';

export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post('/auth/register', data),
};
