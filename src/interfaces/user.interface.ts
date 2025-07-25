export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  createdAt: Date;
  role: 'user' | 'admin';
}
