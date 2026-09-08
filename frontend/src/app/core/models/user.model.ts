export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
