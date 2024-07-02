import { Message } from "@/models/userModle";


export interface ApiResponce {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>
}