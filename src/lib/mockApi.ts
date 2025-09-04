import { policies } from '../data/policies';
import { summaries } from '../data/summaries';
import { Policy, Profile, StateTag } from '../data/types';
import { finalScore } from './scoring';
import { storage } from './storage';

type Filters = Partial<{
  keyword: string;
  category: string;
  region: string;
  interest: string;
  sort: 'score' | 'deadline' | 'latest' | 'popular';
}>;

const delay = <T>(ms: number, data: T) =>
  new Promise<T>((res) => setTimeout(() => res(data), ms));

function filterAndScore(
  list: Policy[],
  filters: Filters,
  profile: Profile | null
): Policy[] {
  let r = list;
  if (filters.keyword) {
    const k = filters.keyword.toLowerCase();
    r = r.filter((p) =>
      [p.title, p.eligibilityRaw, p.benefitsRaw].some((t) =>
        t.toLowerCase().includes(k)
      )
    );
  }
  if (filters.category) r = r.filter((p) => p.category === filters.category);
  if (filters.region)
    r = r.filter((p) => p.regionCodes.includes(filters.region!));
  if (filters.interest)
    r = r.filter((p) => p.category.includes(filters.interest!));

  const withScore = r.map((p) => ({
    policy: p,
    score: finalScore(profile, p),
  }));
  switch (filters.sort) {
    case 'deadline':
      withScore.sort((a, b) => {
        const ad = a.policy.deadlineDate
          ? new Date(a.policy.deadlineDate).getTime()
          : Infinity;
        const bd = b.policy.deadlineDate
          ? new Date(b.policy.deadlineDate).getTime()
          : Infinity;
        return ad - bd;
      });
      break;
    case 'latest':
      withScore.sort(
        (a, b) =>
          new Date(b.policy.updatedAt).getTime() -
          new Date(a.policy.updatedAt).getTime()
      );
      break;
    case 'popular':
      withScore.sort((a, b) => {
        const am = a.policy.metrics || { views: 0, saves: 0, applyClicks: 0 };
        const bm = b.policy.metrics || { views: 0, saves: 0, applyClicks: 0 };
        return bm.views + bm.saves - (am.views + am.saves);
      });
      break;
    default:
      withScore.sort((a, b) => b.score - a.score);
  }
  return withScore.map((x) => x.policy);
}

const LS_PROFILE = 'yuno.profile';
const LS_STATES = 'yuno.states';

function getProfile(): Profile | null {
  return storage.get<Profile | null>(LS_PROFILE, null);
}

function updateLocalState(id: string, state: StateTag) {
  const curr = storage.get<Record<string, StateTag>>(LS_STATES, {});
  curr[id] = state;
  storage.set(LS_STATES, curr);
  return curr;
}

export const api = {
  listPolicies: async (filters: Filters) =>
    delay(300, filterAndScore(policies, filters, getProfile())),
  getPolicy: async (id: string) =>
    delay(
      200,
      policies.find((p) => p.id === id)
    ),
  getSummary: async (id: string) => delay(150, summaries[id]),
  saveState: async (id: string, state: StateTag) =>
    delay(100, updateLocalState(id, state)),
};

export type { Filters };
