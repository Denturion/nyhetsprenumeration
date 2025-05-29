import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Backend is running!');
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

import { db } from './config/db';

app.get('/db-check', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT 1');
		res.json({ success: true, message: 'DB connection OK', rows });
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: 'DB connection failed' + error });
	}
});
