import React, { Suspense } from 'react';
import ExploreClient from './ExploreClient';

export default function ExplorePage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <ExploreClient />
    </Suspense>
  );
}
