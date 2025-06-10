import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import articleRouter from './routes/articles';
import stripeRoutes from './routes/stripeRoutes';
import stripeWebhook from './routes/webhookRoutes';
import customersRouter from './routes/customers';
import { db } from './config/db';

console.log('✅ Servern försöker starta...');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use('/webhook', stripeWebhook);

app.use(

	cors({
		origin: [
			'https://nyhetsprenumeration-uczf.vercel.app',
			'http://localhost:5173',
		],
		credentials: true,
	})
);
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Backend is running!');
});

app.use('/customers', customersRouter);

const createRoutes = (app: Application): void => {
	app.use('/articles', articleRouter);
};

app.use('/stripe', stripeRoutes);

createRoutes(app);

app.get('/db-check', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT 1');
		res.json({ success: true, message: 'DB connection OK', rows });
		console.log('DB connection successful:', rows);
	} catch (err: any) {
		res
			.status(500)
			.json({ success: false, message: 'DB connection failed' + err.message });
		console.log('DB connection failed:', err.message);
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
