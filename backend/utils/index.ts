import { GoogleGenerativeAI } from '@google/generative-ai';
import * as path from 'path';
import * as fs from 'fs';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function parseResumeToJson(resumeText: string) {
  const cleanedDocument = resumeText.replace(/[^a-zA-Z0-9\s]/g, '');

  const prompt = `
    does the document below look like it's a resume, if not - please return only the text 'not a resume';
    otherwise,
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
  ${cleanedDocument}
    `;

  const response = await model.generateContent([prompt]);

  const responseText = response.response.text();

  if (responseText.includes('not a resume')) {
    throw new Error('Not a resume!');
  }

  const cleanedResponse = cleanJsonString(responseText);

  const parsedJson = JSON.parse(cleanedResponse);

  parsedJson.todaysDate = getFormattedDate();
  checkIfValidresume(parsedJson);
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

export function cleanJsonString(jsonString: string) {
  return jsonString.replace(/```json|```/g, '').replace(/undefined|null/g, '""');
}

export function getFormattedDate() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear().toString().slice(-2);

  return `${month}/${day}/${year}`;
}

export function checkIfValidresume(parsedJson: any) {
  if (
    !parsedJson.name ||
    !parsedJson.summary ||
    !parsedJson.skills ||
    !parsedJson.education ||
    !parsedJson.workHistory
  ) {
    throw new Error('Not a resume!');
  }
}
