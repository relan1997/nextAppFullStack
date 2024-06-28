// now the messages of the user is an array of The document Message type which directly cant be used to get all the message , so we will use MongoDB's aggregation pipeline to solve this problem
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

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
  const userId = new mongoose.Types.ObjectId(user._id); //no using aggregation pipeline while the user object is in string will cause errors in it
  // now the user._id will be converted to the ObjectId type of mongoose which will therefore be unproblematic in the aggregation pipeline

  try {
    // start of aggregation pipeline part jo tujhe nahi samjha hai
    const user = await UserModel.aggregate([
      { $match: { id: userId } }, // matches ki kaunse user ki messages hummne chaiye
      { $unwind: "$messages" }, // iska basically matlab yeh hai ki array ko kholke woh individual objects mai convert kardega
      { $sort: { "messages.createdAt": -1 } }, // ascending order
      // ab humne sorting kar li hai lekin ab sab bhikre hue hai toh sabke grp karna
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    ); // end of aggregation pipeline jahan tak teko nahi samjha hai
  } catch (error) {
    console.error("unexpected error", error);
    return Response.json(
      {
        success: false,
        message: "Unexpected error occured",
      },
      { status: 500 }
    );
  }
}
