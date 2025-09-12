import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import Job from '../models/Job.js';

// Create a new job application
export async function createJob(req, res) {
  const { userId, title, company, status, notes } = req.body;
  if (!userId || !title || !company) {
    return res.status(400).json({ error: 'userId, title, and company are required.' });
  }
  try {
    const job = await Job.create({ userId, title, company, status, notes });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all jobs for a user
export async function getJobs(req, res) {
  const { userId } = req.params;
  try {
    const jobs = await Job.find({ userId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a job application
export async function updateJob(req, res) {
  const { jobId } = req.params;
  const { userId, title, company, status, notes } = req.body;
  try {
    const job = await Job.findOneAndUpdate({ _id: jobId, userId }, { title, company, status, notes }, { new: true });
    if (!job) {
      return res.status(404).json({ error: 'Job not found or unauthorized.' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a job application
export async function deleteJob(req, res) {
  const { jobId } = req.params;
  const { userId } = req.body;
  try {
    const job = await Job.findOneAndDelete({ _id: jobId, userId });
    if (!job) {
      return res.status(404).json({ error: 'Job not found or unauthorized.' });
    }
    res.json({ message: 'Job deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
