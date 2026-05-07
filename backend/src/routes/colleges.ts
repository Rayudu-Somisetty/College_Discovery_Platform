import { NextFunction, Request, Response, Router } from 'express';
import { listColleges, getCollegeBySlug, compareColleges } from '../controllers/collegesController';
import { asyncHandler } from '../middleware/asyncHandler';
const router = Router();

const validateListQuery = (req: Request, res: Response, next: NextFunction) => {
	const pageRaw = req.query.page;
	const limitRaw = req.query.limit;
	const minFeeRaw = req.query.minFee;
	const maxFeeRaw = req.query.maxFee;

	const page = pageRaw === undefined ? undefined : Number(pageRaw);
	const limit = limitRaw === undefined ? undefined : Number(limitRaw);
	const minFee = minFeeRaw === undefined ? undefined : Number(minFeeRaw);
	const maxFee = maxFeeRaw === undefined ? undefined : Number(maxFeeRaw);

	if (page !== undefined && (!Number.isInteger(page) || page < 1)) {
		return res.status(400).json({ error: 'page must be a positive integer' });
	}

	if (limit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > 100)) {
		return res.status(400).json({ error: 'limit must be an integer between 1 and 100' });
	}

	if (minFee !== undefined && (!Number.isFinite(minFee) || minFee < 0)) {
		return res.status(400).json({ error: 'minFee must be a non-negative number' });
	}

	if (maxFee !== undefined && (!Number.isFinite(maxFee) || maxFee < 0)) {
		return res.status(400).json({ error: 'maxFee must be a non-negative number' });
	}

	if (minFee !== undefined && maxFee !== undefined && minFee > maxFee) {
		return res.status(400).json({ error: 'minFee cannot be greater than maxFee' });
	}

	next();
};

const validateCompareQuery = (req: Request, res: Response, next: NextFunction) => {
	const idsRaw = typeof req.query.ids === 'string' ? req.query.ids : '';
	const ids = idsRaw
		.split(',')
		.map(value => Number(value))
		.filter(value => Number.isInteger(value) && value > 0);

	const uniqueIds = new Set(ids);
	if (ids.length !== uniqueIds.size) {
		return res.status(400).json({ error: 'ids must be unique' });
	}

	if (ids.length < 2 || ids.length > 3) {
		return res.status(400).json({ error: 'Provide 2 or 3 ids' });
	}

	next();
};

router.get('/', validateListQuery, asyncHandler(listColleges));               // GET /colleges?q=&location=&course=&page=&limit=
router.get('/compare', validateCompareQuery, asyncHandler(compareColleges)); // GET /colleges/compare?ids=1,2
router.get('/slug/:slug', asyncHandler(getCollegeBySlug));                   // GET /colleges/slug/:slug

export default router;
