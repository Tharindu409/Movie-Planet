require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const localRoutes = require('./routes/localRoutes');
const app = express();

//middleware
app.use(cors());
app.use(express.json());
 
app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/collections', collectionRoutes);
app.use('/admin', adminRoutes);
app.use('/local', localRoutes);

const mongoUri = process.env.MONGO_URI || "mongodb+srv://ntharindu331_db_user:CkPBHlUibC1h49Hy@cluster0.qw9cmg5.mongodb.net/";

mongoose.connect(mongoUri)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message || err);
        process.exit(1);
    });


 

