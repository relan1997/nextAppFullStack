import {z} from 'zod'

export const signInSchema=z.object({
    identifier:z.string(), // basically hum username ko yaha ientifier bula rhe hai
    password:z.string()
})