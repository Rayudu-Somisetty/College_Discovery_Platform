import { prisma } from '../lib/prisma';

type PredictionInput = {
  exam: string;
  rank: number;
};

type PredictionResult = {
  collegeId: number;
  collegeName: string;
  slug: string;
  city: string;
  state: string;
  courseName: string;
  closingRank: number;
  band: 'SAFE' | 'TARGET' | 'STRETCH';
};

export const predict = async ({ exam, rank }: PredictionInput): Promise<PredictionResult[]> => {
  const records = await prisma.examCutoff.findMany({
    where: { exam },
    include: {
      college: {
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          state: true
        }
      }
    },
    orderBy: { closingRank: 'asc' }
  });

  return records
    .map(record => {
      const band =
        rank <= 0.7 * record.closingRank
          ? 'SAFE'
          : rank <= 1.1 * record.closingRank
            ? 'TARGET'
            : rank <= 1.3 * record.closingRank
              ? 'STRETCH'
              : null;

      if (!band) {
        return null;
      }

      return {
        collegeId: record.college.id,
        collegeName: record.college.name,
        slug: record.college.slug,
        city: record.college.city,
        state: record.college.state,
        courseName: record.courseName,
        closingRank: record.closingRank,
        band
      };
    })
    .filter((result): result is PredictionResult => result !== null);
};
