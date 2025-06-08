import { Request } from 'express';
import { User } from '@interfaces/users.interface';
import { ObjectId } from 'mongoose';

export interface DataStoredInToken {
  _id: ObjectId;
  user_name: string;
  role: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
