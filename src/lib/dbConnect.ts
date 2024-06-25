import mongoose from "mongoose";


type ConnectionObject = {
    isConnected? : number
}

const connection: ConnectionObject = {}

async function connectDB(){
    if(connection.isConnected) {
        console.log("db connected already");
        return
    };
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "" , {})
        connection.isConnected = db.connections[0].readyState

        console.log("db connected");
        
    } catch (error) {
        console.log("db connection faild", error);
        process.exit(1);
    }
}

export default connectDB;