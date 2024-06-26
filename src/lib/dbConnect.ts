import mongoose from "mongoose";

type ConnectionObject ={
    isConnected?:number //optional
}

const connection : ConnectionObject={

}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log('Already Connected to Data Base')
        return;
    }
    else{
        try {
            const db = await mongoose.connect(process.env.MONGODB_URI || "",{})

            connection.isConnected=db.connections[0].readyState

            console.log("Data Base Connected Successfully");
        } catch (error) {
            console.log("DataBase Connection Failed",error)
            process.exit(1)
        }
    }
} // jo cheez iss function se return hogi woh ek promise hogi and woh kisi bhi type ka Promise ho sakta hai isliye humne void likha hai

export default dbConnect