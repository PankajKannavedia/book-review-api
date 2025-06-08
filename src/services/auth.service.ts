import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, TokenData } from "@interfaces/auth.interface";
import { User } from "@interfaces/users.interface";
import userModel from "@models/users.model";
import { isEmpty } from "@utils/util";

class AuthService {
  public async signup(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await userModel.findOne({
      user_name: userData.user_name,
      email: userData.email,
    });
    if (findUser)
      throw new HttpException(
        409,
        `This user_name ${userData.user_name} or email ${userData.email} already exists`
      );

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: any = await userModel.create({
      ...userData,
      password: hashedPassword,
    });

    return createUserData;
  }

  public async login(
    userData: User
  ): Promise<{ cookie: string; findUser: User; token: string }> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User | null = await userModel.findOne({
      $or: [{ email: userData.user_name }, { user_name: userData.user_name }],
    });

    if (!findUser)
      throw new HttpException(
        409,
        `This user ${userData.user_name} was not found`
      );

    const isPasswordMatching: boolean = await compare(
      userData.password,
      findUser.password
    );
    if (!isPasswordMatching)
      throw new HttpException(409, "Password is not matching");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser, token: tokenData.token };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await userModel.findOne({
      user_name: userData.user_name,
    });
    if (!findUser)
      throw new HttpException(
        409,
        `This user_name ${userData.user_name} was not found`
      );

    return findUser;
  }

  public async forgetPass(userData: User): Promise<any> {
    if (isEmpty(userData)) throw new HttpException(400, "password is empty");

    const findUser: User = await userModel.findOne({ email: userData.email });
    if (!findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} was not found`
      );

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: any = await userModel.updateOne({
      password: hashedPassword,
    });

    return { findUser, createUserData };
  }

  public createToken(user: any): TokenData {
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
      user_name: user.user_name,
      role: user.role,
    };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 3600 * 1000 * 24 * 365;

    return {
      expiresIn,
      token: sign(dataStoredInToken, secretKey, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};SameSite=Lax`;
  }
}

export default AuthService;
