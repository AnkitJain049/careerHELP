import express from 'express';
import { generateInterviewQuestions } from '../controllers/interviewPrep.controller.js';
import requireAuth from '../middleware/auth.js';

const router = express.Router();
router.post('/', requireAuth, generateInterviewQuestions);

export default router;
