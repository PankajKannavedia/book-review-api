import { hash } from "bcrypt";
import { HttpException } from "@exceptions/HttpException";
import { User } from "@interfaces/users.interface";
import userModel from "@models/users.model";
import { isEmpty } from "@utils/util";

class UserService {
  // public users = userModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await userModel.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "UserId is empty");

    const findUser: User = await userModel.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await userModel.findOne({
      user_name: userData.user_name,
    });
    if (findUser)
      throw new HttpException(
        409,
        `This user_name ${userData.user_name} already exists`
      );

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await userModel.create({
      ...userData,
      password: hashedPassword,
    });

    return createUserData;
  }

  public async updateUser(userId: string, userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    if (userData.user_name) {
      const findUser: User = await userModel.findOne({
        user_name: userData.user_name,
      });
      if (findUser && findUser._id != userId)
        throw new HttpException(
          409,
          `This user_name ${userData.user_name} already exists`
        );
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await userModel.findByIdAndUpdate(userId, {
      userData,
    });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await userModel.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }
}

export default UserService;
