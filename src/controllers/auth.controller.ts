import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { getAuthUser } from '@/middlewares/auth.middleware';
import SmtpService from '@/services/smtp.service';

class AuthController {
  public authService = new AuthService();
  public smtpService = new SmtpService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { cookie, findUser, token } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.setHeader('Access-Control-Allow_Credentials', 'true');
      res.status(200).json({ data: findUser, token, message: 'login' });
    } catch (error) {
      next(error);
    }
  };
  
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { user } = await getAuthUser(req);
      
      if (user) {
        const userData = await this.authService.logout(user as any);
        res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
        res.status(200).json({ data: userData, message: 'logout' });
      } else {
        res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
        res.status(200).json({ message: 'logout' });
      }
    } catch {
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ message: 'logout' });
    }
  };
 
  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { findUser } = await this.authService.forgetPass(req.body);
      if(findUser) res.status(200).json({ message: 'password changed' });
      // else res.status(200).json({ message: 'password changed Successfully' });
    } catch (error) {
      next(error);
    }
  };
  
  // Route to send OTP
  public sendOtp = async (req: Request, res: Response) => {
    try {
      const result : string = await this.smtpService.sendOtp(req.body.email)
      if(result == "otp sent") res.status(200).json({ message: 'otp sent' });
      else if(result == "no-email") res.status(200).json({ message: "email doesn't exist" });
      else res.status(400).json({ message: 'error' });
    } catch (error) {
      res.status(400).json({ message: 'error' });
    }
  }

  // Route to verify OTP
  public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp } = req.body;
      if (otp === this.smtpService.otpCode) {
        res.status(200).json({ message: 'otp verified' });
      } else {
        res.status(200).json({ message: 'Invalid OTP' });
      }
    } catch {
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(400).json({ message: 'Invalid OTP' });
    }
  };


}

export default AuthController;
