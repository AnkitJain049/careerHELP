import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { GoogleGenerativeAI } from '@google/generative-ai';
import User from '../models/User.js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function generateCoverLetter(req, res) {
  const { userId, position, company, skills } = req.body;
  if (!userId || !position || !company) {
    return res.status(400).json({ error: 'userId, position & company are required.' });
  }

  try {
    // Fetch user details from MongoDB
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const prompt = `Write a professional cover letter for the position of ${position} at ${company}.
Today's date is ${today}.
The applicant's details are:
Name: ${user.name}
Email: ${user.email}
Relevant skills: ${skills}
Other info: ${user.about || ''}
Format as a formal cover letter.`;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    // Remove markdown code block if present
    if (text.startsWith('```')) {
      text = text.replace(/^```\w*\n/, '').replace(/```$/, '').trim();
    }
    res.json({ coverLetter: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
