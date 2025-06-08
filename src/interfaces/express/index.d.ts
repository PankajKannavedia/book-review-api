import { User } from '../users.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
