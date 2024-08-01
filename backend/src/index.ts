import express from 'express';
import 'dotenv/config';
import ResumeRoute from './controllers/resume.controller';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/download', (req, res) => {});

app.use('/resume', ResumeRoute);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
