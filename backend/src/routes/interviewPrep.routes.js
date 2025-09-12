import express from 'express';
import { generateInterviewQuestions } from '../controllers/interviewPrep.controller.js';

const router = express.Router();
router.post('/', generateInterviewQuestions);

export default router;
