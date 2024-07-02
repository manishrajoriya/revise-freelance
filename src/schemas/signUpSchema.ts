import {z} from "zod"

export const usernameValidation = z.
    string()
    .min(3, {message: "Username must be atleast 3 characters"})
    .max(30, {message: "Username must be at max 30 characters"})
    .regex(/^[a-zA-Z0-9_]+$/, {message: "Username must contain only letters, numbers, and underscores"})

export const signUpSchema = z.object({
        username: usernameValidation,
        email: z.string().email(),
        password: z.string().min(6, {message: "Password must be atleast 6 characters"})
})