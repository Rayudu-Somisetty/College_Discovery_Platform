import { prisma } from '../lib/prisma';
import { getLocalData } from '../data/localData';

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
  let records = [] as Array<{
    courseName: string;
    closingRank: number;
    college: {
      id: number;
      name: string;
      slug: string;
      city: string;
      state: string;
    };
  }>;

  try {
    records = await prisma.examCutoff.findMany({
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
  } catch {
    const local = getLocalData();
    const collegeById = new Map(local.colleges.map(college => [college.id, college]));
    records = local.exam_cutoffs
      .filter(record => record.exam === exam)
      .map(record => {
        const college = collegeById.get(record.college_id);
        if (!college) return null;
        return {
          courseName: record.course_name,
          closingRank: record.closing_rank,
          college: {
            id: college.id,
            name: college.name,
            slug: college.slug,
            city: college.city,
            state: college.state
          }
        };
      })
      .filter((item): item is {
        courseName: string;
        closingRank: number;
        college: {
          id: number;
          name: string;
          slug: string;
          city: string;
          state: string;
        };
      } => item !== null)
      .sort((a, b) => a.closingRank - b.closingRank);
  }

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
