'use client';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import React from 'react';
import { useYunoStore } from '../store/useYunoStore';
import ToastHost from '../components/Toast';
import OnboardingModal from '../components/OnboardingModal';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <ToastHost />
        <OnboardingModal />
        <div className="mx-auto max-w-5xl p-4">
          <header className="mb-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold">
              Yuno
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <a className="hover:underline" href="/explore">
                탐색
              </a>
              <a className="hover:underline" href="/calendar">
                달력
              </a>
              <a className="hover:underline" href="/me">
                마이페이지
              </a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
