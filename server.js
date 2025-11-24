const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Native Driver
const cors = require('cors');
const fs = require('fs');
const path = require('path');
// Initialize App
const app = express();

// Configure Middleware
app.use(express.json()); 
app.use(cors());
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

// static file middleware that returns lesson images
app.use('/images', (req, res, next) => {
    const filePath = path.join(__dirname, 'static', req.url);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            return res.status(404).send('Image not found');
        }
        // File exists, send it
        res.sendFile(filePath);
    });
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

//POST Order
const Order = require('./orderRequest');
app.post('/orders', async (req, res) => {
    try {
        // Use the imported Order class
        const orderModel = new Order(req.body);

        const result = await db.collection('orders').insertOne(orderModel.toDocument());

        for (const lessonId of orderModel.lessonIDs) {
            
            await db.collection('lessons').updateOne(
                { id: lessonId }, 
                { $inc: { spaces: -1 } } 
            );
        }

        res.status(201).json({
            message: "Order successfully added",
            result: result
        });

    } catch (err) {
        // Catch errors thrown by the Order class setter
        res.status(400).json({ message: err.message });
    }
});

// Update available spaces
app.put('/lessons/:id', async (req, res) => {
    try {
        const lessonId = parseInt(req.params.id);
        const updateData = req.body; // Expecting { spaces: 4 }

        const result = await db.collection('lessons').updateOne(
            { id: lessonId },
            { $set: updateData }
        );

        res.json({ message: "Lesson updated", result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// This handles the "Search as you type" requirement
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q; // Get the search term ?q=math

        if (!query) {
            return res.status(400).json({ message: "Query parameter 'q' required" });
        }

        // Create a Regex for case-insensitive search
        const regex = new RegExp(query, 'i');

        // Search in 'subject' OR 'location'
        const results = await db.collection('lessons').find({
            $or: [
                { subject: regex },
                { location: regex }
            ]
        }).toArray();

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});