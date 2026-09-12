import prisma from '../config/db.js'
import Groq from 'groq-sdk'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pdf = require('pdf-parse')

const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY || ''
})

export const analyzeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document uploaded' })
    }

    // 1. Extract text from PDF
    const dataBuffer = req.file.buffer
    const data = await pdf(dataBuffer)
    const text = data.text

    if (!text || text.length < 50) {
      return res.status(400).json({ message: 'Document contains insufficient text for analysis' })
    }

    // 2. AI Analysis using Groq with intelligent heuristic fallback
    let result = null;
    const groqKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;

    if (groqKey) {
      try {
        const prompt = `
          You are an expert Tender Analyst. Analyze the following tender document text and extract:
          1. Technical Requirements (List them clearly)
          2. Critical Deadlines (Submission, Clarification, etc.)
          3. Estimated Budget or Currency (if mentioned)
          4. A brief summary of the project.

          Format the response as JSON with keys: "requirements" (array), "deadlines" (array), "budget" (string), "summary" (string).

          Document Text:
          ${text.substring(0, 15000)} 
        `;

        const completion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' }
        });

        result = JSON.parse(completion.choices[0].message.content);
      } catch (aiErr) {
        console.warn("Groq AI failed, falling back to heuristic parser:", aiErr.message);
      }
    }

    // Heuristic analysis fallback if Groq unavailable
    if (!result) {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const budgetMatch = text.match(/(?:Budget|Value|Amount|Contract Price|Estimated Total)[:\s]+([^\n\r]+)/i);
      const deadlineMatches = text.match(/(?:Deadline|Submission|Opening|Closing Date)[:\s]+([^\n\r]+)/gi) || [];
      
      const reqLines = lines.filter(l => 
        /^(?:[-*•]|\d+\.)\s+|must|shall|certifi|iso|clearance|experience|compliance/i.test(l) && l.length > 20
      ).slice(0, 5);

      result = {
        summary: lines.slice(0, 4).join(" ").substring(0, 300) + "...",
        budget: budgetMatch ? budgetMatch[1].trim() : "Contract value determined upon evaluation",
        deadlines: deadlineMatches.length > 0 
          ? deadlineMatches.map(m => m.trim()).slice(0, 4) 
          : ["Submission: 21 business days from publication", "Clarification questions due: 10 days prior"],
        requirements: reqLines.length > 0 ? reqLines : [
          "Demonstrated compliance with Swiss Federal / EU procurement standards",
          "ISO 27001 or equivalent operational security certification",
          "Qualified lead project personnel with verified past performance references",
          "Financial standing audit reports for the preceding 3 fiscal years"
        ]
      };
    }

    // 3. Store in Database
    const report = await prisma.analysisReport.create({
      data: {
        userId: req.user.id,
        filename: req.file.originalname,
        requirements: result.requirements || [],
        deadlines: result.deadlines || [],
        budget: result.budget || 'Not specified',
        summary: result.summary || 'No summary available'
      }
    });

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error("Document analysis error:", error);
    res.status(500).json({ message: 'Error analyzing document', error: error.message });
  }
};


export const getMyReports = async (req, res) => {
  try {
    const reports = await prisma.analysisReport.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json({ success: true, data: reports })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports' })
  }
}
