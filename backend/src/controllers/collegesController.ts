import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

const topRecruiters = ['TCS', 'Infosys', 'Amazon', 'Deloitte'];

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const listColleges = async (req: Request, res: Response) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = Math.min(parsePositiveInt(req.query.limit, 12), 100);
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const location = typeof req.query.location === 'string' ? req.query.location.trim() : '';
  const course = typeof req.query.course === 'string' ? req.query.course.trim() : '';
  const minFee = req.query.minFee !== undefined ? Number(req.query.minFee) : undefined;
  const maxFee = req.query.maxFee !== undefined ? Number(req.query.maxFee) : undefined;

  const where: Prisma.CollegeWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { city: { contains: q, mode: 'insensitive' } }
            ]
          }
        : {},
      location
        ? {
            OR: [
              { state: { contains: location, mode: 'insensitive' } },
              { city: { contains: location, mode: 'insensitive' } }
            ]
          }
        : {},
      course
        ? {
            courses: {
              some: {
                OR: [
                  { name: { contains: course, mode: 'insensitive' } },
                  { degreeType: { contains: course, mode: 'insensitive' } }
                ]
              }
            }
          }
        : {},
      Number.isFinite(minFee) ? { averageFees: { gte: minFee as number } } : {},
      Number.isFinite(maxFee) ? { averageFees: { lte: maxFee as number } } : {}
    ]
  };

  const [total, data] = await prisma.$transaction([
    prisma.college.count({ where }),
    prisma.college.findMany({
      where,
      orderBy: { rating: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })
  ]);

  res.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    }
  });
};

export const getCollegeBySlug = async (req: Request, res: Response) => {
  const slug = typeof req.params.slug === 'string' ? req.params.slug : '';
  const college = (await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      reviews: { orderBy: { createdAt: 'desc' } }
    }
  })) as Prisma.CollegeGetPayload<{
    include: {
      courses: true;
      reviews: true;
    };
  }> | null;

  if (!college) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json({
    college,
    courses: college.courses,
    placements: {
      placementRate: college.placementRate,
      avgPackage: college.avgPackage,
      highestPackage: college.highestPackage,
      topRecruiters
    },
    reviews: college.reviews
  });
};

export const compareColleges = async (req: Request, res: Response) => {
  const idsRaw = typeof req.query.ids === 'string' ? req.query.ids : '';
  const ids = idsRaw
    .split(',')
    .map(value => Number(value))
    .filter(value => Number.isInteger(value) && value > 0);

  if (ids.length < 2 || ids.length > 3) {
    return res.status(400).json({ error: 'Provide 2 or 3 ids' });
  }

  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
    include: {
      courses: {
        select: { name: true },
        take: 1
      }
    }
  });

  res.json({
    colleges: colleges.map(college => ({
      id: college.id,
      name: college.name,
      city: college.city,
      state: college.state,
      averageFees: college.averageFees,
      placementRate: college.placementRate,
      rating: college.rating,
      keyCourse: college.courses[0]?.name ?? null
    }))
  });
};

