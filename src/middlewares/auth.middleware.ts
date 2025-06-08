import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "@config";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, RequestWithUser } from "@interfaces/auth.interface";
import userModel from "@models/users.model";

/**
 * getAuthUser function look for Authorization token in request and
 * if token found verify it then search for the associated user
 * @param   { RequestWithUser } request - contains cookies & header value
 * @returns { user: User | null, status: number, message: string }
 */
export const getAuthUser = async (request: RequestWithUser) => {
  try {
    const { cookies, header } = request;
    const Authorization =
      cookies["Authorization"] ||
      (header("Authorization")
        ? header("Authorization").split("Bearer ")[1]
        : null);

    if (Authorization) {
      const secretKey = SECRET_KEY;
      const verificationResponse = (await verify(
        Authorization,
        secretKey
      )) as DataStoredInToken;
      const userId = verificationResponse._id;
      const user = await userModel.findById(userId);

      if (user) {
        return { user, status: 200, message: "Auth found" };
      } else
        return {
          user: null,
          status: 401,
          message: "Wrong authentication token",
        };
    }
  } catch {
    return { user: null, status: 404, message: "Authentication token missing" };
  }
};

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, status, message } = await getAuthUser(req);

    if (user) {
      req.user = user as any;
      next();
    } else {
      next(new HttpException(status, message));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }
};

export function permit(...permittedRoles) {
  // return a middleware
  return (request, response, next) => {
    const { user } = request;
    if (user && permittedRoles.includes(user.role)) {
      next(); // role is allowed, so continue on the next middleware
    } else {
      response.status(403).json({ message: "Forbidden" }); // user is forbidden
    }
  };
}

export default authMiddleware;
