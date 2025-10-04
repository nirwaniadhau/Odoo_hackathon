// app.js
import express from 'express';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes.js';

config();
const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    const baseUrl = `http://localhost:${PORT}`;
    console.log(`Backend server is running at ${baseUrl}`);
    console.log(`API endpoint base: ${baseUrl}/api/auth`);
    console.log(`Started at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`);
});