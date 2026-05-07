import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import collegesRouter from './routes/colleges';
import predictRouter from './routes/predict';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
	.split(',')
	.map(origin => origin.trim())
	.filter(Boolean);

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
			return;
		}
		callback(new Error('CORS blocked for this origin'));
	}
}));
app.use(express.json());

app.use('/colleges', collegesRouter);
app.use('/predict', predictRouter);

app.get('/health', (_req, res) => {
	res.json({ ok: true });
});

// Temporary seed endpoint (remove after seeding)
app.post('/seed', async (_req, res) => {
	try {
		const { execSync } = require('child_process');
		execSync('npm run db:seed', { stdio: 'inherit' });
		res.json({ success: true, message: 'Database seeded successfully' });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

app.use((_req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
