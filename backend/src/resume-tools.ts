import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import * as fs from 'fs';
import * as path from 'path';

export class ResumeTools {
  generateResume(outputPath: string, documentData: any) {
    const content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(documentData);

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    fs.writeFileSync(path.resolve(__dirname, outputPath), buf);

    return buf;
  }
}
