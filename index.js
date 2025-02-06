const express = require('express');
const { resolve } = require('path');
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
require("dotenv").config();
const app = express();
const port = 3010;
const mongoUrl=process.env.MongoDB_URL;
app.use(express.static('static'));
app.use(express.json())
mongoose.connect(mongoUrl)
.then(()=>{
  console.log("successfully connected to the database")
})
.catch((er)=>{
  console.log("error connecting to the database",er)
})
const UserModel=require("./schema.js")
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post("/add-user",async(req,res)=>{
  try{
    const {username,email,password}=req.body
    if (!username || !email || !password){
      return res.status(400).json({message:"incomplete data please fill all the required data",success:false})
    }
    const saltRounds=10
    const hashedPassword=await bcrypt.hash(password,saltRounds)
    const data=new UserModel({
      username:username,
      email:email,
      password:hashedPassword
    })
    console.log(data)
    await data.save()
    res.status(200).json({message:"successfully created the new user",success:true})
  }
  catch(er){
    res.status(500).json({message:"internal server error",error:er.message})
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
