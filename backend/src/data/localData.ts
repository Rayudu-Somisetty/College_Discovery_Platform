import { readFileSync } from 'fs';
import { join } from 'path';

type LocalData = {
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

let cached: LocalData | null = null;

export function getLocalData(): LocalData {
  if (cached) return cached;
  const raw = readFileSync(join(__dirname, 'data.json'), 'utf-8');
  cached = JSON.parse(raw) as LocalData;
  return cached;
}
