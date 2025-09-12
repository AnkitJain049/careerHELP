import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import interviewPrepRoutes from './routes/interviewPrep.routes.js';
import coverLetterRoutes from './routes/coverLetter.routes.js';
import jobApplicationRoutes from './routes/jobApplication.routes.js';

// Ensure .env is loaded from backend/ regardless of current working directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn('Warning: JWT_SECRET is not set in .env');
}

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/interview-prep', interviewPrepRoutes);
app.use('/api/cover-letter', coverLetterRoutes);
app.use('/api/job-application', jobApplicationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;

// Start server after DB connection
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  });

export default app;

