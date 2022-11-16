const express = require("express");
const mongodb = require('mongodb');
// const { MongoClient } = require("mongodb/mongodb");
const URL = "mongodb://localhost:27017"
const { ppid } = require("process");
const app = express();
app.use(express.json());
const mongoclient =new mongodb.MongoClient(URL)
const cors = require('cors')


app.use(cors({
    origin : "http://localhost:3000"
}))

//creating mentor
app.post("/createMentor",async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        let data =await db.collection("mentor").insertOne(req.body);
        await connection.close();
        res.json({message : "created"})
    }
    catch(err){
        res.json({message:"error"})
    }
})

//total mentors
app.get("/mentor",async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        let data =await db.collection("mentor").find({}).toArray();
        await connection.close();
        res.json(data);
    }
    catch(err){
        res.json({message:"error"})
    }
})

//view particular mentor
app.get(`/ViewMentor/:id`,async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        let mentor =await db.collection("mentor").find({_id:mongodb.ObjectId(req.params.id)}).toArray();
        await connection.close();
        // console.log(mentor);
        res.json(mentor);
    }
    catch(err){
        res.json({message:"error"})
    }
})



//creating students
app.post("/createStudent",async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        let data =await db.collection("student").insertOne(req.body);
        await connection.close();
        res.json({message : "created"})
    }
    catch(err){
        res.json({message:"error"})
    }
})

//total students
app.get("/students",async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        let data =await db.collection("student").find({}).toArray();
        await connection.close();
        res.json(data);
    }
    catch(err){
        res.json({message:"error"})
    }
})


//student without mentor
app.get("/studentsAdd",async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        let data =await db.collection("student").find({mID:{$exists:false}}).toArray();
        await connection.close();
        res.json(data);
    }
    catch(err){
        res.json({message:"error"})
    } 
})




//view particular student
app.get(`/ViewStudent/:id`,async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        let mentor =await db.collection("student").find({_id:mongodb.ObjectId(req.params.id)}).toArray();
        await connection.close();
        // console.log(mentor);
        res.json(mentor);
    }
    catch(err){
        res.json({message:"error"})
    }
})


//adding student to mentor
app.post("/addingStudent/:id",async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        // console.log((req.body.student).length);
    
        let arr = req.body;
        console.log(arr);
        // console.log(arr.length);
        // console.log(arr[1]);
        for (var i=0;i<arr.length;i++){
            // delete arr[i]._id
            let data =await db.collection("StudentList").insertOne({_mID : mongodb.ObjectId(req.params.id),...arr[i]});
            let studentupdate =await db.collection("student").updateOne({_id:mongodb.ObjectId(arr[i]._id)},{$set:{_mID : mongodb.ObjectId(req.params.id)}});
        }
        
        await connection.close();
        res.json({message : "created"})
    }
    catch(err){
        res.json({message:"error"})
    }
})


//Viewing Students of particular mentor
app.get(`/ViewMentorStudents/:id`,async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        let student =await db.collection("StudentList").find({_mID:mongodb.ObjectId(req.params.id)}).toArray();
        await connection.close();
        // console.log(student);
        res.json(student);
    }
    catch(err){
        res.json({message:"error"})
    }
})

//view added student
app.get(`/StudentsList`,async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        let student =await db.collection("StudentList").find({}).toArray();
        await connection.close();
        // console.log(student);
        res.json(student);
    }
    catch(err){
        res.json({message:"error"})
    }
})


//add mentor for student
app.post("/addmentor/:id",async(req,res)=>{
    try {
        let connection  =await mongoclient.connect();
        let db = connection.db("nov8");
        const mentor = req.body;
            let data =await db.collection("student").updateOne({_id : mongodb.ObjectId(req.params.id)},{$set:{_mID:mongodb.ObjectId(mentor._id)}});
            let data1 =await db.collection("student").findOne({_id : mongodb.ObjectId(req.params.id)})
            let data2 =await db.collection("StudentList").insertOne({_mID : mongodb.ObjectId(mentor._id),...data1});
        
        await connection.close();
        res.json({message : "created"})
    }
    catch(err){
        res.json({message:"error"})
    }
})











console.log("started")
app.listen(3005);