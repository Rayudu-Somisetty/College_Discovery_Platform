import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { prisma } from '../lib/prisma';

type SourceData = {
  colleges: Array<{
    id: number;
    slug: string;
    name: string;
    city: string;
    state: string;
    averageFees: number;
    rating: number;
    placementRate: number;
    avgPackage: number;
    highestPackage: number;
    overview: string;
  }>;
  courses: Array<{
    id: number;
    college_id: number;
    name: string;
    degree_type: string;
    duration_years: number;
    annual_fee: number;
    eligibility: string;
  }>;
  reviews: Array<{
    id: number;
    college_id: number;
    student_name: string;
    rating: number;
    title: string;
    body: string;
    created_at: string;
  }>;
  exam_cutoffs: Array<{
    id: number;
    college_id: number;
    exam: string;
    course_name: string;
    closing_rank: number;
    year: number;
  }>;
};

async function main() {
  const dataPath = join(__dirname, 'data.json');
  const raw = readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw) as SourceData;

  await prisma.$transaction([
    prisma.examCutoff.deleteMany(),
    prisma.review.deleteMany(),
    prisma.course.deleteMany(),
    prisma.college.deleteMany()
  ]);

  await prisma.college.createMany({
    data: data.colleges
  });

  await prisma.course.createMany({
    data: data.courses.map(course => ({
      id: course.id,
      collegeId: course.college_id,
      name: course.name,
      degreeType: course.degree_type,
      durationYears: course.duration_years,
      annualFee: course.annual_fee,
      eligibility: course.eligibility
    }))
  });

  await prisma.review.createMany({
    data: data.reviews.map(review => ({
      id: review.id,
      collegeId: review.college_id,
      studentName: review.student_name,
      rating: review.rating,
      title: review.title,
      body: review.body,
      createdAt: new Date(review.created_at)
    }))
  });

  await prisma.examCutoff.createMany({
    data: data.exam_cutoffs.map(cutoff => ({
      id: cutoff.id,
      collegeId: cutoff.college_id,
      exam: cutoff.exam,
      courseName: cutoff.course_name,
      closingRank: cutoff.closing_rank,
      year: cutoff.year
    }))
  });

  console.log('Database seeded successfully');
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
