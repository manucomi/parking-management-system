import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (_, res) => {
  res.json({ message: 'Backend API placeholder for Parking Management System' });
});

app.listen(4000, () => console.log('✅ Backend running on http://localhost:4000'));
