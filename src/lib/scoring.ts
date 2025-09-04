import { Policy, Profile } from '../data/types';

const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));

export function matchScore(profile: Profile | null, policy: Policy): number {
  if (!profile) return 0.3; // 기본치
  let score = 0;
  if (policy.regionCodes.includes(profile.region_code)) score += 0.4;
  if (
    policy.targetBands.includes('uni') &&
    profile.education_level.includes('대학')
  )
    score += 0.3;
  if (
    policy.targetBands.includes('low_income') &&
    profile.income_tier.includes('하위')
  )
    score += 0.2;
  if (profile.interests.some((k) => policy.category.includes(k))) score += 0.1;
  return clamp(score);
}

export function urgencyScore(policy: Policy): number {
  if (!policy.deadlineDate) return 0.5;
  const now = new Date();
  const deadline = new Date(policy.deadlineDate);
  const diffDays = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays <= 0) return 0.1;
  if (diffDays <= 3) return 1;
  if (diffDays <= 7) return 0.8;
  if (diffDays <= 14) return 0.6;
  return 0.4;
}

export function popularityScore(policy: Policy): number {
  const m = policy.metrics || { views: 0, saves: 0, applyClicks: 0 };
  const weighted = m.views * 0.2 + m.saves * 0.6 + m.applyClicks * 1.0;
  const norm = Math.min(1, weighted / 1000);
  return norm;
}

export function finalScore(profile: Profile | null, policy: Policy): number {
  return (
    0.55 * matchScore(profile, policy) +
    0.3 * urgencyScore(policy) +
    0.15 * popularityScore(policy)
  );
}

export function sortByFinalScore(
  profile: Profile | null,
  list: Policy[]
): Policy[] {
  return [...list].sort(
    (a, b) => finalScore(profile, b) - finalScore(profile, a)
  );
}
