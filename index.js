import express  from "express";
import { MongoClient } from "mongodb";
import 'dotenv/config'
import { dressesRouter } from "./routes/lists.js";
import { usersRouter } from "./routes/users.js";
import cors from "cors";
export const app=express()
const PORT=9000
app.use(cors());
const mongoURL=process.env.mongoURL



async function CreateConnection(){
    const client=new MongoClient(mongoURL)
   await client.connect()
    console.log("mongodb is connected")
    return client
}
export const client= await CreateConnection()



app.get('/',async(req,res)=>{
    res.send("hello world")
})

app.use('/dresses',dressesRouter)
app.use('/users',usersRouter)

app.listen(PORT,()=>console.log("the port has started in the",PORT))

