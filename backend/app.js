// app.js
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

config();
const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const baseUrl = `http://localhost:${PORT}`;
  console.log(`✅ Backend server running at ${baseUrl}`);
  console.log(`🔗 API endpoint base: ${baseUrl}/api/auth`);
  console.log(`🕒 Started at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`);
});
