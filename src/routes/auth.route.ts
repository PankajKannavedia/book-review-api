import { Router } from "express";
import AuthController from "@controllers/auth.controller";
import { Routes } from "@interfaces/routes.interface";

class AuthRoute implements Routes {
  public path = "/";
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, this.authController.signUp);
    this.router.post(`${this.path}login`, this.authController.logIn);
    this.router.post(`${this.path}logout`, this.authController.logOut);
    this.router.post(
      `${this.path}forgotpassword`,
      this.authController.forgotPassword
    );
    this.router.post(`${this.path}sendotp`, this.authController.sendOtp);
    this.router.post(`${this.path}verifyotp`, this.authController.verifyOtp);
  }
}

export default AuthRoute;
