import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    if (!user.isAceeptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message); // messages jo array hai usko strict instruction hai ki sirf message schema type ki data ko hi input lena hai and the as Message asserts that jo item push ho rha hai woh message type ka hi hai
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error in adding messages", error);
    return Response.json(
      {
        success: false,
        message: "Unexpected error occured",
      },
      { status: 500 }
    );
  }
}
