import express from 'express';
import { createJob, getJobs, updateJob, deleteJob } from '../controllers/jobApplication.controller.js';

const router = express.Router();

router.post('/', createJob); // Add a new job application
router.get('/:userId', getJobs); // Get all jobs for a user
router.put('/:jobId', updateJob); // Edit a job application
router.delete('/:jobId', deleteJob); // Delete a job application

export default router;
