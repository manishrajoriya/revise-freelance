import mongoose, {Schema, Document} from "mongoose";




export interface Message extends Document{
    content: string;
    createdAt: Date;
}

const MessageSchema:Schema<Message> = new Schema ({
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, required: true},
});

export interface User extends Document {
    
    email: string;
    username: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message:Message[];
}

const UserSchema:Schema<User> = new Schema({
    email: {type: String, required: [true, "email is required "], unique: true},
    username: {type: String, required: [true, "username is required"], unique: true},
    password: {type: String, required: [true, "password is required"]},
    verifyCode: {type: String, required: [true, "verify code is required"]},
    verifyCodeExpiry: {type: Date, required: [true, "verify code expiry is required"]},
    isVerified: {type: Boolean, default: false},
    isAcceptingMessage: {type: Boolean, default: true},
    message: [MessageSchema],
});

const UserModle =(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModle;