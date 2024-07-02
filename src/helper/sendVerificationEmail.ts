import { resend } from "@/lib/resend";
import { ApiResponce } from "@/types/ApiResponce";
import VerificationEmail from "../../emails/VerificationEmail";


export async function sendVerificationEmail(
    username: string,
    email:string,
    verifyCode:string

):Promise<ApiResponce>{
    try {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Verification Code",
            react: VerificationEmail({username, otp: verifyCode  })
        })

        console.log("send",resend);
        

        return {
            success: true,
            message: "Verification email sent"
        }
        
    } catch (error) {
        console.log("Error sending verification email");
        return {
            success: false,
            message: "Error sending verification email"
        }
    }
}

