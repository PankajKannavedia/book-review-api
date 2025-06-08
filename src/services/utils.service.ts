import { SECRET_KEY } from '@/config';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import { verify } from 'jsonwebtoken';

export class Utils {
  static async getUserId(req: any) {
    const Authorization = req.cookies?.['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
    const verifiedResponse = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;

    return verifiedResponse._id;
  }
}
