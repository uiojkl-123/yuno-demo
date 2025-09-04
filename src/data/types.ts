export type Category =
  | '장학금'
  | '정부지원'
  | '대외활동'
  | '대회·연구'
  | '대학생활';
export type StateTag = 'saved' | 'applying' | 'review' | 'result';

export interface Policy {
  id: string;
  title: string;
  category: Category;
  regionCodes: string[];
  targetBands: string[];
  eligibilityRaw: string;
  benefitsRaw: string;
  howtoRaw: string;
  startDate?: string;
  deadlineDate?: string;
  resultDate?: string;
  applicationUrl: string;
  sourceUrl: string;
  updatedAt: string;
  metrics?: { views: number; saves: number; applyClicks: number };
}

export interface SummaryJSON {
  summary_3lines: [string, string, string];
  eligibility: string;
  benefits: string;
  how_to_apply: string;
  reading_level: 'plain' | 'verbatim';
  citations: { text: string; offset_start: number; offset_end: number }[];
}

export interface Profile {
  age: number;
  region: string;
  education_level: string;
  income_tier: string;
  employment_status: string;
  interests: string[];
  region_code: string;
  age_band: string;
}
