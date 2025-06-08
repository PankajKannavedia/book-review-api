export interface User {
  _id?: string;
  user_name: string;
  email: string;
  password: string;
  full_name?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
