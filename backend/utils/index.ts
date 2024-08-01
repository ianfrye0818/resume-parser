import { GoogleGenerativeAI } from '@google/generative-ai';
import * as path from 'path';
import * as fs from 'fs';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { Resume } from '../types';

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function parseResumeToJson(resumeText: string) {
  const cleanedResume = resumeText.replace(/[^a-zA-Z0-9\s]/g, '');

  const prompt = `
    is the following a resume, if not - please return the text 'not a resume';
    if it is a resume, can you please parse it into a json object with the following format do not include any special characters or formatting:
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
        }


    Please clean up any grammatical errors and ensure that the resume and summary sound professional.
  ${cleanedResume}
    `;

  const response = await model.generateContent([prompt]);
  const responseText = response.response.text();

  const cleanedResponse = cleanJsonString(responseText);

  const parsedJson = JSON.parse(cleanedResponse);

  if (Object.values(parsedJson).some((value) => value === 'not a resume')) {
    throw new Error('Not a resume!');
  }

  return parsedJson;
}

export async function collectResumeText(filePath: string) {
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

function cleanJsonString(jsonString: string) {
  // Remove unwanted characters or formatting
  return jsonString.replace(/```json|```/g, '').trim();
}
