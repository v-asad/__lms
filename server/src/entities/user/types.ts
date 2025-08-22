export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // we will never return this in queries
}

export interface AuthPayload {
  token: string;
  user: User;
}
