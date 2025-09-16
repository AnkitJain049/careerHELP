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
    const prompt = `Return ONLY a JSON array, no prose, no explanations, no markdown, no code fences.
Each array item must strictly be an object with keys: "question" (string), "options" (array of 4 strings), and "answer" (string equal to exactly one of the options).
Generate 15 interview questions for the position of ${position} for a candidate with ${experience} experience.
Output example (structure only): [{"question":"...","options":["...","...","...","..."],"answer":"..."}]`;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Helper: extract first JSON array from possibly noisy text
    const extractJsonArray = (input) => {
      if (!input || typeof input !== 'string') return [];
      let cleaned = input
        .replace(/^```json\s*[\r\n]?/i, '')
        .replace(/^```\w*\s*[\r\n]?/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      // Try to find the first JSON array
      const match = cleaned.match(/\[[\s\S]*\]/);
      const candidate = match ? match[0] : cleaned;
      try {
        const parsed = JSON.parse(candidate);
        return Array.isArray(parsed) ? parsed : [];
      } catch (_) {
        return [];
      }
    };

    // Extract and normalize
    const parsed = extractJsonArray(text);
    const normalized = parsed.map((q) => {
      const question = typeof q?.question === 'string' ? q.question.trim() : '';
      const options = Array.isArray(q?.options)
        ? q.options.map((opt) => (typeof opt === 'string' ? opt.trim() : '')).filter(Boolean)
        : [];
      const answer = typeof q?.answer === 'string' ? q.answer.trim() : '';
      return { question, options, answer };
    }).filter((q) => q.question && q.options.length > 0);

    return res.json({ questions: normalized });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
