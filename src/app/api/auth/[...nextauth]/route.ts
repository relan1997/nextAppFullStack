import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler = NextAuth(authOptions) // ab humne options ko alag file mai isliye rakha hai taaki agar humme abhi suppose gitHub ya google ka provider lagana ho, toh hum bas options mai jaake unhe add karke change kar sakte hai

export {handler as GET, handler as POST} // ab yeh renaming isliye ki gayi hai kyunkib routes files mai GET POST etc waale convention use hote hai due to framework restrictions