// app/pages/LoadingPage.tsx
import { LoadingSpinner } from '@/shared/components';
export const LoadingPage = () => (
  <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);