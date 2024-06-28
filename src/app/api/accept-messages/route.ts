import { getServerSession } from "next-auth"; // this method gives the session from the backend from which we can extract the varus information that is stored inside it
import { authOptions } from "../auth/[...nextauth]/options"; // get server session will require the credential provider that we have created therefor this is also imported
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; // not the User that we have injected inside the next auth module
// the user above is imported so as to be used a type to be assigned to the user object that we extract from the session which we get from getServerSession

export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User; // this as User of mentioning of type is called assertion

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "User has not logged in",
        },
        { status: 401 }
      );
    }
    const userId = user._id;
    const { acceptMessages } = await request.json(); // a parameter that the user send through request so as to toggle the user to accept or reject the user's ability to accpet messages

    try {
      const updated_user = await UserModel.findByIdAndUpdate(
        userId,
        { isAceeptingMessage: acceptMessages },
        { new: true }
      ); // the new:true allows the function top send back the updated data into the new variable
      if (!updated_user) {
        return Response.json({
          success: false,
          message: "failed to get the updated_user from database",
        });
      }
      return Response.json(
        {
          success: true,
          message:
            "users accepting message capability has been toggled successfully",
          updated_user,
        },
        { status: 200 }
      );
    } catch (error) {
      console.log("failed to update user status to accept messages");
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        { status: 500 }
      );
    }
  } catch (error) {}
} /* summary of the entire function is written in the notes */
export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User; // this as User of mentioning of type is called assertion

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "User has not logged in",
        },
        { status: 401 }
      );
    }
    const userId = user._id;
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "failed to get the user from database",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAceeptingMessage,
        message: "found the user and sent its data",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Error in getting message accepting status",
      },
      { status: 500 }
    );
  }
}
