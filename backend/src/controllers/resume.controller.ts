import express from 'express';
import { upload } from '../middleware/multer.middleware';
import { collectResumeText } from '../../utils';
import { ResumeTools } from '../resume-tools';

const router = express.Router();
const resumeTools = new ResumeTools();

router.get('/parse', (req, res) => {
  res.send('Hello World');
});

router.post('/parse', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;

  try {
    const resumeData = await collectResumeText(filePath);

    const buf = resumeTools.generateResume('newResume.docx', resumeData);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=newResume.docx');
    return res.send(buf);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error parsing resume');
  }
});

export default router;
