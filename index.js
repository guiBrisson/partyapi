const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Import Routes
const authRoute = require('./routes/auth');

// Connect to DataBase
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log('Connected to the DataBase');
})

// Middlewares
app.use(express.urlencoded({ extended: true }));

// Route Middlewares
app.use('/api/auth', authRoute);

app.listen(3000, () => console.log('Server up and running'));
