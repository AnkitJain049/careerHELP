import express from 'express';
import { generateCoverLetter } from '../controllers/coverLetter.controller.js';

const router = express.Router();
router.post('/', generateCoverLetter);

export default router;
