import UserModle from "@/models/userModle";
import connectDB from "@/lib/dbConnect";
import bcryptjs from "bcryptjs"
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";


export async function POST(request: Request){
    await connectDB()
    try {
        const {username, email, password} = await request.json();

       const existingUserVerifiedByUsernae = await UserModle.findOne({username, isVerified: true})

       if (existingUserVerifiedByUsernae) {
        return Response.json(
            {
                success: false,
                message: "user already exist"
            },
            {status: 400}
        )
       }

       const existingUserByEmail = await UserModle.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
       if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
            return Response.json(
                {
                    success: false,
                    message: "Email already exist"
                },
                {status: 400}
            )
        }else{
            const hashedPassword = await bcryptjs.hash(password, 10);
            
            const verifyCodeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
            await existingUserByEmail.save();

            return  Response.json({
                success: false,
                message: "user present but not verified"
            })
            
        }

       }else{
        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new UserModle({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
            isAcceptingMessage: true,
            message: []
        });

        await newUser.save();

       const emailResponce = await sendVerificationEmail(email, username, verifyCode)
// console.log("emailresponce", emailResponce);

       if (!emailResponce.success) {
        return Response.json(
            {
                success: false,
                message: emailResponce.message
            },
            {status: 500}
        )
       }
       
       

       return Response.json(
        {
            success: true,
            message: "signup success, please verify"
        },{status: 200}
    )



       }
        
    } catch (error) {
        console.log("signup error", error);
        return Response.json(
            {
                success: false,
                message: "signup error"
            },
            {status: 500}
        )
    }
}