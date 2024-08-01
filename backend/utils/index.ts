import { GoogleGenerativeAI } from '@google/generative-ai';
import * as path from 'path';
import * as fs from 'fs';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { Resume } from '../types';

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function parseResumeToJson(resumeText: string): Promise<Resume> {
  const cleanedResume = resumeText.replace(/[^a-zA-Z0-9\s]/g, '');
  const prompt = `
    Parse the following resume into a JSON object:

    ${cleanedResume}

    The JSON object should have the following structure:
    {
    name: string;
    summary: string;
    skills: string[];
    education: { school: string; degree: string }[];
    workHistory: {
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      title: string;
      duties: string[];
    }[];

    if the duties are not present, please create some based off of the job title.

    Also, please correct any grammatical errors and ensure that the resume and summary sound professional.
  `;

  const response = await model.generateContent([prompt]);
  const cleanedResponse = response.response
    .text()
    .replace(/```json|```/g, '')
    .trim();
  return JSON.parse(cleanedResponse);
}

export async function collectResumeText(filePath: string): Promise<Resume> {
  const fullPath = path.resolve(__dirname, '../', filePath);
  const buffer = fs.readFileSync(fullPath);

  let data: string;
  if (filePath.endsWith('.docx') || filePath.endsWith('.doc')) {
    const parsedData = await mammoth.extractRawText({ path: fullPath });
    data = parsedData.value;
  } else if (filePath.endsWith('.pdf')) {
    const parsed = await pdfParse(buffer);
    data = parsed.text;
  } else {
    throw new Error('Unsupported file type');
  }

  return parseResumeToJson(data);
}
