import nodemailer from "nodemailer";
import { EMAIL, PASS } from "@config";
import { isEmpty } from "@/utils/util";
import { HttpException } from "@/exceptions/HttpException";
import { User } from "@/interfaces/users.interface";
import userModel from "@models/users.model";

class SmtpService {
  public otpCode = "";
  public transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });
  constructor() {}

  public async sendOtp(email: string) {
    if (isEmpty(email)) throw new HttpException(400, "userData is empty");
    const isEmailExist: User = await userModel.findOne({ email: email });
    if (!isEmailExist) return "no-email";

    this.otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    let mailDetails = {
      from: EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${this.otpCode}`,
    };

    const otpsent = await this.transporter.sendMail(
      mailDetails,
      (err, info) => {
        if (info) return "otp sent";
        else if (err) return "error";
      }
    );
    if (otpsent) return "otp sent";
  }
}

export default SmtpService;
