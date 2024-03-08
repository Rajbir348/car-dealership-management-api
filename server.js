import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dealershipRoutes from './routes/dealershipRoutes.js';
import commonRoutes from './routes/commonRoutes.js';

import jwtValidation from './middleware/jwtValidation.js';
import {connectDB} from './config/db.js';


dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', jwtValidation, userRoutes); // Apply jwtValidation middleware to user routes
app.use('/api/dealerships', jwtValidation, dealershipRoutes); // Apply jwtValidation middleware to dealership routes
app.use('/api', commonRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
});
