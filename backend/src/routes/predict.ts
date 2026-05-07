import { Router } from 'express';
import { predict } from '../services/predictor';
import { asyncHandler } from '../middleware/asyncHandler';
const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const exam = typeof req.query.exam === 'string' ? req.query.exam.trim().toUpperCase() : 'JEE_MAIN';
  const rank = Number(req.query.rank || 99999);

  if (!/^[A-Z_]+$/.test(exam)) {
    return res.status(400).json({ error: 'exam must contain only uppercase letters and underscores' });
  }

  if (!Number.isFinite(rank) || rank < 1) {
    return res.status(400).json({ error: 'rank must be a positive number' });
  }

  const results = await predict({ exam, rank });
  res.json({ results });
}));

export default router;
