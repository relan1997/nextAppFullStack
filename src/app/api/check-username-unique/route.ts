import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
//this route is to check the validity of the username when the user is typing the username that he wants
const UserNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = UserNameQuerySchema.safeParse(queryParam);
    console.log(result);
    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || []; // username errors is an array
      return Response.json({
        success: false,
        message:
          userNameErrors.length > 0
            ? userNameErrors.join(",")
            : "Invalid Query params ",
      },{status:400});
    }

    const {username} = result.data

    const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})

    if (existingVerifiedUser) {
        return Response.json({
            success: false,
            message: "username is already taken"
          },{status:400});
    }
    else{
        return Response.json({
            success: true,
            message:'username is available'
          },{status:200});
    }
  } catch (error) {
    console.error("Error checking username ", error);
    return Response.json(
      {
        success: false,
        message: "error checking username",
      },
      { status: 500 }
    );
  }
}
