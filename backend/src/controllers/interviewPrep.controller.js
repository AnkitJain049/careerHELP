import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function generateInterviewQuestions(req, res) {
  const { experience, position } = req.body;
  if (!experience || !position) {
    return res.status(400).json({ error: 'Experience and position are required.' });
  }

  try {
    const prompt = `Generate 15 interview questions for the position of ${position} for a candidate with ${experience} experience. Each question should have 4 options, only one of which is correct. Format: [{question: '', options: ['', '', '', ''], answer: ''}]`;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    // Remove markdown code block if present
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\n/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\w*\n/, '').replace(/```$/, '').trim();
    }
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (e) {
      questions = text;
    }
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
