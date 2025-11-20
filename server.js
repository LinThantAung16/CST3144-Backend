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

// Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

//Retrieve all lessons
app.get('/lessons', async (req, res) => {
    try {
        // Check if DB connection exists
        if (!db) {
            return res.status(503).json({ message: "Database not connected yet" });
        }
        
        // Fetch data from the 'lessons' collection
        const lessons = await db.collection('lessons').find({}).toArray();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});