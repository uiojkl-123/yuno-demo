import { create } from 'zustand';
import { storage } from '../lib/storage';
import { Profile, StateTag } from '../data/types';

type Toast = {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error';
};

interface YunoState {
  profile: Profile | null;
  states: Record<string, StateTag>; // policyId -> state
  favorites: Set<string>;
  toasts: Toast[];
  setProfile: (p: Profile | null) => void;
  setState: (id: string, s: StateTag) => void;
  toggleFavorite: (id: string) => void;
  addToast: (t: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  hydrate: () => void;
}

const LS_PROFILE = 'yuno.profile';
const LS_STATES = 'yuno.states';

export const useYunoStore = create<YunoState>((set, get) => ({
  profile: null,
  states: {},
  favorites: new Set<string>(),
  toasts: [],
  setProfile: (p) => {
    storage.set(LS_PROFILE, p);
    set({ profile: p });
  },
  setState: (id, s) => {
    const curr = { ...get().states, [id]: s };
    storage.set(LS_STATES, curr);
    set({ states: curr });
  },
  toggleFavorite: (id) => {
    const favs = new Set(get().favorites);
    if (favs.has(id)) favs.delete(id);
    else favs.add(id);
    set({ favorites: favs });
  },
  addToast: (t) => {
    const id = Math.random().toString(36).slice(2);
    set({ toasts: [...get().toasts, { ...t, id }] });
    setTimeout(() => get().removeToast(id), 2500);
  },
  removeToast: (id) => set({ toasts: get().toasts.filter((x) => x.id !== id) }),
  hydrate: () => {
    const p = storage.get<Profile | null>(LS_PROFILE, null);
    const s = storage.get<Record<string, StateTag>>(LS_STATES, {});
    set({ profile: p, states: s });
  },
}));
