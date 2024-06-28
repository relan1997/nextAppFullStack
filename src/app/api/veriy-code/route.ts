import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,code} = await request.json() // accessing the username and code from the req object sent from frontend

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json({
                success:false,
                message:'User not found'
            },{status:500})
        }
         
        const isCodeVerified = user.verifyCode ==  code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date(Date.now())
        if(isCodeNotExpired && isCodeVerified)
            {
                user.isVerified=true
                await user.save()
                return Response.json({
                    success:true,
                    message:'User verified'
                },{status:200})
            } 
            else if(!isCodeNotExpired){
                return Response.json({
                    success:false,
                    message:'User not verified as code expired pls sign up again to get new code'
                },{status:405})
            }
            else if(!isCodeVerified){
                return Response.json({
                    success:false,
                    message:'User not verified as code not same'
                },{status:405})
            }

    } catch (error) {
        console.error("Error verifying user ", error);
        return Response.json(
          {
            success: false,
            message: "error verifying user",
          },
          { status: 500 }
        );
      }
}
