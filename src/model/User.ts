import mongoose,{Schema, Document} from "mongoose";

export interface Message extends Document{ 
    content:string;
    createdAt:Date;
}//message is just the name of the interface that we will be using to verfiy the type of data
 /* The Document interface serves as a base type that provides common properties or methods for data models. By extending Document, the Message interface inherits these base properties or methods, ensuring it fits within the expected structure or behavior of documents in your application or database. */
// https://chatgpt.com/c/256211f2-3167-4d21-b110-e084d2983dfa

const MessageSchema:Schema<Message> = new Schema({ //yaha pe hum check kar rhe hai ki MessageSchema ka type kya hai jo hai ek schema right? ab kaunsa schema hai? Message ka schema jo humne upar define kar rkha hai
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

export interface User extends Document{ 
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isAceeptingMessage:boolean;
    isVerified:boolean;
    messages:Message[] // message ka array store ho rha hai yahan pe,jahan array ka type Message hai jo humne upar mai define kar rkha hai

}

const UserSchema:Schema<User> = new Schema({ 
    username:{
        type:String,
        required:[true,'username is required'], //agar username nahi hai toh hum andar defined message ko return kar denge
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        match:[/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/
        , 'please use a valid email address']
    },
    password:{
        type:String,
        required:[true,'passsword is required']
    },
    verifyCode:{
        type:String,
        required:[true,'VerifyCode is required']
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'VerifyCodeExpiry is required']
    },
    isVerified:{
        type:Boolean,
        default:false
        //required:[true,'VerifyCodeExpiry is required']
    },
    isAceeptingMessage:{
        type:Boolean,
        default:true
    },
    messages:{
        type:[MessageSchema]
    }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema) 

export default UserModel; 