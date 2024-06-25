import {z} from 'zod'

export const usernameValidation=z
.string()
.min(2,'Username must pe atleast 2 chars')
.max(20,"Username must not be more that 20 chars")
.regex(/^[a-zA-Z0-9]+$/, 'Username must not contain special Characters')


export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:'Invalid email address'}),
    password:z.string().min(6,{message:"Password must be atleast 6 characters"})
})