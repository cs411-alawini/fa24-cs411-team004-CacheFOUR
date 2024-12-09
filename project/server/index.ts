import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables before other imports
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Log environment variables to verify they're loaded
console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME
});

import express, { Request, Response } from 'express';
import loginroutes from './src/routes/loginroutes';
import comselroutes from './src/routes/comselroutes';
import findjobroutes from './src/routes/findjobroutes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3007;

if (!process.env.PORT) {
    console.warn('Warning: PORT not set in environment variables, using default: 3007');
}

app.use(express.static(path.join(__dirname, '../client/build')));

app.use(cors());
app.use(express.json());

app.get('/api/', (req:Request, res:Response) => {
    res.send('Homepage of my Unicareer API.');
});

app.use("/api/login", loginroutes);
app.use("/api/comsel", comselroutes);
app.use("/api/findjob", findjobroutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Unicareer is running on http://localhost:${PORT}`);
});