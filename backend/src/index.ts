import express, { Application} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import articleRouter from './routes/articles';
import { db } from './config/db';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Backend is running!');
});


const createRoutes = (app:Application): void => {
	app.use('/articles', articleRouter );
	
}

createRoutes(app);

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


app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});