//basically we are setting up a paradigm for the responses that we send
import { Message } from "@/model/User";

export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessage?:boolean // optional data fields in the api response , inke na hone se koi farak nahi padta
    messages?:Array<Message>
}