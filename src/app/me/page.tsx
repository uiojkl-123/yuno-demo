'use client';
import React from 'react';
import { useYunoStore } from '../../store/useYunoStore';
import ProfileForm from '../../components/ProfileForm';

export default function MePage() {
  const profile = useYunoStore((s) => s.profile);
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">마이페이지</h1>
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-base font-semibold">프로필</h2>
        <div className="mt-3">
          <ProfileForm />
        </div>
      </section>
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-base font-semibold">설정</h2>
        <div className="mt-2 flex items-center gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="rounded border" />
            알림 받기 (mock)
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="rounded border" />
            다크모드 (mock)
          </label>
        </div>
      </section>
    </div>
  );
}
