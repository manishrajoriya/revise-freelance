import connectDB from "@/lib/dbConnect";
import UserModle from "@/models/userModle";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const usernameQuarySchema = z.object({
    username: usernameValidation
})

export async function POST(request: Request){
    await connectDB()


    try {
        const {searchParams } = new URL(request.url)
        const quaryPrams = {
            username : searchParams.get('username')
        }

        const zodResult = usernameQuarySchema.safeParse(quaryPrams)
console.log("zodresult", zodResult);

        if (!zodResult.success) {
                const usernameError = zodResult.error.format().username?._errors || []
                
                return  Response.json({
                    success: false,
                    message: usernameError
                }, {status: 400})
        }

        const {username} = zodResult.data

        const existingUserVerifiedByUsernae = await UserModle.findOne({username, isVerified: true})

        if (existingUserVerifiedByUsernae) {
            return Response.json({
                success: false,
                message: "username alredy taken"
            },{status: 400})
        }

        return Response.json({
            success: true,
            message: "username available"
        },{status: 200})



        
    } catch (error) {
        console.error("username Error:", error)

        return Response.json({
            success: false,
            message: "Error checking username availability"
        },{status: 500})
    }
}