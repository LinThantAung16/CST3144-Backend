const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Native Driver
const cors = require('cors');
const fs = require('fs');

// Initialize App
const app = express();

// Configure Middleware
app.use(express.json()); 

//db connection


const uri = "mongodb+srv://linthantag16_db_user:YwMQ5G71I1Vg4K5j@afterschoolhubcluster.unlkzs5.mongodb.net/?appName=AfterSchoolHubCluster";
if(!uri){
    throw new Error("Error cannot connect");
}
const client = new MongoClient(uri);
let db;

async function connectDB(){
    try{
        await client.connect();
        db= client.db("AfterSchoolHub");
        console.log("Connected to mongoDB");
    }catch(err){
        console.log("Connection failed", err);
    }
}
connectDB();




// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});