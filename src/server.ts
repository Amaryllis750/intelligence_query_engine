import express from 'express';
import cors from 'cors';
import profileRouter from './routes/profileRoute.js';

const PORT = 8000;

const app = express();

// middlwares...
app.use(express.json());
app.use(cors());

app.use('/api/profiles', profileRouter);

app.listen(PORT, ()=>(console.log(`Server is listening at port ${PORT}...`)));