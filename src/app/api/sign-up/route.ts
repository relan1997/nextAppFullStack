import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerifcationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const exisitingUserVerifiedByUsername = await UserModel.findOne({
      username: username,
      isVerified: true,
    }); // according to the algo, we first check if the verified user exists in the db or not
    if (exisitingUserVerifiedByUsername) {
      return Response.json(
        {
          success: true,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    const exisitingUserVerifiedByEmail = await UserModel.findOne({
      email: email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (exisitingUserVerifiedByEmail) {
      if (exisitingUserVerifiedByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        exisitingUserVerifiedByEmail.password = hashedPassword;
        exisitingUserVerifiedByEmail.verifyCode = verifyCode;
        exisitingUserVerifiedByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        ); // adding an hour to the current time
        await exisitingUserVerifiedByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAceeptingMessage: true,
        isVerified: false,
        messages: [],
      });
      await user.save(); // ab jab user ban gya hai toh usko ek email bhej dete haina with the otp and the username
      const sendEmail = await sendVerificationEmail(
        email,
        username,
        verifyCode
      ); // returns an api response jisme woh pura aprResponse ka format bhi rehta hai
      if (!sendEmail.success) {
        return Response.json(
          {
            success: false,
            message: sendEmail.message,
          },
          { status: 500 }
        );
      }
      return Response.json(
        {
          success: true,
          message: "user registered successfully. Please verify your email",
        },
        { status: 200 }
      );
    }

    //send verification email
  } catch (error) {
    console.error("error in resgistering user ", error);
    return Response.json(
      {
        success: false,
        message: "Error in registering user",
      },
      {
        status: 500,
      }
    );
  }
}
