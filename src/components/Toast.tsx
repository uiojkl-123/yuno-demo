import React from 'react';
import { useYunoStore } from '../store/useYunoStore';

export function ToastHost() {
  const toasts = useYunoStore((s) => s.toasts);
  const remove = useYunoStore((s) => s.removeToast);
  return (
    <div className="fixed inset-x-0 top-2 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className={`max-w-md w-full rounded-md border shadow bg-white px-3 py-2 text-sm ${
            t.type === 'success'
              ? 'border-green-300'
              : t.type === 'error'
              ? 'border-red-300'
              : 'border-gray-200'
          }`}>
          <div className="flex items-start justify-between gap-3">
            <span>{t.message}</span>
            <button
              className="text-xs text-gray-500 hover:text-gray-800"
              onClick={() => remove(t.id)}
              aria-label="닫기">
              닫기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastHost;
