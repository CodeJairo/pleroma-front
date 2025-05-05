export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  isValidated: boolean;
  isAdmin: boolean;
}
