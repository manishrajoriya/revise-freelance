import connectDB from "@/lib/dbConnect";
import UserModle from "@/models/userModle";
import {z} from "zod"

export async function POST(request: Request){
    await connectDB()

    try {
        const{username, code} = await request.json()
        const decodedUsername =  decodeURIComponent(username)

        const user = await UserModle.findOne({username: decodedUsername})

        if (!user) {
            return Response.json({
                success: false,
                 message: "User not found"
            },
        {status: 400})
        }

        const isCodeValid =  user.verifyCode === code
        const isCodeNotExpired =new Date(user.verifyCodeExpiry ) > new Date()
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "User verified successfully"
            },{status: 200})
        }else if(!isCodeValid){
            return Response.json({
                success: false,
                message: "Invalid verification code"
            },{status: 400})
        }else{
            return Response.json({
                success: false,
                message: "Verification code has expired"
            },{status: 400})
        }

    } catch (error) {
        console.log("verifyCode error", error);
        
        return Response.json({
            success: false,
            message: error instanceof z.ZodError ? error.issues[0].message : "An error occurred"
        },{status: 400})
    }
}