import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { getLocalData } from '../data/localData';

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

  try {
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
  } catch {
    const local = getLocalData();
    const courseMap = new Map<number, Array<{ name: string; degree_type: string }>>();
    for (const c of local.courses) {
      const prev = courseMap.get(c.college_id) || [];
      prev.push({ name: c.name, degree_type: c.degree_type });
      courseMap.set(c.college_id, prev);
    }

    const qLower = q.toLowerCase();
    const locationLower = location.toLowerCase();
    const courseLower = course.toLowerCase();

    const filtered = local.colleges
      .filter(college => {
        const matchesQ =
          !q ||
          college.name.toLowerCase().includes(qLower) ||
          college.city.toLowerCase().includes(qLower);

        const matchesLocation =
          !location ||
          college.state.toLowerCase().includes(locationLower) ||
          college.city.toLowerCase().includes(locationLower);

        const collegeCourses = courseMap.get(college.id) || [];
        const matchesCourse =
          !course ||
          collegeCourses.some(item =>
            item.name.toLowerCase().includes(courseLower) ||
            item.degree_type.toLowerCase().includes(courseLower)
          );

        const matchesMinFee = !Number.isFinite(minFee) || college.averageFees >= (minFee as number);
        const matchesMaxFee = !Number.isFinite(maxFee) || college.averageFees <= (maxFee as number);

        return matchesQ && matchesLocation && matchesCourse && matchesMinFee && matchesMaxFee;
      })
      .sort((a, b) => b.rating - a.rating);

    const total = filtered.length;
    const data = filtered.slice((page - 1) * limit, page * limit);

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      }
    });
  }
};

export const getCollegeBySlug = async (req: Request, res: Response) => {
  const slug = typeof req.params.slug === 'string' ? req.params.slug : '';
  let college = null as Prisma.CollegeGetPayload<{
    include: {
      courses: true;
      reviews: true;
    };
  }> | null;

  try {
    college = (await prisma.college.findUnique({
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
  } catch {
    const local = getLocalData();
    const localCollege = local.colleges.find(item => item.slug === slug);
    if (!localCollege) {
      return res.status(404).json({ error: 'Not found' });
    }

    const courses = local.courses
      .filter(item => item.college_id === localCollege.id)
      .map(item => ({
        id: item.id,
        collegeId: item.college_id,
        name: item.name,
        degreeType: item.degree_type,
        durationYears: item.duration_years,
        annualFee: item.annual_fee,
        eligibility: item.eligibility
      }));

    const reviews = local.reviews
      .filter(item => item.college_id === localCollege.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(item => ({
        id: item.id,
        collegeId: item.college_id,
        studentName: item.student_name,
        rating: item.rating,
        title: item.title,
        body: item.body,
        createdAt: new Date(item.created_at)
      }));

    return res.json({
      college: {
        ...localCollege,
        courses,
        reviews
      },
      courses,
      placements: {
        placementRate: localCollege.placementRate,
        avgPackage: localCollege.avgPackage,
        highestPackage: localCollege.highestPackage,
        topRecruiters
      },
      reviews
    });
  }

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

  try {
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
  } catch {
    const local = getLocalData();
    const colleges = local.colleges
      .filter(college => ids.includes(college.id))
      .map(college => {
        const keyCourse = local.courses.find(course => course.college_id === college.id)?.name ?? null;
        return {
          id: college.id,
          name: college.name,
          city: college.city,
          state: college.state,
          averageFees: college.averageFees,
          placementRate: college.placementRate,
          rating: college.rating,
          keyCourse
        };
      });

    res.json({ colleges });
  }
};

